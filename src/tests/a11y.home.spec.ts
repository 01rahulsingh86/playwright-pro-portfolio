// src/tests/a11y.home.spec.ts
import { test, expect } from '@playwright/test';
import { runA11y } from '../utils/a11y';

test.skip(({ browserName }) => browserName !== 'chromium');

test.describe('@a11y Home', () => {
  test('homepage has no serious/critical issues', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const { violations } = await runA11y(page, test.info().titlePath.join(' '));
    expect(violations, JSON.stringify(violations, null, 2)).toHaveLength(0);
  });
});
