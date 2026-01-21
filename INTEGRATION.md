# Integração Frontend-Backend

## Visão Geral

Este documento descreve a integração completa entre o frontend React e o backend FastAPI do sistema Hedge Control Alcast.

**Princípio fundamental**: O BACKEND MANDA. O FRONTEND SE ADAPTA.

## Arquitetura

```text
src/
├── api/
│   ├── client.ts          # Cliente HTTP com auth, timeout, endpoints
│   └── index.ts
├── types/
│   ├── enums.ts           # Enums espelhando backend (RfqStatus, etc)
│   ├── models.ts          # Interfaces TypeScript (Rfq, Contract, etc)
│   ├── api.ts             # Tipos de resposta da API
│   └── index.ts
├── services/
│   ├── rfqs.service.ts    # Operações de RFQ
│   ├── contracts.service.ts
│   ├── deals.service.ts
│   ├── exposures.service.ts
│   ├── counterparties.service.ts
│   ├── salesOrders.service.ts
│   ├── purchaseOrders.service.ts
│   ├── dashboard.service.ts
│   └── index.ts
├── hooks/
│   ├── useRfqs.ts         # Hook com loading/error/data
│   ├── useContracts.ts
│   ├── useDeals.ts
│   ├── useExposures.ts
│   ├── useCounterparties.ts
│   ├── useDashboard.ts
│   └── index.ts
└── app/
    ├── components/ui/
    │   ├── LoadingState.tsx
    │   ├── ErrorState.tsx
    │   ├── EmptyState.tsx
    │   └── DataContainer.tsx
    └── pages/
        ├── RFQsPageIntegrated.tsx
        ├── ContractsPageIntegrated.tsx
        ├── DashboardPageIntegrated.tsx
        ├── DealsPageIntegrated.tsx
        ├── CounterpartiesPageIntegrated.tsx
        └── ExposuresPageIntegrated.tsx
```

## Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# URL do backend
VITE_API_BASE_URL=http://localhost:8000

# Power BI (Cashflow)
# URL de embed do relatório (iframe src). Necessário para "subir pronto" no build.
VITE_POWERBI_CASHFLOW_EMBED_URL=

# Filtros opcionais para aplicar no relatório baseado no escopo selecionado.
# Tokens aceitos: {dealId}, {contractId}
VITE_POWERBI_CASHFLOW_FILTER_DEAL_TEMPLATE=
VITE_POWERBI_CASHFLOW_FILTER_CONTRACT_TEMPLATE=
```

### Deploy no Vercel (nota importante)

- O Vercel injeta variáveis de ambiente **no build**.
- Para Vite, apenas variáveis prefixadas com `VITE_` ficam disponíveis no browser.
- Após alterar env vars no Vercel, é necessário um **redeploy** para refletir no frontend.

O frontend opera no modo integrado (API real). O modo mock foi descontinuado para reduzir ruído e superfície de manutenção.

## Fluxo de Dados

```text
Página → Hook → Service → API Client → Backend
                                          ↓
Página ← Hook ← Service ← API Client ← Backend
```

### Exemplo: RFQs

```typescript
// Na página
const { rfqs, isLoading, isError, refetch } = useRfqs();
const { mutate: sendRfq, isLoading: isSending } = useSendRfq();

// Enviar RFQ
await sendRfq(rfqId);
refetch(); // Atualizar lista
```

## Endpoints Suportados

| Domínio | Endpoint | Descrição |
| --------- | ---------- | ----------- |
| RFQs | GET /rfqs | Listar RFQs |
| RFQs | GET /rfqs/:id | Detalhe RFQ |
| RFQs | POST /rfqs/:id/send | Enviar RFQ |
| RFQs | POST /rfqs/:id/award | Premiar quote |
| Contracts | GET /contracts | Listar contratos |
| Deals | GET /deals/:id | Detalhe deal |
| Deals | GET /deals/:id/pnl | P&L do deal |
| Dashboard | GET /dashboard/summary | KPIs |
| Counterparties | CRUD completo | Cadastro / manutenção |
| Exposures | GET /exposures | Listar exposições |

## Tratamento de Erros

Todos os hooks retornam:

- `isLoading`: boolean
- `isError`: boolean
- `error`: ApiError | null
- `refetch()`: função para recarregar

Os componentes de UI (`ErrorState`, `LoadingState`, `EmptyState`) padronizam a exibição.

## Regras de Negócio

⚠️ **IMPORTANTE**: O frontend NUNCA implementa regras de negócio.

- ❌ Não calcular P&L no frontend
- ❌ Não validar transições de status
- ❌ Não gerar IDs de contrato
- ✅ Apenas renderizar dados do backend
- ✅ Apenas enviar ações para o backend processar

## Próximos Passos

1. [ ] Conectar backend e testar integração real
2. [ ] Implementar autenticação JWT
3. [ ] Adicionar páginas de Sales/Purchase Orders integradas
4. [ ] Implementar gráficos no Dashboard
5. [ ] Adicionar WebSocket para atualizações em tempo real
