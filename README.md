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


Workflow: `.github/workflows/deploy-swa.yml`

Required GitHub Secrets:


## Setup

### Variáveis de ambiente (SWA / Entra / Proxy)

Este frontend (Vite) lê variáveis `VITE_*` no **build**. Em Azure Static Web Apps, defina essas variáveis em **Configuration → Application settings** e dispare um novo deploy.

- **Entra (quando `VITE_AUTH_MODE=entra`)**
	- `VITE_ENTRA_TENANT_ID`
	- `VITE_ENTRA_CLIENT_ID`
	- `VITE_ENTRA_API_SCOPE` (ex.: `api://<api-app-client-id>/access_as_user`)

- **API (Azure Functions proxy `/api`)**
	- `BACKEND_BASE_URL` (URL base do backend, ex.: `https://<backend-host>`)

Sem `BACKEND_BASE_URL`, o proxy responde `503` (gateway não configurado) e o navegador mostrará falhas em `/api/*`.
Notes:

- In SWA, the app uses same-origin API calls (`VITE_API_BASE_URL=/api`). The integrated `api/` Functions project proxies to the backend.

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.
