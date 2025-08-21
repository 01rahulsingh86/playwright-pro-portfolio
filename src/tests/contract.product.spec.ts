import { test, expect } from '@playwright/test';
import { DummyProductSchema } from '../utils/schemas';
import { assertContract } from '../utils/contracts';

test.skip(({ browserName }) => browserName !== 'chromium');
test.describe('@contract Product', () => {
  test('UI renders a product that matches the schema (API→UI)', async ({ page }) => {
    // 1) Mock payload (must satisfy the schema)
    const mocked = {
      id: 1,
      title: 'Acme Noise-Cancelling Headphones',
      description: 'Over-ear, ANC, 30h battery',
      price: 199.99,
      discountPercentage: 0,
      rating: 4.6,
      stock: 42,
      brand: 'Acme',
      category: 'audio',
      thumbnail: 'https://dummyimage.com/200x200/000/fff.png&text=Acme',
      images: ['https://dummyimage.com/600x400/000/fff.png&text=Acme+Headphones'],
    };

    // 2) Register route BEFORE any navigation
    const API_URL = 'https://contract.test/api/products/1';
    await page.route(API_URL, async (route) => {
      // contract validation (throws pretty error if mismatch)
      assertContract(DummyProductSchema, mocked, 'Product');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        headers: {
          // allow cross-origin fetch from data: page
          'access-control-allow-origin': '*',
        },
        body: JSON.stringify(mocked),
      });
    });

    // 3) Minimal page that fetches the absolute URL above
    const html = `<!doctype html>
<html>
<head><meta charset="utf-8"><title>Contract Demo</title></head>
<body>
  <main id="root" style="font-family: system-ui, sans-serif; padding: 16px">
    <h1>Product</h1>
    <div id="title"></div>
    <div id="price"></div>
  </main>
  <script>
    (async () => {
      const res = await fetch('${API_URL}');
      const p = await res.json();
      document.getElementById('title').textContent = p.title;
      document.getElementById('price').textContent = '$' + p.price;
    })();
  </script>
</body>
</html>`;

    // 4) Navigate AFTER route is ready
    await page.goto('data:text/html,' + encodeURIComponent(html), { waitUntil: 'domcontentloaded' });

    // (optional) wait for the fetch to come back
    await page.waitForResponse((r) => r.url() === API_URL && r.status() === 200);

    // 5) Assert UI reflects validated payload
    await expect(page.locator('#title')).toHaveText(mocked.title);
    await expect(page.locator('#price')).toHaveText(`$${mocked.price}`);
  });
});
