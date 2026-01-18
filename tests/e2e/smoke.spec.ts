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

    // Wait for redirect - should NOT be /configuracoes
    await page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 10000 });

    // Verify we are on the dashboard, not configuracoes
    const currentUrl = page.url();
    expect(currentUrl).not.toContain('/configuracoes');

    // Dashboard should show dashboard cards - use specific heading
    await expect(page.getByRole('heading', { name: 'Alumínio LME Spot - USD/mt' })).toBeVisible({ timeout: 10000 });
  });

  test('financeiro login redirects to dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Financeiro' }).click();
    await page.getByLabel('Senha').fill('123');
    await page.getByRole('button', { name: 'Entrar' }).click();

    await page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 10000 });
    expect(page.url()).not.toContain('/configuracoes');
    await expect(page.getByRole('heading', { name: 'Alumínio LME Spot - USD/mt' })).toBeVisible({ timeout: 10000 });
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
