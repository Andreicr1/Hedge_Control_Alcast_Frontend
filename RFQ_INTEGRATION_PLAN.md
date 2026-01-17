# 📋 PLANO DE IMPLEMENTAÇÃO — INTEGRAÇÃO RFQ FRONTEND ↔ BACKEND

**Projeto:** Hedge Control — Sistema de Gestão de Commodities  
**Módulo:** Request for Quote (RFQ)  
**Data:** Junho 2025  
**Classificação:** Crítico / Core Business  
**Autor:** Engenharia de Sistemas

---

## 1. SUMÁRIO EXECUTIVO

O módulo RFQ é o coração da operação de hedge da Alcast. Este documento descreve o plano de integração entre o formulário frontend (`RFQFormPage.tsx`) e o motor de geração de mensagens do backend (`rfq_engine.py`).

### 1.1 Situação Atual

| Componente | Status | Observação |
|------------|--------|------------|
| `rfq_engine.py` | ✅ Pronto | 673 linhas, motor de geração completo |
| API Routes (`/rfqs/*`) | ✅ Pronto | CRUD, award, preview, send attempts |
| Frontend Services | ✅ Pronto | `rfqs.service.ts`, `useRfqs.ts` |
| Types/Enums | ✅ Pronto | `RfqTradeType`, `RfqPriceType`, `RfqSide`, etc. |
| `RFQsPageIntegrated.tsx` | 🟡 Parcial | Lista/ranking funcionando, precisa melhorias |
| `RFQFormPage.tsx` | ❌ NÃO Integrado | Formulário básico, geração de texto local |

### 1.2 Objetivo

Integrar completamente o `RFQFormPage.tsx` com o backend para:
1. Mapear campos do formulário para os tipos do `rfq_engine`
2. Gerar preview de mensagem via API (`POST /rfqs/preview`)
3. Selecionar contrapartes e criar invites
4. Enviar RFQ com rastreamento
5. Coletar cotações e realizar ranking
6. Premiar cotação vencedora e gerar contratos automaticamente

---

## 2. ARQUITETURA DO BACKEND (rfq_engine.py)

### 2.1 Tipos de Trade (TradeType)
```
Swap    → Troca de exposições entre duas pernas (Leg1 + Leg2)
Forward → Operação com uma perna apenas (Leg1)
```

### 2.2 Tipos de Preço (PriceType)
| Código | Nome Completo | Campos Obrigatórios | Descrição |
|--------|---------------|---------------------|-----------|
| `AVG` | Monthly Average | `month_name`, `year` | Média mensal LME |
| `AVGInter` | Average Intermonth | `start_date`, `end_date` | Média entre datas |
| `Fix` | Fixing | `fixing_date` (opcional) | Preço fixo na data |
| `C2R` | Close-to-Reference | `fixing_date` | Preço de fechamento referência |

### 2.3 Tipos de Ordem (OrderType)
| Tipo | Descrição | Campos |
|------|-----------|--------|
| `At Market` | Execução imediata | — |
| `Limit` | Preço limite | `limit_price`, `validity` |
| `Range` | Faixa de preço | `range_min`, `range_max` |
| `Resting` | Ordem permanente | `limit_price` |

### 2.4 Estrutura de Leg (RfqLegInput)
```typescript
interface RfqLegInput {
  side: 'buy' | 'sell';
  price_type: 'AVG' | 'AVGInter' | 'Fix' | 'C2R';
  quantity_mt: number;
  
  // Para AVG:
  month_name?: string;  // 'January', 'February', ...
  year?: number;        // 2025
  
  // Para AVGInter:
  start_date?: string;  // 'YYYY-MM-DD'
  end_date?: string;    // 'YYYY-MM-DD'
  
  // Para Fix/C2R:
  fixing_date?: string; // 'YYYY-MM-DD'
  
  // Opcional:
  ppt?: string;         // Override PPT (Prompt Payment Date)
  order?: RfqOrderInstruction;
}
```

### 2.5 Estrutura de Preview Request
```typescript
interface RfqPreviewRequest {
  trade_type: 'Swap' | 'Forward';
  leg1: RfqLegInput;
  leg2: RfqLegInput;    // SEMPRE obrigatório (C2R para Forward = Cash Settlement)
  sync_ppt?: boolean;   // Sincronizar PPT entre pernas
  holidays?: string[];  // Lista de feriados para cálculo PPT
  company_header: 'Alcast Brasil' | 'Alcast Trading';  // Seleção no topo do form
  company_label_for_payoff?: string;
  counterparty_type?: 'broker' | 'bank';  // Define idioma/terminologia
}
```

### 2.6 Regras de Linguagem por Tipo de Contraparte

| Tipo Contraparte | Idioma | Terminologia | Exemplo |
|------------------|--------|--------------|--------|
| **Broker LME** | Inglês | Técnica/Padrão LME | "Buy 500 MT, March 2025 Average" |
| **Banco** | Português | Simplificada | "Compra de 500 MT, Média Março 2025" |

> ⚠️ **IMPORTANTE:** O `rfq_engine` no backend possui lógica específica para formatar mensagens de acordo com o tipo de contraparte. Verificar as funções de geração de texto para garantir compatibilidade.

---

## 3. MAPEAMENTO DE CAMPOS: FRONTEND → BACKEND

### 3.1 Tipo de Preço (PriceType)
| Frontend Atual | Backend `RfqPriceType` | Ação |
|----------------|------------------------|------|
| "Fixo" | `Fix` | Renomear opção |
| "Flutuante" | `AVG` | Renomear + adicionar campos mês/ano |
| "LME" | `AVGInter` | Renomear + adicionar campos data |
| "Prêmio" | ❌ Não existe | Remover ou mapear para campo separado |
| — | `C2R` | Adicionar opção |

### 3.2 Operação (Side)
| Frontend Atual | Backend `RfqSide` | Ação |
|----------------|-------------------|------|
| "Compra" | `buy` | Mapear diretamente |
| "Venda" | `sell` | Mapear diretamente |

### 3.3 Tipo de Trade (TradeType)
| Frontend Atual | Backend `RfqTradeType` | Ação |
|----------------|------------------------|------|
| "Swap" | `Swap` | ✅ OK |
| "Forward" | `Forward` | ✅ OK — Leg2 sempre C2R (Cash Settlement) |
| "Opção" | ❌ Não suportado | Remover (fora do escopo) |
| "Futuro" | ❌ Não suportado | Remover (fora do escopo) |

### 3.4 Company Header (Seleção no Topo do Form)
| Opção | Valor `company_header` |
|-------|------------------------|
| Alcast Brasil | `"Alcast Brasil"` |
| Alcast Trading | `"Alcast Trading"` |

### 3.5 Linguagem por Tipo de Contraparte
| Tipo Contraparte | Idioma | Terminologia |
|------------------|--------|-------------|
| Broker LME | Inglês | Técnica/Padrão LME |
| Banco | Português | Simplificada |

---

## 4. ESPECIFICAÇÃO DE TAREFAS

### FASE 1: REFATORAÇÃO DO FORMULÁRIO (Prioridade: CRÍTICA)

#### Task 1.1: Atualizar Tipos de Preço
**Arquivo:** `RFQFormPage.tsx`  
**Esforço:** 2h

```tsx
// Substituir opções hardcoded por enum do backend
const PRICE_TYPE_OPTIONS = [
  { value: 'AVG', label: 'Média Mensal (AVG)' },
  { value: 'AVGInter', label: 'Média Inter-datas (AVGInter)' },
  { value: 'Fix', label: 'Preço Fixo (Fix)' },
  { value: 'C2R', label: 'Close-to-Reference (C2R)' },
];
```

#### Task 1.2: Adicionar Campos Condicionais por Tipo de Preço
**Arquivo:** `RFQFormPage.tsx`  
**Esforço:** 4h

| PriceType | Campos a Exibir |
|-----------|-----------------|
| AVG | Select Mês + Input Ano |
| AVGInter | DatePicker Data Início + Data Fim |
| Fix | DatePicker Data Fixing (opcional) |
| C2R | DatePicker Data Fixing (obrigatório) |

#### Task 1.3: Remover Tipos de Trade Não Suportados
**Arquivo:** `RFQFormPage.tsx`  
**Esforço:** 0.5h

```tsx
const TRADE_TYPE_OPTIONS = [
  { value: 'Swap', label: 'Swap' },
  { value: 'Forward', label: 'Forward' },
];
```

#### Task 1.4: Auto-Configurar Leg 2 para C2R quando TradeType = Forward
**Arquivo:** `RFQFormPage.tsx`  
**Esforço:** 1.5h

**Regra de Negócio:**  
Todo trade tem obrigatoriamente 2 legs (uma fixa e uma flutuante/desconhecida).  
No Forward, a Leg 2 representa o **Cash Settlement do Prompt Date**, sempre como C2R.

```tsx
// Quando Forward é selecionado, Leg 2 é automaticamente C2R
useEffect(() => {
  if (tradeType === 'Forward') {
    setLeg2PriceType('C2R');
    setLeg2Operation(leg1Operation === 'Compra' ? 'Venda' : 'Compra'); // Oposta à Leg1
  }
}, [tradeType, leg1Operation]);

// Leg 2 sempre visível, mas campos bloqueados quando Forward
<FioriCard>
  <h3>Leg 2 {tradeType === 'Forward' && '(Cash Settlement)'}</h3>
  <FioriSelect
    label="Tipo de Preço"
    value={leg2PriceType}
    onChange={(e) => setLeg2PriceType(e.target.value)}
    disabled={tradeType === 'Forward'} // Bloqueado em Forward (sempre C2R)
  >
    ...
  </FioriSelect>
</FioriCard>
```

---

### FASE 2: INTEGRAÇÃO COM API PREVIEW (Prioridade: CRÍTICA)

#### Task 2.1: Criar Hook useRfqPreview
**Arquivo:** `src/hooks/useRfqs.ts`  
**Esforço:** 2h

```typescript
export function useRfqPreview() {
  const [state, setState] = useState<{
    preview: RfqPreviewResponse | null;
    isLoading: boolean;
    error: ApiError | null;
  }>({ preview: null, isLoading: false, error: null });

  const generatePreview = useCallback(async (data: RfqPreviewRequest) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const result = await previewRfq(data);
      setState({ preview: result, isLoading: false, error: null });
      return result;
    } catch (err) {
      setState({ preview: null, isLoading: false, error: err as ApiError });
      throw err;
    }
  }, []);

  return { ...state, generatePreview };
}
```

#### Task 2.2: Integrar Preview no Formulário
**Arquivo:** `RFQFormPage.tsx`  
**Esforço:** 3h

```tsx
const { preview, isLoading: isPreviewLoading, generatePreview } = useRfqPreview();

const handleGeneratePreview = async () => {
  const request: RfqPreviewRequest = {
    trade_type: tradeType as RfqTradeType,
    leg1: {
      side: leg1Operation === 'Compra' ? 'buy' : 'sell',
      price_type: leg1PriceType as RfqPriceType,
      quantity_mt: parseFloat(quantity),
      month_name: leg1PriceType === 'AVG' ? leg1Month : undefined,
      year: leg1PriceType === 'AVG' ? leg1Year : undefined,
      start_date: leg1PriceType === 'AVGInter' ? leg1StartDate : undefined,
      end_date: leg1PriceType === 'AVGInter' ? leg1EndDate : undefined,
      fixing_date: ['Fix', 'C2R'].includes(leg1PriceType) ? leg1FixingDate : undefined,
    },
    leg2: tradeType === 'Swap' ? { /* similar */ } : undefined,
    sync_ppt: syncPFT,
  };
  
  await generatePreview(request);
};
```

#### Task 2.3: Exibir Texto Gerado pelo Backend
**Arquivo:** `RFQFormPage.tsx`  
**Esforço:** 1h

```tsx
<FioriTextarea
  value={preview?.text || '(Clique em "Gerar Preview" para visualizar)'}
  readOnly
  rows={12}
  fullWidth
/>
```

---

### FASE 3: SELEÇÃO DE CONTRAPARTES (Prioridade: ALTA)

#### Task 3.1: Criar Componente CounterpartySelector
**Arquivo:** `src/app/components/rfq/CounterpartySelector.tsx`  
**Esforço:** 6h

**Requisitos:**
- Multi-select checkbox list
- Filtro por tipo (Bank/Broker)
- Exibir canal preferido (WhatsApp/Email/API)
- Exibir rating de crédito
- Estado de seleção persistente

```tsx
interface CounterpartySelectorProps {
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  filterType?: CounterpartyType;
}

export function CounterpartySelector({ 
  selectedIds, 
  onChange, 
  filterType 
}: CounterpartySelectorProps) {
  const { counterparties } = useCounterparties();
  
  const filtered = filterType 
    ? counterparties.filter(c => c.type === filterType)
    : counterparties;
  
  return (
    <div className="space-y-2">
      {filtered.map(cp => (
        <div key={cp.id} className="flex items-center gap-2">
          <FioriCheckbox
            checked={selectedIds.includes(cp.id)}
            onChange={(e) => {
              if (e.target.checked) {
                onChange([...selectedIds, cp.id]);
              } else {
                onChange(selectedIds.filter(id => id !== cp.id));
              }
            }}
          />
          <span>{cp.name}</span>
          <Badge>{cp.type}</Badge>
          <Badge variant="secondary">{cp.rfq_channel_type}</Badge>
        </div>
      ))}
    </div>
  );
}
```

#### Task 3.2: Integrar Selector no RFQFormPage
**Arquivo:** `RFQFormPage.tsx`  
**Esforço:** 2h

```tsx
const [selectedCounterparties, setSelectedCounterparties] = useState<number[]>([]);

<FioriCard>
  <h3>Contrapartes</h3>
  <CounterpartySelector
    selectedIds={selectedCounterparties}
    onChange={setSelectedCounterparties}
  />
</FioriCard>
```

---

### FASE 4: CRIAÇÃO DE RFQ (Prioridade: ALTA)

#### Task 4.1: Implementar Submit do Formulário
**Arquivo:** `RFQFormPage.tsx`  
**Esforço:** 4h

```tsx
const { mutate: createRfqMutation, isLoading } = useCreateRfq();

const handleSubmit = async () => {
  const rfqData: RfqCreate = {
    rfq_number: `RFQ-${Date.now()}`, // Backend pode auto-gerar
    so_id: selectedSalesOrderId,     // Vincular a uma Sales Order
    quantity_mt: parseFloat(quantity),
    period: computePeriod(),         // Derivar do leg1/leg2
    message_text: preview?.text,     // Texto do rfq_engine
    invitations: selectedCounterparties.map(cpId => ({
      counterparty_id: cpId,
      status: 'sent',
    })),
    trade_specs: [
      {
        trade_type: tradeType,
        leg1: buildLegData(leg1State),
        leg2: tradeType === 'Swap' ? buildLegData(leg2State) : null,
        sync_ppt: syncPFT,
      }
    ],
  };
  
  const result = await createRfqMutation(rfqData);
  if (result) {
    navigate(`/financeiro/rfqs/${result.id}`);
  }
};
```

#### Task 4.2: Vincular RFQ a Sales Order
**Arquivo:** `RFQFormPage.tsx`  
**Esforço:** 2h

**Requisitos:**
- Adicionar Select para escolher Sales Order existente
- OU receber so_id via query param quando iniciado de uma SO

```tsx
const [searchParams] = useSearchParams();
const soIdFromParams = searchParams.get('so_id');

const { salesOrders } = useSalesOrders();

<FioriSelect
  label="Sales Order Vinculada"
  value={selectedSoId}
  onChange={(e) => setSelectedSoId(parseInt(e.target.value))}
>
  <option value="">Selecione uma SO...</option>
  {salesOrders.map(so => (
    <option key={so.id} value={so.id}>
      {so.so_number} - {so.customer?.name}
    </option>
  ))}
</FioriSelect>
```

---

### FASE 5: ENVIO DE RFQ (Prioridade: ALTA)

#### Task 5.1: Botão de Envio com Tracking
**Arquivo:** `RFQFormPage.tsx` ou `RFQsPageIntegrated.tsx`  
**Esforço:** 3h

```tsx
const { mutate: sendRfqMutation } = useSendRfq();

const handleSendRfq = async (rfqId: number, channel: 'email' | 'whatsapp' | 'api') => {
  await sendRfqMutation(rfqId, {
    channel,
    status: 'queued',
  });
  toast.success(`RFQ enviada via ${channel}`);
};
```

#### Task 5.2: Exibir Histórico de Tentativas de Envio
**Arquivo:** `RFQsPageIntegrated.tsx`  
**Esforço:** 2h

```tsx
const { sendAttempts } = useSendAttempts(rfqId);

<div className="space-y-2">
  <h4>Histórico de Envio</h4>
  {sendAttempts.map(attempt => (
    <div key={attempt.id} className="flex items-center gap-2">
      <Badge variant={attempt.status === 'sent' ? 'success' : 'error'}>
        {attempt.status}
      </Badge>
      <span>{attempt.channel}</span>
      <span>{formatDateTime(attempt.created_at)}</span>
    </div>
  ))}
</div>
```

---

### FASE 6: COLETA DE COTAÇÕES (Prioridade: ALTA)

#### Task 6.1: Formulário de Inserção de Cotação
**Arquivo:** `src/app/components/rfq/QuoteEntryForm.tsx`  
**Esforço:** 4h

```tsx
interface QuoteEntryFormProps {
  rfqId: number;
  counterparties: Counterparty[];
  onQuoteAdded: () => void;
}

export function QuoteEntryForm({ rfqId, counterparties, onQuoteAdded }: QuoteEntryFormProps) {
  const [counterpartyId, setCounterpartyId] = useState<number | null>(null);
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  
  const { mutate: addQuote } = useAddQuote();
  
  const handleSubmit = async () => {
    const groupId = `grp-${counterpartyId}-${Date.now()}`;
    
    // Adicionar leg Buy
    if (buyPrice) {
      await addQuote(rfqId, {
        counterparty_id: counterpartyId,
        counterparty_name: counterparties.find(c => c.id === counterpartyId)?.name || '',
        quote_price: parseFloat(buyPrice),
        leg_side: 'buy',
        quote_group_id: groupId,
        status: 'quoted',
      });
    }
    
    // Adicionar leg Sell
    if (sellPrice) {
      await addQuote(rfqId, {
        counterparty_id: counterpartyId,
        counterparty_name: counterparties.find(c => c.id === counterpartyId)?.name || '',
        quote_price: parseFloat(sellPrice),
        leg_side: 'sell',
        quote_group_id: groupId,
        status: 'quoted',
      });
    }
    
    onQuoteAdded();
  };
  
  return (
    <div className="grid grid-cols-3 gap-4">
      <FioriSelect
        label="Contraparte"
        value={counterpartyId?.toString() || ''}
        onChange={(e) => setCounterpartyId(parseInt(e.target.value))}
      >
        {counterparties.map(cp => (
          <option key={cp.id} value={cp.id}>{cp.name}</option>
        ))}
      </FioriSelect>
      <FioriInput
        label="Preço Buy"
        type="number"
        value={buyPrice}
        onChange={(e) => setBuyPrice(e.target.value)}
      />
      <FioriInput
        label="Preço Sell"
        type="number"
        value={sellPrice}
        onChange={(e) => setSellPrice(e.target.value)}
      />
      <FioriButton onClick={handleSubmit}>Adicionar Cotação</FioriButton>
    </div>
  );
}
```

---

### FASE 7: RANKING E PREMIAÇÃO (Prioridade: CRÍTICA)

#### Task 7.1: Melhorar Componente de Ranking
**Arquivo:** `RFQsPageIntegrated.tsx`  
**Esforço:** 3h

**Melhorias:**
- Destacar visualmente o #1 do ranking
- Mostrar diferença de spread entre posições
- Indicador de "best price" por leg
- Histórico de cotações (se houve atualização)

#### Task 7.2: Modal de Premiação Aprimorado
**Arquivo:** `RFQsPageIntegrated.tsx`  
**Esforço:** 2h

**Melhorias:**
- Exibir resumo completo do trade
- Campo para vincular a Hedge Task
- Preview dos contratos que serão gerados
- Confirmação com 2 cliques (segurança)

```tsx
<FioriModal title="Confirmar Premiação">
  <div className="space-y-4">
    <h4>Resumo do Trade</h4>
    <table>
      <tr><td>Contraparte:</td><td>{selectedQuote.counterparty_name}</td></tr>
      <tr><td>Preço Buy:</td><td>{buyLeg?.quote_price}</td></tr>
      <tr><td>Preço Sell:</td><td>{sellLeg?.quote_price}</td></tr>
      <tr><td>Spread:</td><td>{spread}</td></tr>
    </table>
    
    <h4>Contratos a Serem Gerados</h4>
    <p>O backend gerará automaticamente:</p>
    <ul>
      <li>Contrato #{rfq.id}-1: Buy @ {buyPrice}</li>
      <li>Contrato #{rfq.id}-2: Sell @ {sellPrice}</li>
    </ul>
    
    <FioriInput
      label="Motivo da Decisão"
      value={awardReason}
      onChange={(e) => setAwardReason(e.target.value)}
      required
    />
    
    <FioriSelect label="Vincular a Hedge Task" value={hedgeId}>
      {hedgeTasks.map(h => <option key={h.id} value={h.id}>{h.reference}</option>)}
    </FioriSelect>
  </div>
</FioriModal>
```

---

### FASE 8: GERAÇÃO DE CONTRATOS (Prioridade: ALTA)

#### Task 8.1: Exibir Contratos Gerados após Premiação
**Arquivo:** `RFQsPageIntegrated.tsx`  
**Esforço:** 2h

**Requisitos:**
- Após award, fazer refetch do RFQ
- Backend retorna os contract_ids criados
- Exibir link para cada contrato gerado

```tsx
{isAwarded && rfq.contracts && (
  <div className="bg-green-50 p-4 rounded">
    <h4>Contratos Gerados</h4>
    <ul>
      {rfq.contracts.map(contract => (
        <li key={contract.contract_id}>
          <Link to={`/financeiro/contracts/${contract.contract_id}`}>
            {contract.contract_id}
          </Link>
          - {contract.status}
        </li>
      ))}
    </ul>
  </div>
)}
```

#### Task 8.2: Sincronizar com ContractsPage
**Arquivo:** `ContractsPage.tsx`  
**Esforço:** 1h

- Garantir que contratos gerados via RFQ apareçam na lista
- Exibir link de volta para RFQ origem

---

## 5. CRONOGRAMA ESTIMADO

| Fase | Tarefas | Esforço | Semana |
|------|---------|---------|--------|
| **1. Refatoração Form** | 1.1, 1.2, 1.3, 1.4 | 7.5h | S1 |
| **2. Integração Preview** | 2.1, 2.2, 2.3 | 6h | S1 |
| **3. Selector Contrapartes** | 3.1, 3.2 | 8h | S2 |
| **4. Criação RFQ** | 4.1, 4.2 | 6h | S2 |
| **5. Envio RFQ** | 5.1, 5.2 | 5h | S2 |
| **6. Coleta Cotações** | 6.1 | 4h | S3 |
| **7. Ranking/Premiação** | 7.1, 7.2 | 5h | S3 |
| **8. Contratos** | 8.1, 8.2 | 3h | S3 |
| **Total** | — | **44.5h** | **3 sem** |

---

## 6. DEPENDÊNCIAS E RISCOS

### 6.1 Dependências

| Dependência | Responsável | Status |
|-------------|-------------|--------|
| Backend `rfq_engine.py` | Backend Team | ✅ Pronto |
| Endpoint `POST /rfqs/preview` | Backend Team | ✅ Pronto |
| Endpoint `POST /rfqs/{id}/award` | Backend Team | ✅ Pronto |
| Modelo `Contract` no backend | Backend Team | ✅ Pronto |
| WhatsApp/Email sender | Infra | 🟡 A validar |

### 6.2 Riscos

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Discrepância de tipos entre FE/BE | Alto | Usar enums compartilhados, validação em runtime |
| Feriados não configurados | Médio | Endpoint para listar feriados, fallback para calendar default |
| Timeout no preview (cálculo PPT) | Baixo | Debounce de 500ms no input, loading state |
| Múltiplas cotações simultâneas | Médio | Locking otimista, refresh automático |

---

## 7. CRITÉRIOS DE ACEITE

### 7.1 Funcional

- [ ] Usuário pode selecionar PriceType e campos condicionais aparecem
- [ ] Preview é gerado pelo backend via API
- [ ] Texto do preview segue exatamente o formato do `rfq_engine`
- [ ] Contrapartes podem ser selecionadas com multi-select
- [ ] RFQ é criada no banco com invitations
- [ ] RFQ pode ser enviada com tracking de tentativas
- [ ] Cotações podem ser inseridas manualmente
- [ ] Ranking calcula spread corretamente (buy - sell)
- [ ] Premiação cria contratos automaticamente
- [ ] Contratos aparecem na ContractsPage

### 7.2 Técnico

- [ ] Tipos TypeScript mapeiam 1:1 com schemas Pydantic
- [ ] Erros de API são tratados com toast/mensagem
- [ ] Loading states em todas as operações
- [ ] Cache invalidado após mutations (React Query)
- [ ] Sem console errors ou warnings
- [ ] Cobertura de testes unitários ≥ 80% para hooks

### 7.3 UX

- [ ] Tempo de resposta do preview < 500ms
- [ ] Feedback visual ao selecionar contrapartes
- [ ] Modal de confirmação antes de premiar
- [ ] Botão desabilitado durante submissão

---

## 8. ANEXOS

### A. Mapeamento de Endpoints

| Operação | Método | Endpoint | Request | Response |
|----------|--------|----------|---------|----------|
| Preview | POST | `/rfqs/preview` | `RfqPreviewRequest` | `RfqPreviewResponse` |
| Create | POST | `/rfqs` | `RfqCreate` | `Rfq` |
| List | GET | `/rfqs` | — | `Rfq[]` |
| Detail | GET | `/rfqs/{id}` | — | `Rfq` |
| Update | PUT | `/rfqs/{id}` | `RfqUpdate` | `Rfq` |
| Send | POST | `/rfqs/{id}/send` | `RfqSendAttemptCreate` | `RfqSendAttempt` |
| Add Quote | POST | `/rfqs/{id}/quotes` | `RfqQuoteCreate` | `RfqQuote` |
| Award | POST | `/rfqs/{id}/award` | `RfqAwardRequest` | `Rfq` |
| Cancel | POST | `/rfqs/{id}/cancel` | `?motivo=...` | `Rfq` |
| Export CSV | GET | `/rfqs/{id}/quotes/export` | — | `text/csv` |

### B. Exemplo de Preview Request (Swap AVG + Fix)

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
  "company_header": "Alcast Brasil",
  "company_label_for_payoff": "Alcast",
  "counterparty_type": "broker"
}
```

### B.2 Exemplo de Preview Request (Forward com C2R Cash Settlement)

```json
{
  "trade_type": "Forward",
  "leg1": {
    "side": "buy",
    "price_type": "AVG",
    "quantity_mt": 300,
    "month_name": "April",
    "year": 2025
  },
  "leg2": {
    "side": "sell",
    "price_type": "C2R",
    "quantity_mt": 300,
    "fixing_date": "2025-04-30"
  },
  "sync_ppt": true,
  "company_header": "Alcast Trading",
  "counterparty_type": "bank"
}
```

### C. Exemplo de Response do rfq_engine

**Para Broker LME (Inglês Técnico):**
```
Alcast Brasil

Trade 1
-------
Buy 500 MT of Primary Aluminum, March 2025 Average
PPT: 2025-04-02

Sell 500 MT of Primary Aluminum, Fixing Date: March 15, 2025
PPT: 2025-04-02

Order: At Market

If realized price is higher than fixing price, Alcast receives the difference.
If realized price is lower than fixing price, Alcast pays the difference.
```

**Para Banco (Português Simplificado):**
```
Alcast Trading

Operação 1
----------
Compra de 500 MT de Alumínio Primário, Média Março 2025
Data de Pagamento: 02/04/2025

Venda de 500 MT de Alumínio Primário, Data de Fixação: 15/03/2025
Data de Pagamento: 02/04/2025

Execução: A Mercado

Se o preço realizado for maior que o preço fixado, Alcast recebe a diferença.
Se o preço realizado for menor que o preço fixado, Alcast paga a diferença.
```

> ⚠️ **REGRA CRÍTICA DE PPT:** O PPT é ÚNICO para todo o trade. A leg flutuante (AVG/AVGInter) define o PPT do trade. A leg fixa (Fix/C2R) SEMPRE herda o mesmo PPT.

---

## 9. APROVAÇÕES

| Papel | Nome | Data | Assinatura |
|-------|------|------|------------|
| Tech Lead | — | — | — |
| Product Owner | — | — | — |
| Stakeholder | — | — | — |

---

**FIM DO DOCUMENTO**
