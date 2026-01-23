# Hedge Management System

This is a code bundle for Hedge Management System. The original project is available at
[Figma: Hedge Management System](https://www.figma.com/design/0fRqtZVuvm7X3V8zb6BFHz/Hedge-Management-System).

## Dev setup (supported)

**Supported Node.js:** 20.x (LTS). CI is the source of truth.

**Environment file (local-only):**

- Copy `.env.example` to `.env` (do not commit `.env`).
- Adjust `VITE_API_BASE_URL` as needed.

## Production deploy (Azure Static Web Apps via GitHub Actions)

This frontend is deployed to **Azure Static Web Apps (SWA)** using GitHub Actions.

Important:

- Vite environment variables are injected at **build time**.
- After changing any `VITE_*` values, trigger a new deploy.

Workflow: `.github/workflows/deploy-swa.yml`

Required GitHub Secrets:

- `AZURE_STATIC_WEB_APPS_API_TOKEN` (SWA deployment token)
- `VITE_AUTH_MODE` (`local` or `entra`)
- `VITE_ENTRA_TENANT_ID`
- `VITE_ENTRA_CLIENT_ID`
- `VITE_ENTRA_API_SCOPE` (example: `api://<api-app-client-id>/access_as_user`)

Notes:

- In SWA, the app uses same-origin API calls (`VITE_API_BASE_URL=/api`). The integrated `api/` Functions project proxies to the backend.

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.
