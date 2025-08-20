import { test, expect } from '@playwright/test';
import { runA11y } from '../utils/a11y';

test.skip(({ browserName }) => browserName !== 'chromium');
test.use({ baseURL: 'https://demo.playwright.dev' });

test.describe('@a11y TodoMVC', () => {
  test('main list has no serious/critical issues', async ({ page }) => {
    await page.goto('/todomvc', { waitUntil: 'domcontentloaded' });

    // You can scope to a section if you want:
    const { violations } = await runA11y(
      page,
      test.info().titlePath.join(' '),
      { include: '.todoapp',
        impacts: ['critical'],  
     } // or omit to scan full page
    );
    expect(violations, JSON.stringify(violations, null, 2)).toHaveLength(0);
  });
});
