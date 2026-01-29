import { test, expect } from '@playwright/test';

/**
 * E2E Smoke Tests for Hedge Control Frontend
 * These tests verify that critical pages load correctly.
 */

test.describe('Authentication', () => {
  const ignoredUrlPatterns: RegExp[] = [
    /\/favicon\.ico(\?|$)/i,
    /\/robots\.txt(\?|$)/i,
    /\/manifest\.webmanifest(\?|$)/i,
    /\/site\.webmanifest(\?|$)/i,
  ];

  const isIgnoredUrl = (url: string) => ignoredUrlPatterns.some((re) => re.test(url));

  const collectBadResponses = async (page: any) => {
    const bad: Array<{ status: number; url: string }> = [];
    page.on('response', (response: any) => {
      const status = response.status();
      if (status < 400) return;
      const url = response.url();
      if (isIgnoredUrl(url)) return;
      bad.push({ status, url });
    });
    return bad;
  };

  test('login page loads with all expected elements', async ({ page }) => {
    await page.goto('/login');

    // Verify page title
    await expect(page).toHaveTitle('Hedge Management System');

    // Verify heading
    await expect(page.getByRole('heading', { name: 'Acesso ao Sistema' })).toBeVisible();

    // Verify quick access buttons
    await expect(page.getByRole('button', { name: 'Admin' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Financeiro' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Compras' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Vendas' })).toBeVisible();

    // Verify form elements
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Senha')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible();
  });

  test('root path redirects to login when unauthenticated', async ({ page }) => {
    await page.goto('/');

    // Should redirect to /login
    await expect(page).toHaveURL('/login');
  });

  test('quick access buttons can be selected', async ({ page }) => {
    await page.goto('/login');

    const adminButton = page.getByRole('button', { name: 'Admin' });
    
    // Click Admin button
    await adminButton.click();

    // Email should be prefilled with admin email
    const emailInput = page.getByLabel('Email');
    await expect(emailInput).toHaveValue('admin@alcast.local');
  });

  test('email input accepts custom values', async ({ page }) => {
    await page.goto('/login');

    const emailInput = page.getByLabel('Email');
    
    // Clear and type custom email
    await emailInput.clear();
    await emailInput.fill('test@example.com');

    await expect(emailInput).toHaveValue('test@example.com');
  });

  test('login page does not trigger unexpected 404/500 requests', async ({ page }) => {
    const bad = await collectBadResponses(page);

    await page.goto('/login', { waitUntil: 'networkidle' });
    await page.waitForTimeout(750);

    const unexpected = bad.filter((r) => r.status === 404 || r.status >= 500);
    expect(
      unexpected,
      `Unexpected network errors:\n${unexpected.map((r) => `${r.status} ${r.url}`).join('\n')}`,
    ).toEqual([]);
  });
});

test.describe('Navigation Guards', () => {
  test('protected routes redirect to login', async ({ page }) => {
    // Try to access dashboard without auth
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/login');

    // Try to access RFQs without auth
    await page.goto('/rfqs');
    await expect(page).toHaveURL('/login');

    // Try to access contracts without auth
    await page.goto('/contracts');
    await expect(page).toHaveURL('/login');
  });
});

test.describe('Login and Redirect', () => {
  test('admin login redirects to dashboard, not settings', async ({ page }) => {
    // Go to login page
    await page.goto('/login');

    // Click Admin quick access button
    await page.getByRole('button', { name: 'Admin' }).click();

    // Fill password
    await page.getByLabel('Senha').fill('123');

    // Submit login
    await page.getByRole('button', { name: 'Entrar' }).click();

    // Wait for redirect - should leave /login (and not go to settings)
    await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15000 });
    expect(page.url()).not.toContain('/configuracoes');

    // Card title is not guaranteed to be an ARIA heading.
    await expect(page.getByText('Alumínio LME Spot - USD/mt')).toBeVisible({ timeout: 15000 });
  });

  test('financeiro login redirects to dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Financeiro' }).click();
    await page.getByLabel('Senha').fill('123');
    await page.getByRole('button', { name: 'Entrar' }).click();

    await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15000 });
    expect(page.url()).not.toContain('/configuracoes');
    await expect(page.getByText('Alumínio LME Spot - USD/mt')).toBeVisible({ timeout: 15000 });
  });

  test('compras login redirects to purchase orders', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Compras' }).click();
    await page.getByLabel('Senha').fill('123');
    await page.getByRole('button', { name: 'Entrar' }).click();

    await page.waitForURL(url => url.pathname.includes('/compras'), { timeout: 10000 });
    expect(page.url()).toContain('/compras');
  });

  test('vendas login redirects to sales orders', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Vendas' }).click();
    await page.getByLabel('Senha').fill('123');
    await page.getByRole('button', { name: 'Entrar' }).click();

    await page.waitForURL(url => url.pathname.includes('/vendas'), { timeout: 10000 });
    expect(page.url()).toContain('/vendas');
  });
});

// ============================================
// SO/PO End-to-End Smoke (UI -> API)
// ============================================

type AccessToken = string;

type BackendTarget = {
  origin: string;
  apiPrefix: string;
};

function envString(key: string): string | undefined {
  const v = process.env[key];
  if (!v) return undefined;
  const s = String(v).trim();
  return s.length ? s : undefined;
}

async function waitForBackendReady(request: any): Promise<BackendTarget> {
  const origin = envString('E2E_BACKEND_URL');
  if (!origin) {
    throw new Error(
      'E2E_BACKEND_URL must be set to an Azure endpoint origin, e.g. https://<SWA_HOST> or https://<CONTAINER_APP_FQDN>.',
    );
  }
  const forcedPrefix = envString('E2E_API_PREFIX');
  const prefixesToTry = forcedPrefix ? [forcedPrefix] : ['', '/api'];
  const timeoutMs = 20_000;
  const started = Date.now();

  // Simple polling: backend can take a moment to boot.
  while (Date.now() - started < timeoutMs) {
    for (const apiPrefix of prefixesToTry) {
      try {
        const res = await request.get(`${origin}${apiPrefix}/health`);
        if (res.ok()) return { origin, apiPrefix };
      } catch {
        // ignore
      }
    }
    await new Promise((r) => setTimeout(r, 500));
  }

  throw new Error(
    `Backend not ready after ${timeoutMs}ms. Tried: ${prefixesToTry
      .map((p) => `${origin}${p}/health`)
      .join(' , ')}`,
  );
}

async function getAccessToken(
  request: any,
  backend: BackendTarget,
  email: string,
  password: string,
): Promise<AccessToken> {
  const res = await request.post(`${backend.origin}${backend.apiPrefix}/auth/token`, {
    form: {
      username: email,
      password,
    },
  });
  if (!res.ok()) {
    throw new Error(`Failed to login via API: ${res.status()} ${await res.text()}`);
  }
  const body = (await res.json()) as { access_token: string };
  if (!body?.access_token) throw new Error('Missing access_token from /auth/token');
  return body.access_token;
}

async function createCustomer(
  request: any,
  backend: BackendTarget,
  token: AccessToken,
  name: string,
): Promise<{ id: number; name: string }> {
  const res = await request.post(`${backend.origin}${backend.apiPrefix}/customers`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { name, trade_name: name },
  });
  if (!res.ok()) {
    throw new Error(`Failed to create customer: ${res.status()} ${await res.text()}`);
  }
  const body = (await res.json()) as { id: number; name: string };
  return { id: body.id, name: body.name };
}

async function createSupplier(
  request: any,
  backend: BackendTarget,
  token: AccessToken,
  name: string,
): Promise<{ id: number; name: string }> {
  const res = await request.post(`${backend.origin}${backend.apiPrefix}/suppliers`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { name, trade_name: name },
  });
  if (!res.ok()) {
    throw new Error(`Failed to create supplier: ${res.status()} ${await res.text()}`);
  }
  const body = (await res.json()) as { id: number; name: string };
  return { id: body.id, name: body.name };
}

function modalByTitle(page: any, title: string) {
  const heading = page.getByRole('heading', { name: title });
  return heading.locator('..').locator('..');
}

function fieldByLabel(container: any, labelText: string) {
  // Our Fiori components render a <label> without htmlFor; locate by structure.
  return container
    .locator('label', { hasText: labelText })
    .locator('..')
    .locator('input, select, textarea')
    .first();
}

async function uiLoginQuickAccess(page: any, role: 'Vendas' | 'Compras') {
  await page.goto('/login');
  await page.getByRole('button', { name: role }).click();
  await page.getByLabel('Senha').fill('123');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await page.waitForURL((url: any) => !url.pathname.includes('/login'), { timeout: 10_000 });
}

async function uiLoginFinanceiro(page: any) {
  await page.goto('/login');
  await page.getByRole('button', { name: 'Financeiro' }).click();
  await page.getByLabel('Senha').fill('123');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await page.waitForURL((url: any) => !url.pathname.includes('/login'), { timeout: 15_000 });
}

test.describe('SO/PO Create Smoke', () => {
  test('vendas can create a Sales Order', async ({ page, request }) => {
    const backend = await waitForBackendReady(request);

    const token = await getAccessToken(request, backend, 'vendas@alcast.dev', '123');
    const suffix = Date.now();
    const customerName = `E2E Customer ${suffix}`;
    await createCustomer(request, backend, token, customerName);

    await uiLoginQuickAccess(page, 'Vendas');
    await page.goto('/vendas/sales-orders');

    await page.getByRole('button', { name: 'Novo pedido' }).click();

    const modal = modalByTitle(page, 'Nova Sales Order');

    await fieldByLabel(modal, 'Cliente').selectOption({ label: customerName });
    await fieldByLabel(modal, 'Quantidade (MT)').fill('10');
    await fieldByLabel(modal, 'PriceType').selectOption({ label: 'Preço fixo (Fix)' });
    await fieldByLabel(modal, 'Preço unitário (USD/t)').fill('2500');

    const createResPromise = page.waitForResponse(
      (res) => res.url().includes('/api/sales-orders') && res.request().method() === 'POST',
      { timeout: 20_000 },
    );
    await modal.getByRole('button', { name: 'Salvar' }).click();
    const createRes = await createResPromise;
    expect(
      createRes.ok(),
      `Create Sales Order failed: ${createRes.status()} ${await createRes.text()}`,
    ).toBeTruthy();

    // After save, the page navigates to the created order and shows an SO number.
    await page.waitForURL((url: any) => url.pathname.includes('/vendas/sales-orders/'), { timeout: 20_000 });
    await expect(page.locator('h1')).toContainText('SO', { timeout: 10_000 });
  });

  test('compras can create a Purchase Order', async ({ page, request }) => {
    const backend = await waitForBackendReady(request);

    const token = await getAccessToken(request, backend, 'compras@alcast.dev', '123');
    const suffix = Date.now();
    const supplierName = `E2E Supplier ${suffix}`;
    await createSupplier(request, backend, token, supplierName);

    await uiLoginQuickAccess(page, 'Compras');
    await page.goto('/compras/purchase-orders');

    await page.getByRole('button', { name: 'Novo pedido' }).click();

    const modal = modalByTitle(page, 'Nova Purchase Order');

    await fieldByLabel(modal, 'Fornecedor').selectOption({ label: supplierName });
    await fieldByLabel(modal, 'Quantidade (MT)').fill('12');
    await fieldByLabel(modal, 'PriceType').selectOption({ label: 'Preço fixo (Fix)' });
    await fieldByLabel(modal, 'Preço unitário (USD/t)').fill('2400');

    const createResPromise = page.waitForResponse(
      (res) => res.url().includes('/api/purchase-orders') && res.request().method() === 'POST',
      { timeout: 20_000 },
    );
    await modal.getByRole('button', { name: 'Salvar' }).click();
    const createRes = await createResPromise;
    expect(
      createRes.ok(),
      `Create Purchase Order failed: ${createRes.status()} ${await createRes.text()}`,
    ).toBeTruthy();

    await page.waitForURL((url: any) => url.pathname.includes('/compras/purchase-orders/'), { timeout: 20_000 });
    await expect(page.locator('h1')).toContainText('PO', { timeout: 10_000 });
  });
});

// ============================================
// Financeiro UX Smoke (RFQ / Cashflow / Exposures)
// ============================================

test.describe('Financeiro UX Smoke', () => {
  test('RFQs page renders WhatsApp action', async ({ page }) => {
    await uiLoginFinanceiro(page);
    await page.goto('/financeiro/rfqs');
    await expect(page.getByText('Cotações')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole('button', { name: 'WhatsApp' })).toBeVisible({ timeout: 15_000 });
  });

  test('RFQ form renders WhatsApp share button (disabled by default)', async ({ page }) => {
    await uiLoginFinanceiro(page);
    await page.goto('/financeiro/rfqs/novo');

    const wa = page.getByRole('button', { name: 'WhatsApp' }).first();
    await expect(wa).toBeVisible({ timeout: 15_000 });
    await expect(wa).toBeDisabled();
  });

  test('Cashflow page loads (drill-down controls available when data exists)', async ({ page }) => {
    await uiLoginFinanceiro(page);
    await page.goto('/financeiro/cashflow');
    await expect(page.getByText('Fluxo de Caixa')).toBeVisible({ timeout: 15_000 });

    const collapseBtn = page.getByRole('button', { name: 'Recolher para Trimestre' });
    if ((await collapseBtn.count()) > 0) {
      await expect(collapseBtn).toBeVisible();
    }
  });

  test('Exposures page hides fully-hedged filter option', async ({ page }) => {
    await uiLoginFinanceiro(page);
    await page.goto('/financeiro/exposicoes');
    await expect(page.getByText('Exposição de Risco')).toBeVisible({ timeout: 15_000 });

    await expect(page.getByRole('option', { name: 'Totalmente Hedgeada' })).toHaveCount(0);

    const anyReferenceLabel = page.getByText('Referência:', { exact: false });
    if ((await anyReferenceLabel.count()) > 0) {
      await expect(anyReferenceLabel.first()).toBeVisible();
    }
  });
});
