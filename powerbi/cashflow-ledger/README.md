# Power BI Studio – Cashflow Ledger (Hedge Control)

This folder contains the minimal artifacts to build the Cashflow report quickly in **VS Code** using **Power BI Studio**.

## What you already have in the backend

The backend now exposes a normalized “ledger” export:

- Authenticated (app users): `GET /api/reports/cashflow-ledger?format=csv|json`
- Token-guarded public (Power BI scheduled refresh): `GET /api/reports/cashflow-ledger-public?token=...&format=csv|json`

The export values variable SO/PO and variable contract legs using **qty × last official LME price** (by default symbol `Q7Y00`, reference date `as_of - 1`).

## Recommended (Power BI Service refresh without user login)

1) In the backend environment, set a strong token:

- `REPORTS_PUBLIC_TOKEN=<long-random-secret>`

2) Use this URL in Power BI:

- CSV:
  - `https://<YOUR_BACKEND_HOST>/api/reports/cashflow-ledger-public?token=<REPORTS_PUBLIC_TOKEN>&format=csv&as_of=2026-01-20`
- JSON:
  - `https://<YOUR_BACKEND_HOST>/api/reports/cashflow-ledger-public?token=<REPORTS_PUBLIC_TOKEN>&format=json&as_of=2026-01-20`

## VS Code (Power BI Studio) quick steps

1) Create a new PBIP project (Power BI Studio)
2) Open **Power Query** (Transform data)
3) Create a new query and paste the M code from [cashflow_ledger.pq](cashflow_ledger.pq)
4) Create measures from [measures.dax](measures.dax)
5) Build a Matrix visual:
   - Rows: Deal → Category → Subtype → (optional) Contract/Leg
   - Columns: Date hierarchy (Quarter/Month/Week/Day)
   - Values: `Cashflow USD`, `Resultado Deal (F1 - F2)`

## Notes

- Use `format=csv` if you want the simplest ingestion.
- If you need filtering by deal:
  - add `&deal_id=<id>` in the export URL.
