import { test } from '@playwright/test';
import { HomePage } from '../pages/home.page';

test.describe('@e2e @smoke Home', () => {
  test('navigate to getting started via POM', async ({ page }) => {
    const home = new HomePage(page);
    await page.goto('https://playwright.dev/');   
    await home.clickGetStarted();
  });
});
