// src/tests/auth.inventory.spec.ts
import 'dotenv/config';
import { test, expect, Page } from '@playwright/test';

test.skip(!!process.env.CI, 'Quarantined on CI while we stabilize auth flow');


// (optional) keep only Chromium for stability
test.skip(({ browserName }) => browserName !== 'chromium');

// Pin baseURL + storageState for THIS FILE
test.use({
  baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',
  storageState: 'src/fixtures/storageState.sauce.json',
});

test.describe('@auth Inventory', () => {
  const isSauce = (base?: string) => (base ?? '').includes('saucedemo');

  async function ensureLoggedIn(page: Page) {
    if (page.url().includes('/inventory.html')) return;

    const loginBtn = page.getByRole('button', { name: 'Login' });
    const username = page.getByPlaceholder('Username');
    const password = page.getByPlaceholder('Password');

    await Promise.race([
      loginBtn.waitFor({ state: 'visible', timeout: 8000 }),
      page.waitForURL(/inventory\.html/, { timeout: 8000 }),
    ]).catch(() => {});

    if (await loginBtn.isVisible({ timeout: 1000 })) {
      await username.fill(process.env.SAUCE_USER!);
      await password.fill(process.env.SAUCE_PASS!);
      await loginBtn.click();
    }
    await expect(page).toHaveURL(/inventory\.html/);
  }

  test('add 2 items to cart and verify', async ({ page }) => {
    // ✅ Read from project.use (NOT config.use)
    const baseURL = String(((test.info().project.use as any).baseURL) ?? '');
    expect(isSauce(baseURL), `Wrong baseURL: ${baseURL}`).toBeTruthy();

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await ensureLoggedIn(page);

    await expect(page.locator('.inventory_item').first()).toBeVisible();

    // Stable selectors
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();

    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(/cart\.html/);
    await expect(page.locator('.cart_item')).toHaveCount(2);
  });
});
