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
# URL do backend (opcional)
#
# - Local (dev): por padrão o frontend usa `/api` e o Vite faz proxy para `http://localhost:8001`
#   (ver `vite.config.ts`). Você pode deixar vazio.
#
# - Azure Static Web Apps (SWA): recomendado manter `VITE_API_BASE_URL=/api`.
#   O projeto usa **Azure Functions integradas no SWA** como proxy para o backend (Container Apps),
#   então o browser sempre chama o mesmo domínio (sem CORS) e POST/PUT/PATCH/DELETE funcionam.
#
#   Nesse modo, o backend real é configurado via `BACKEND_BASE_URL` (app setting do SWA),
#   e NÃO deve ser exposto como variável `VITE_` no frontend.
VITE_API_BASE_URL=

# Power BI (Cashflow)
# URL de embed do relatório (iframe src). Necessário para "subir pronto" no build.
VITE_POWERBI_CASHFLOW_EMBED_URL=

# Filtros opcionais para aplicar no relatório baseado no escopo selecionado.
# Tokens aceitos: {dealId}, {contractId}
VITE_POWERBI_CASHFLOW_FILTER_DEAL_TEMPLATE=
VITE_POWERBI_CASHFLOW_FILTER_CONTRACT_TEMPLATE=
```

### Deploy via GitHub Actions (Azure Static Web Apps)

- O Azure Static Web Apps injeta variáveis de ambiente **no build** (via workflow do GitHub Actions).
- Para Vite, apenas variáveis prefixadas com `VITE_` ficam disponíveis no browser.
- Após alterar GitHub Secrets/vars, é necessário um **redeploy** para refletir no frontend.

### Deploy no Azure Static Web Apps (nota importante)

- O Azure Static Web Apps injeta variáveis de ambiente **no build**.
- Para Vite, apenas variáveis prefixadas com `VITE_` ficam disponíveis no browser.
- Para integrar com o backend em Azure Container Apps, mantenha `VITE_API_BASE_URL=/api` e faça **redeploy**.
- O proxy do `/api/*` é feito por Azure Functions integradas no SWA (pasta `api/`), usando `BACKEND_BASE_URL` como destino.

Nota de robustez (auth): em alguns cenários o header padrão `Authorization` pode chegar alterado ao backend quando passa por camadas do SWA. Por isso, o frontend também envia `x-hc-authorization: Bearer <token>` e a Function proxy mapeia esse header para `Authorization` ao chamar o backend.

Para teste manual (curl) via SWA, prefira:

```bash
curl -i https://<SWA_HOST>/api/auth/me -H "x-hc-authorization: Bearer <TOKEN>"
```

Teste rápido (login direto no backend — diagnóstico):

```bash
curl -i -X POST \
    https://<BACKEND_FQDN>/auth/token \
    -H "Content-Type: application/x-www-form-urlencoded" \
    --data "grant_type=password&username=admin@alcast.local&password=123"
```

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
