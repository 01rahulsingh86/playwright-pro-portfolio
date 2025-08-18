// src/tests/auth.inventory.spec.ts
import 'dotenv/config';
import { test, expect } from '@playwright/test';


test.describe('@auth Inventory', () => {
  // run this suite only on the auth-chromium project

  // helper: if redirected to login, perform login once
  async function ensureLoggedIn(page) {
    // if we are already on inventory, bail
    if ((await page.url()).includes('/inventory.html')) return;

    // if login form is visible, do login
    const loginBtn = page.getByRole('button', { name: 'Login' });
    if (await loginBtn.isVisible({ timeout: 2000 })) {
      await page.getByPlaceholder('Username').fill(process.env.SAUCE_USER!);
      await page.getByPlaceholder('Password').fill(process.env.SAUCE_PASS!);
      await loginBtn.click();
      await expect(page).toHaveURL(/inventory.html/);
    }
  }

  test('add 2 items to cart and verify', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'auth-chromium') {
      test.skip();
    }
    await page.goto('/inventory.html');
    await ensureLoggedIn(page);
    await expect(page).toHaveURL(/inventory.html/);

    // use stable data-test selectors on Sauce Demo
    const addButtons = page.locator('[data-test^="add-to-cart-"]');
    await addButtons.nth(0).click();
    await addButtons.nth(1).click();

    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveText('2');

    // Cart link has a stable data-test
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(/cart.html/);
    await expect(page.locator('.cart_item')).toHaveCount(2);
  });
});
