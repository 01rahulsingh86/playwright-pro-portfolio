// src/tests/products.ui.spec.ts
import { test, expect } from '@playwright/test';

test.describe('@e2e Products (mocked API)', () => {
  test('renders product list from mocked API', async ({ page }) => {
    // 1) Set up the fake response BEFORE visiting the page
    const fakeProducts = [
      { id: 1, title: 'Blue Tee', price: 19.99 },
      { id: 2, title: 'Red Hoodie', price: 49.0 },
    ];

    await page.route('**/api/products', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        headers: { 'access-control-allow-origin': '*' }, // safe even if cross-origin
        body: JSON.stringify(fakeProducts),
      });
    });

    // 2) Visit your app (local dev server or deployed preview)
    await page.goto('/products'); // assumes baseURL is set in playwright config

    // 3) Assert UI uses the mocked data
    await expect(page.getByText('Blue Tee')).toBeVisible();
    await expect(page.getByText('$19.99')).toBeVisible();
    await expect(page.getByText('Red Hoodie')).toBeVisible();
  });
});
// Note: This test assumes you have a route set up for '/products' that fetches from the mocked API.