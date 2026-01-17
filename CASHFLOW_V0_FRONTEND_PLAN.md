# Cashflow v0 — Frontend Planning (Read-Only)

Status: **PLANNING ONLY — FROZEN** (no frontend code authorized yet)

This document locks the **frontend UI contract + guardrails + tickets** for Cashflow v0.
Goal: ensure the read surface is **semantically aligned** with backend `GET /cashflow` v0 (no drift).

---

## 1) Guardrails (Non-Negotiable)

- **Read-only UI**: no POST/PUT/PATCH/DELETE, no workflow triggers, no booking/accounting.
- **No semantic drift**:
  - Frontend types mirror backend field names and meaning.
  - No re-interpretation of `projected_*` vs `final_*`.
- **No scenario/sensitivity**: do not add “what-if” toggles, custom curves, alternative assumptions.
- **No client-side valuation**:
  - Do not compute MTM/settlement.
  - Do not “fill” missing values with heuristics.
  - Do not aggregate or net values into totals unless backend explicitly provides a totals field.
- **RBAC**:
  - Page accessible only to `financeiro` and `auditoria`.
  - UI may hide entry points based on role, but backend remains the authority (handle 403 gracefully).
- **Dates**:
  - Dates are treated as **calendar dates** (not datetimes) and passed as ISO `YYYY-MM-DD`.

---

## 2) Backend Contract (Source of Truth)

Endpoint:
- `GET /cashflow`

Query parameters (all optional unless specified):
- `start_date`: filter `settlement_date >= start_date`
- `end_date`: filter `settlement_date <= end_date`
- `as_of`: compute projected values “as of” this date
- `contract_id`: filter exact contract
- `counterparty_id`: filter exact counterparty
- `deal_id`: filter exact deal
- `limit`: integer (default 200, max 1000)

Response:
- `{ as_of: date, items: CashflowItemRead[] }`

CashflowItemRead fields (backend):
- Identity: `contract_id`, `deal_id`, `rfq_id`, `counterparty_id`, `settlement_date`
- Projected (proxy): `projected_value_usd`, `projected_methodology`, `projected_as_of`
- Final (authoritative): `final_value_usd`, `final_methodology`
- Provenance window: `observation_start`, `observation_end_used`, `last_published_cash_date`
- Diagnostics: `data_quality_flags: string[]`

RBAC (backend enforced):
- Allowed roles: `financeiro`, `auditoria`

---

## 3) Frontend Type Contract (No Drift)

Location (proposal, consistent with existing patterns):
- `src/types/api.ts` (backend response DTOs)

Types (planned):

- `CashflowItem`
  - Mirrors backend `CashflowItemRead` exactly, with dates as ISO strings (`YYYY-MM-DD`).
- `CashflowResponse`
  - `{ as_of: string; items: CashflowItem[] }`

Query params type (planned):
- `CashflowQueryParams`
  - `{ start_date?: string; end_date?: string; as_of?: string; contract_id?: string; counterparty_id?: number; deal_id?: number; limit?: number }`

Important: any **display-only enrichments** must remain separate from DTOs.
Example allowed display-only enrichment:
- `counterparty_name` resolved via `/counterparties` list (join-by-id for UX only)

---

## 4) UI Surface (Page + Interaction Contract)

### 4.1 Navigation + Route

Proposed route:
- `/financeiro/cashflow`

Navigation placement:
- Side Navigation → **Financeiro** group → new child item: **Cashflow** (or “Fluxo de Caixa”).

Access control:
- `RequireRole allowed={["financeiro", "auditoria"]}` at routing level.

### 4.2 Page Shape (List Report)

A single read-only List Report style page:

- **Filter Bar** (top)
  - Settlement date range:
    - `start_date` (From)
    - `end_date` (To)
  - `as_of` date (valuation cutoff)
  - Optional filters:
    - `counterparty_id`
    - `deal_id`
    - `contract_id`
  - `limit` (advanced)

Default query behavior (proposal):
**Locked (v0):** bounded forward-looking window.
- Set `as_of = today` by default.
- Set default settlement window:
  - `start_date = today`
  - `end_date = today + 90d`
  - Rationale: avoids empty/overloaded views and matches “projeção” nature.

- **Table** (center)
  - Sorting: UI-only sort allowed (but must not change semantics); backend returns `settlement_date ASC`.
  - Columns (proposed):
    1) `settlement_date`
    2) Counterparty (name via join, else show `counterparty_id`)
    3) `contract_id` (link to contracts view)
    4) `deal_id` (link to `/financeiro/deals/:dealId`)
    5) `rfq_id` (display only)
    6) `projected_value_usd` (currency formatted)
    7) `final_value_usd` (currency formatted)
    8) Flags (chips/badges from `data_quality_flags`)

**Locked (v0):** table-only (no details drawer).

### 4.3 Data Quality Flags — Display Contract

Frontend must treat flags as **opaque strings**.

- Known flags today (v0):
  - `projected_not_available`
  - `final_not_available`

Rendering rule:
- Unknown flags must still render as “Flag: <value>” (no dropping).

### 4.4 Error / Empty States

- `403`: show “Acesso restrito a Financeiro/Auditoria” (should be rare because `RequireRole` blocks, but still handle).
- `401`: handled by API client (clears token); page should display a friendly session-expired message if encountered.
- Empty `items`: show empty-state message (“Sem itens no período selecionado”).

---

## 5) Frontend Integration Contract (Planned Code Shape)

Consistent with existing code style (manual `useState/useEffect` hooks, service layer):

- Endpoints map:
  - Add `endpoints.cashflow.list = '/cashflow'`

- Service:
  - `src/services/cashflow.service.ts`
  - `getCashflow(params: CashflowQueryParams): Promise<CashflowResponse>`
  - Must build query string with only provided params.

- Hook:
  - `src/hooks/useCashflow.ts`
  - `useCashflow(params)` returns `{ data, isLoading, isError, error, refetch }`

- Page:
  - `src/app/pages/CashflowPageIntegrated.tsx`

---

## 6) Tickets (Planning-Only)

CF-FE-001 — Types
- Add `CashflowItem`, `CashflowResponse`, `CashflowQueryParams` in `src/types/api.ts`.
- Acceptance:
  - Field names match backend exactly.
  - Dates are strings; no Date objects in DTOs.

CF-FE-002 — Endpoint mapping
- Add `endpoints.cashflow.list` in `src/api/client.ts`.
- Acceptance:
  - Uses base API client; no custom fetch.

CF-FE-003 — Service
- Create `src/services/cashflow.service.ts` with `getCashflow(params)`.
- Acceptance:
  - Query string omits undefined params.
  - Passes `as_of` when set.

CF-FE-004 — Hook
- Create `src/hooks/useCashflow.ts`.
- Acceptance:
  - No caching beyond component lifecycle (v0).
  - Exposes `refetch()`.

CF-FE-005 — Page (Read-Only)
- Create `CashflowPageIntegrated` list report UI.
- Acceptance:
  - Displays both `projected_value_usd` and `final_value_usd`.
  - Flags shown as chips/badges; unknown flags still visible.
  - No totals/aggregation.

CF-FE-006 — Navigation + Routing
- Add route `/financeiro/cashflow` in `src/app/App.tsx` with `RequireRole` for `financeiro/auditoria`.
- Add Financeiro menu entry in `src/app/components/fiori/FioriSideNavigation.tsx`.
- Acceptance:
  - Navigation visibility matches existing Financeiro gating.

CF-FE-007 — Counterparty name enrichment (UX-only)
- Use `useCounterparties()` to map `counterparty_id -> name`.
- Acceptance:
  - Does not modify Cashflow DTO; enrichment is view-only.

CF-FE-008 — UX polish (optional)
- Add “As-of” indicator and small help text explaining projected vs final.

---

## 7) Open Choices to Lock Before Implementation

All v0 choices are **locked**:
- Default filters: Option A with `today → today+90d` window.
- Placement: **Financeiro**.
- Details: **Table-only**.

This plan is now **frozen**. No implementation should start until explicit execution authorization.
