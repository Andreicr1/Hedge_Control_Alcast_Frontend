# E2E Smoke Tests - Hedge Control Frontend

## Test Scenarios Validated via MCP Playwright

### ✅ TC-001: Login Page Loads Correctly
**URL:** `http://localhost:5173/login`  
**Expected Elements:**
- Heading: "Acesso ao Sistema"
- Quick access buttons: Admin, Financeiro, Compras, Vendas
- Email input with default value: `admin@alcast.local`
- Password input
- Submit button: "Entrar"

**Verified:** Login page renders correctly with all expected elements.

### ✅ TC-002: Root Redirect to Login
**URL:** `http://localhost:5173/`  
**Expected:** Redirects to `/login` when not authenticated.

**Verified:** Navigation to `/` automatically redirects to `/login`.

### ✅ TC-003: Quick Access Buttons Toggle
**Action:** Click "Admin" button  
**Expected:** Button becomes active (visual state change).

**Verified:** Button state changes correctly on click.

---

## Pending Tests (Require Backend)

### ⬜ TC-004: Successful Login Flow
**Precondition:** Backend running with valid user  
**Steps:**
1. Navigate to `/login`
2. Click "Admin" quick access
3. Click "Entrar"
**Expected:** Redirect to Dashboard at `/dashboard`

### ⬜ TC-005: Dashboard Page Elements
**Precondition:** Authenticated as Admin  
**Expected Elements:**
- Navigation sidebar with menu items
- Dashboard summary cards
- Recent activity section

### ⬜ TC-006: RFQ Page Access
**Precondition:** Authenticated with RFQ permissions  
**URL:** `/rfqs`  
**Expected:** RFQ list table renders

### ⬜ TC-007: Contracts Page Access
**Precondition:** Authenticated  
**URL:** `/contracts`  
**Expected:** Contracts list renders

### ⬜ TC-008: Timeline Page Access
**Precondition:** Authenticated  
**URL:** `/timeline`  
**Expected:** Timeline event list renders

---

## Running Tests

### Manual Testing with MCP Playwright

The MCP Playwright tools allow interactive testing:
- `browser_navigate` - Navigate to URLs
- `browser_click` - Click elements by ref
- `browser_type` - Type into inputs
- `browser_snapshot` - Capture accessibility snapshot

### Automated Testing (Future)

For CI/CD, install Playwright:

```bash
cd frontend
npm install -D @playwright/test
npx playwright install
```

Create test files in `frontend/tests/e2e/`:

```typescript
// smoke.spec.ts
import { test, expect } from '@playwright/test';

test('login page loads correctly', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('heading', { name: 'Acesso ao Sistema' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Admin' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible();
});

test('root redirects to login when unauthenticated', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL('/login');
});
```

---

## Notes

- Tests documented on: 2026-01-16
- MCP Playwright version: Microsoft Playwright MCP
- Frontend framework: React + Vite
- Backend: FastAPI (Python)
