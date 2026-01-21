
# Hedge Management System

This is a code bundle for Hedge Management System. The original project is available at
[Figma: Hedge Management System](https://www.figma.com/design/0fRqtZVuvm7X3V8zb6BFHz/Hedge-Management-System).

## Dev setup (supported)

**Supported Node.js:** 20.x (LTS). CI is the source of truth.

**Environment file (local-only):**

- Copy `.env.example` to `.env` (do not commit `.env`).
- Adjust `VITE_API_BASE_URL` as needed.

## Production deploy (Vercel)

Vercel injects environment variables at **build time**. After changing env vars, trigger a **redeploy**.

Required env vars:

- `VITE_API_BASE_URL` (example: `https://hedge-control-alcast-backend.onrender.com`)
- `VITE_POWERBI_CASHFLOW_EMBED_URL` (Power BI `reportEmbed` URL for the Cashflow page iframe)

Optional (scope filters applied to the embedded report):

- `VITE_POWERBI_CASHFLOW_FILTER_DEAL_TEMPLATE`
- `VITE_POWERBI_CASHFLOW_FILTER_CONTRACT_TEMPLATE`

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.
