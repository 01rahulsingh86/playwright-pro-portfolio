import { test, expect } from '@playwright/test';


test('debug baseURL + homepage', async ({ page }) => {
  console.log('Resolved baseURL:', test.info().project.use.baseURL);
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});



test('homepage has title and get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // check title
  await expect(page).toHaveTitle(/Playwright/);

  // check link
  const getStarted = page.getByRole('link', { name: 'Get started' });
  await expect(getStarted).toBeVisible();

  // click link and assert URL
  await getStarted.click();
  await expect(page).toHaveURL(/.*intro/);
});

