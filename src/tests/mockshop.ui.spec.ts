import { test, expect } from '@playwright/test';

// We'll use absolute URLs so it works from a data: page.
const API = {
  product: 'https://mock.shop.test/api/products/42',
  reviews: 'https://mock.shop.test/api/reviews?productId=42',
};

// Minimal "real" page: fetch two endpoints, render title, price, reviews, or error.
const pageHTML = () => `<!doctype html>
<html>
  <head><meta charset="utf-8"><title>Mock Shop</title></head>
  <body>
    <main style="font-family:system-ui;max-width:680px;margin:24px auto">
      <h1 id="title">Loading…</h1>
      <div data-testid="price"></div>
      <div data-testid="reviews-count"></div>
      <ul id="reviews"></ul>
      <div role="alert" id="error" hidden>Something went wrong. Please try again.</div>
    </main>
    <script>
      (async () => {
        try {
          const [pRes, rRes] = await Promise.all([
            fetch('${API.product}'),
            fetch('${API.reviews}')
          ]);
          const p = await pRes.json();
          const rs = await rRes.json();

          document.querySelector('#title').textContent = p.title;
          document.querySelector('[data-testid=price]').textContent = '$' + p.price.toFixed(2);
          document.querySelector('[data-testid=reviews-count]').textContent =
            (rs.length ? rs.length + ' reviews' : 'No reviews yet');

          const ul = document.getElementById('reviews');
          rs.forEach(r => {
            const li = document.createElement('li');
            li.textContent = r.author + ': ' + r.text;
            ul.appendChild(li);
          });
        } catch (e) {
          document.getElementById('error').hidden = false;
        }
      })();
    </script>
  </body>
</html>`;

test.describe('@mock-shop Product page (mocked APIs)', () => {
  test('renders product + reviews (happy path)', async ({ page }) => {
    const product = { id: 42, title: 'Noise-Cancelling Headphones', price: 199.99, image: '/img/42.png' };
    const reviews = [
      { id: 1, author: 'Ava', rating: 5, text: 'So quiet!' },
      { id: 2, author: 'Leo', rating: 4, text: 'Great for flights.' },
    ];

    // Intercept BOTH endpoints BEFORE navigation
    await page.route(API.product, r =>
      r.fulfill({
        status: 200,
        contentType: 'application/json',
        headers: { 'access-control-allow-origin': '*' },
        body: JSON.stringify(product),
      })
    );
    await page.route(API.reviews, r =>
      r.fulfill({
        status: 200,
        contentType: 'application/json',
        headers: { 'access-control-allow-origin': '*' },
        body: JSON.stringify(reviews),
      })
    );

    // Load the page from a data URL (no server needed)
    await page.goto('data:text/html,' + encodeURIComponent(pageHTML()), { waitUntil: 'domcontentloaded' });

    // Make sure both calls came back
    await page.waitForResponse(r => r.url() === API.product && r.status() === 200);
    await page.waitForResponse(r => r.url() === API.reviews && r.status() === 200);

    // Assert UI used our mocks
    await expect(page.locator('h1')).toHaveText(product.title);
    await expect(page.getByTestId('price')).toHaveText(`$${product.price.toFixed(2)}`);
    await expect(page.getByTestId('reviews-count')).toHaveText('2 reviews');
    await expect(page.getByText('Ava')).toBeVisible();
    await expect(page.getByText('Leo')).toBeVisible();
  });

  test('empty reviews shows "No reviews yet"', async ({ page }) => {
    const product = { id: 42, title: 'Noise-Cancelling Headphones', price: 199.99, image: '/img/42.png' };
    await page.route(API.product, r =>
      r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(product) })
    );
    await page.route(API.reviews, r =>
      r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: '[]' })
    );

    await page.goto('data:text/html,' + encodeURIComponent(pageHTML()), { waitUntil: 'domcontentloaded' });

    await expect(page.getByTestId('reviews-count')).toHaveText('No reviews yet');
  });

  test('server error shows friendly message', async ({ page }) => {
    // Force one endpoint to fail
    await page.route(API.product, r => r.fulfill({ status: 500, body: 'oops' }));
    await page.route(API.reviews, r => r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: '[]' }));

    await page.goto('data:text/html,' + encodeURIComponent(pageHTML()), { waitUntil: 'domcontentloaded' });

    await expect(page.getByRole('alert')).toHaveText(/something went wrong/i);
  });
});
