# 🔧 RFQ ENGINE — DOCUMENTAÇÃO TÉCNICA

**Arquivo Backend:** `backend/app/services/rfq_engine.py`  
**Linhas:** 673  
**Última Análise:** Junho 2025

---

## 1. VISÃO GERAL

O `rfq_engine.py` é o  motor de geração de texto para mensagens RFQ (Request for Quote) enviadas a bancos e brokers. Ele transforma dados estruturados de trades em texto formatado pronto para envio via WhatsApp, Email ou API.

### 1.1 Principais Responsabilidades

1. **Geração de Texto RFQ** — Transforma `RfqTrade` em mensagem formatada
2. **Cálculo de PPT** — Calcula Prompt Payment Date (data de liquidação)
3. **Validação de Trades** — Verifica campos obrigatórios por tipo de preço
4. **Instruções de Execução** — Gera texto para ordens Limit/Range/Resting
5. **Formatação por Contraparte** — Adapta idioma/terminologia (Broker LME vs Banco)

### 1.2 Regras de Negócio Fundamentais

| Regra | Descrição |
|-------|-----------|
| **Duas Legs Obrigatórias** | Todo trade (Swap ou Forward) tem obrigatoriamente 2 legs |
| **Forward = Leg2 C2R** | No Forward, Leg2 é sempre C2R (Cash Settlement do Prompt Date) |
| **Company Header** | Deve ser "Alcast Brasil" ou "Alcast Trading" (selecionável) |
| **Idioma por Contraparte** | Brokers LME → Inglês técnico; Bancos → Português simplificado |

---

## 2. ESTRUTURAS DE DADOS

### 2.1 Enums

```python
class Side(str, Enum):
    BUY = "buy"
    SELL = "sell"

class PriceType(str, Enum):
    AVG = "AVG"           # Monthly Average
    AVG_INTER = "AVGInter" # Average between dates
    FIX = "Fix"           # Fixed price on date
    C2R = "C2R"           # Close-to-Reference

class TradeType(str, Enum):
    SWAP = "Swap"         # Two legs (buy + sell)
    FORWARD = "Forward"   # Two legs: Leg1 + Leg2 sempre C2R (Cash Settlement)

class OrderType(str, Enum):
    AT_MARKET = "At Market"  # Execute immediately
    LIMIT = "Limit"          # Execute at limit price or better
    RANGE = "Range"          # Execute within price range
    RESTING = "Resting"      # Permanent order until cancelled
```

### 2.2 Dataclasses

```python
@dataclass
class Leg:
    side: Side
    price_type: PriceType
    quantity_mt: float
    
    # For AVG (required):
    month_name: Optional[str] = None    # "January", "February", ...
    year: Optional[int] = None          # 2025
    
    # For AVGInter (required):
    start_date: Optional[date] = None   # Date object
    end_date: Optional[date] = None     # Date object
    
    # For Fix/C2R:
    fixing_date: Optional[date] = None  # Date object (required for C2R)
    
    # Override:
    ppt: Optional[date] = None          # Custom PPT (overrides computed)
    
    # Order instruction:
    order: Optional[OrderInstruction] = None

@dataclass
class OrderInstruction:
    order_type: OrderType
    validity: Optional[str] = None      # "GTD", "GTC", specific date
    limit_price: Optional[str] = None   # "$2,450.00"
    range_min: Optional[str] = None     # For Range orders
    range_max: Optional[str] = None     # For Range orders

@dataclass
class RfqTrade:
    trade_type: TradeType
    leg1: Leg
    leg2: Leg                           # SEMPRE obrigatório (C2R para Forward = Cash Settlement)
    sync_ppt: bool = False              # Synchronize PPT between legs
    holidays: Optional[List[date]] = None
    company_header: str = None          # 'Alcast Brasil' ou 'Alcast Trading'
    company_label_for_payoff: str = "Company"
    counterparty_type: Optional[str] = None  # 'broker' ou 'bank' (define idioma)

@dataclass
class ValidationError:
    field: str
    message: str
    leg: Optional[str] = None           # "leg1" or "leg2"
```

---

## 3. FUNÇÕES PRINCIPAIS

### 3.1 `generate_rfq_text(trade: RfqTrade) -> str`

**Entrada:** `RfqTrade` completo  
**Saída:** Texto formatado da RFQ

**Lógica:**

1. Valida trade via `validate_trade()`
2. Se houver erros, lança `ValueError` com lista de erros
3. Gera header se `company_header` fornecido
4. Gera texto de cada leg via `build_leg_text()`
5. Gera instrução de ordem via `build_execution_instruction()`
6. Gera texto de payoff esperado via `build_expected_payoff_text()`
7. Concatena todas as partes

**Exemplo de Output (Broker LME - Inglês):**

```
Alcast Brasil

Trade 1
-------
Buy 500 MT of Primary Aluminum, March 2025 Average
PPT: April 2, 2025

Sell 500 MT of Primary Aluminum, Fixing Date: March 15, 2025
PPT: April 2, 2025

Order: At Market

Expected Payoff:
If realized price > fixing price → Alcast receives difference
If realized price < fixing price → Alcast pays difference
```

**Exemplo de Output (Banco - Português):**

```
Alcast Trading

Operação 1
----------
Compra de 500 MT de Alumínio Primário, Média Março 2025
Data de Pagamento: 02/04/2025

Venda de 500 MT de Alumínio Primário, Data de Fixação: 15/03/2025
Data de Pagamento: 02/04/2025

Execução: A Mercado
```

> ⚠️ **REGRA CRÍTICA:** O PPT é SEMPRE o mesmo para ambas as pernas. O PPT da leg flutuante (AVG/AVGInter) determina o PPT do trade inteiro. A leg fixa (Fix/C2R) herda esse mesmo PPT.

### 3.2 `compute_ppt_for_leg(leg: Leg, holidays: List[date]) -> date`

**Entrada:** Leg + lista de feriados  
**Saída:** Data do PPT (Prompt Payment Date)

**Regras por PriceType:**

| PriceType | Regra PPT |
|-----------|-----------|
| AVG | 2 dias úteis após o último dia do mês de referência |
| AVGInter | 2 dias úteis após `end_date` |
| Fix | **HERDA o PPT da leg flutuante** (não calcula independente) |
| C2R | **HERDA o PPT da leg flutuante** (não calcula independente) |

> ⚠️ **REGRA CRÍTICA DE PPT:**  
> O PPT é ÚNICO para todo o trade. A leg flutuante (AVG ou AVGInter) define o PPT do trade.  
> A leg fixa (Fix ou C2R) SEMPRE usa o mesmo PPT da leg flutuante.  
> Exemplo: AVG April 2026 → PPT = 2 BD após 30/04 = 04.05.2026. Fix também terá PPT = 04.05.2026.

**Lógica de Dias Úteis:**

```python
def add_business_days(start: date, days: int, holidays: List[date]) -> date:
    current = start
    added = 0
    while added < days:
        current += timedelta(days=1)
        if current.weekday() < 5 and current not in holidays:
            added += 1
    return current
```

### 3.3 `build_leg_text(leg: Leg, index: int, ppt: date) -> str`

**Entrada:** Leg, índice (1 ou 2), PPT calculado  
**Saída:** Texto formatado da leg

**Formato por PriceType:**

| PriceType | Formato |
|-----------|---------|
| AVG | `"{Side} {qty} MT of Primary Aluminum, {Month} {Year} Average"` |
| AVGInter | `"{Side} {qty} MT of Primary Aluminum, Average from {start} to {end}"` |
| Fix | `"{Side} {qty} MT of Primary Aluminum, Fixing Date: {date}"` |
| C2R | `"{Side} {qty} MT of Primary Aluminum, C2R on {date}"` |

### 3.4 `build_execution_instruction(trade: RfqTrade) -> str`

**Entrada:** RfqTrade  
**Saída:** Texto de instrução de execução

**Exemplos:**

| OrderType | Output |
|-----------|--------|
| At Market | `"Order: At Market"` |
| Limit | `"Order: Limit at $2,450.00, GTD March 20"` |
| Range | `"Order: Range $2,400.00 - $2,500.00"` |
| Resting | `"Order: Resting at $2,450.00"` |

### 3.5 `build_expected_payoff_text(trade: RfqTrade) -> str`

**Entrada:** RfqTrade  
**Saída:** Texto explicativo do payoff esperado

**Lógica:**

- Para Swap: Explica cenários de ganho/perda baseado na diferença de preços
- Para Forward: Explica cenário simples de compra/venda

**Exemplo (Swap):**

```
Expected Payoff:
If March Average > Fixing Price:
  - Alcast receives the difference × 500 MT
If March Average < Fixing Price:
  - Alcast pays the difference × 500 MT
```

### 3.6 `validate_trade(trade: RfqTrade) -> List[ValidationError]`

**Entrada:** RfqTrade  
**Saída:** Lista de erros de validação

**Validações:**

| Condição | Erro |
|----------|------|
| Swap sem leg2 | `"leg2 is required for Swap trades"` |
| AVG sem month_name | `"month_name is required for AVG price type"` |
| AVG sem year | `"year is required for AVG price type"` |
| AVGInter sem start_date | `"start_date is required for AVGInter"` |
| AVGInter sem end_date | `"end_date is required for AVGInter"` |
| C2R sem fixing_date | `"fixing_date is required for C2R"` |
| quantity_mt ≤ 0 | `"quantity_mt must be positive"` |

### 3.7 `compute_trade_ppt_dates(trade: RfqTrade) -> Dict[str, date]`

**Entrada:** RfqTrade  
**Saída:** Dicionário com PPT do trade (único para ambas as legs)

**Lógica:**

1. Identifica qual leg é flutuante (AVG ou AVGInter)
2. Calcula o PPT baseado na leg flutuante (2 BD após data de observação)
3. Aplica o MESMO PPT para ambas as legs
4. Retorna `{"trade_ppt": date, "leg1_ppt": date, "leg2_ppt": date}` (todos iguais)

> **Nota:** O campo `sync_ppt` é legado e sempre `True` na prática, pois o PPT é intrinsecamente sincronizado.

---

## 4. CALENDÁRIO DE FERIADOS

### 4.1 Classe HolidayCalendar

```python
class HolidayCalendar:
    """
    Gerencia feriados para cálculo de dias úteis.
    Pode ser configurado por país/região.
    """
    
    def __init__(self, holidays: Optional[List[date]] = None):
        self.holidays = set(holidays or [])
    
    def is_business_day(self, d: date) -> bool:
        return d.weekday() < 5 and d not in self.holidays
    
    def add_holiday(self, d: date):
        self.holidays.add(d)
    
    def get_next_business_day(self, d: date) -> date:
        current = d
        while not self.is_business_day(current):
            current += timedelta(days=1)
        return current
```

### 4.2 Feriados Default (LME UK)

```python
DEFAULT_UK_HOLIDAYS_2025 = [
    date(2025, 1, 1),    # New Year
    date(2025, 4, 18),   # Good Friday
    date(2025, 4, 21),   # Easter Monday
    date(2025, 5, 5),    # Early May Bank Holiday
    date(2025, 5, 26),   # Spring Bank Holiday
    date(2025, 8, 25),   # Summer Bank Holiday
    date(2025, 12, 25),  # Christmas
    date(2025, 12, 26),  # Boxing Day
]
```

---

## 5. INTEGRAÇÃO COM FRONTEND

### 5.1 Mapeamento de Tipos TypeScript

```typescript
// src/types/enums.ts

export enum RfqTradeType {
  SWAP = 'Swap',
  FORWARD = 'Forward',
}

export enum RfqPriceType {
  AVG = 'AVG',
  AVG_INTER = 'AVGInter',
  FIX = 'Fix',
  C2R = 'C2R',
}

export enum RfqOrderType {
  AT_MARKET = 'At Market',
  LIMIT = 'Limit',
  RANGE = 'Range',
  RESTING = 'Resting',
}

export enum RfqSide {
  BUY = 'buy',
  SELL = 'sell',
}
```

```typescript
// src/types/models.ts

export interface RfqLegInput {
  side: RfqSide;
  price_type: RfqPriceType;
  quantity_mt: number;
  month_name?: string;     // For AVG
  year?: number;           // For AVG
  start_date?: string;     // For AVGInter (YYYY-MM-DD)
  end_date?: string;       // For AVGInter (YYYY-MM-DD)
  fixing_date?: string;    // For Fix/C2R (YYYY-MM-DD)
  ppt?: string;            // Override PPT (YYYY-MM-DD)
  order?: RfqOrderInstruction;
}

export interface RfqPreviewRequest {
  trade_type: RfqTradeType;
  leg1: RfqLegInput;
  leg2?: RfqLegInput;
  sync_ppt?: boolean;
  holidays?: string[];     // Array of YYYY-MM-DD
  company_header?: string;
  company_label_for_payoff?: string;
}

export interface RfqPreviewResponse {
  text: string;
  trade_type?: string;
  leg_count?: number;
  total_quantity_mt?: number;
}
```

### 5.2 Endpoint de Preview

```
POST /rfqs/preview
Content-Type: application/json

Request Body: RfqPreviewRequest
Response: RfqPreviewResponse
```

**Exemplo de Request:**

```json
{
  "trade_type": "Swap",
  "leg1": {
    "side": "buy",
    "price_type": "AVG",
    "quantity_mt": 500,
    "month_name": "March",
    "year": 2025
  },
  "leg2": {
    "side": "sell",
    "price_type": "Fix",
    "quantity_mt": 500,
    "fixing_date": "2025-03-15"
  },
  "sync_ppt": true,
  "company_header": "Alcast Metais",
  "company_label_for_payoff": "Alcast"
}
```

**Exemplo de Response:**

```json
{
  "text": "Alcast Metais\n\nTrade 1\n-------\nBuy 500 MT of Primary Aluminum, March 2025 Average\nPPT: April 15, 2025\n\nSell 500 MT of Primary Aluminum, Fixing Date: March 15, 2025\nPPT: March 17, 2025\n\nOrder: At Market\n\nExpected Payoff:\nIf March Average > Fixing Price:\n  - Alcast receives the difference × 500 MT\nIf March Average < Fixing Price:\n  - Alcast pays the difference × 500 MT",
  "trade_type": "Swap",
  "leg_count": 2,
  "total_quantity_mt": 1000
}
```

---

## 6. CASOS DE USO COMUNS

### 6.1 Swap AVG + Fix (Mais Comum)

**Cenário:** Empresa quer fixar preço de compra em relação à média mensal.

```python
trade = RfqTrade(
    trade_type=TradeType.SWAP,
    leg1=Leg(
        side=Side.BUY,
        price_type=PriceType.AVG,
        quantity_mt=500,
        month_name="March",
        year=2025
    ),
    leg2=Leg(
        side=Side.SELL,
        price_type=PriceType.FIX,
        quantity_mt=500,
        fixing_date=date(2025, 3, 15)
    ),
    sync_ppt=True,
    company_header="Alcast Metais"
)
```

### 6.2 Forward AVGInter

**Cenário:** Compra a preço médio entre duas datas específicas.

```python
trade = RfqTrade(
    trade_type=TradeType.FORWARD,
    leg1=Leg(
        side=Side.BUY,
        price_type=PriceType.AVG_INTER,
        quantity_mt=250,
        start_date=date(2025, 3, 1),
        end_date=date(2025, 3, 15)
    ),
    company_header="Alcast Metais"
)
```

### 6.3 Swap com Ordem Limit

**Cenário:** Swap que só deve ser executado se preço atingir limite.

```python
trade = RfqTrade(
    trade_type=TradeType.SWAP,
    leg1=Leg(
        side=Side.BUY,
        price_type=PriceType.AVG,
        quantity_mt=500,
        month_name="April",
        year=2025,
        order=OrderInstruction(
            order_type=OrderType.LIMIT,
            limit_price="$2,450.00",
            validity="GTD April 30"
        )
    ),
    leg2=Leg(
        side=Side.SELL,
        price_type=PriceType.FIX,
        quantity_mt=500,
        fixing_date=date(2025, 4, 15)
    ),
    sync_ppt=True
)
```

---

## 7. TRATAMENTO DE ERROS

### 7.1 Erros de Validação

```python
try:
    text = generate_rfq_text(trade)
except ValueError as e:
    errors = e.args[0]  # List of ValidationError
    for error in errors:
        print(f"[{error.leg}] {error.field}: {error.message}")
```

### 7.2 Erros Comuns

| Erro | Causa | Solução |
|------|-------|---------|
| `"month_name is required for AVG"` | AVG sem mês | Adicionar `month_name` |
| `"leg2 is required for Swap"` | Swap com apenas 1 leg | Adicionar `leg2` ou usar Forward |
| `"fixing_date is required for C2R"` | C2R sem data | Adicionar `fixing_date` |
| `"quantity_mt must be positive"` | Quantidade zero ou negativa | Usar valor > 0 |

---

## 8. EXTENSIBILIDADE

### 8.1 Adicionar Novo PriceType

1. Adicionar valor ao enum `PriceType`
2. Atualizar `validate_trade()` com novas validações
3. Atualizar `compute_ppt_for_leg()` com nova regra PPT
4. Atualizar `build_leg_text()` com novo formato de texto
5. Atualizar tipos TypeScript no frontend
6. Adicionar opção no formulário

### 8.2 Adicionar Novo TradeType

1. Adicionar valor ao enum `TradeType`
2. Atualizar `generate_rfq_text()` com nova lógica
3. Atualizar `build_expected_payoff_text()` com novo cenário
4. Atualizar tipos TypeScript no frontend
5. Adicionar opção no formulário

---

**FIM DO DOCUMENTO TÉCNICO**
