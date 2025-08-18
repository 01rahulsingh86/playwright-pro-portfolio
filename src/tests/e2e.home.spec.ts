import { test } from '@playwright/test';
import { HomePage } from '../pages/home.page';

test.describe('@e2e Home', () => {
  test('navigate to getting started via POM', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.clickGetStarted();
  });
});
