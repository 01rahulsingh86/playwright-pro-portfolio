import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly getStartedLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.getStartedLink = page.getByRole('link', { name: 'Get started' });
  }

  async goto() {
    await this.page.goto('/');
    await expect(this.page).toHaveTitle(/Playwright/);
  }

  async clickGetStarted() {
    await expect(this.getStartedLink).toBeVisible();
    await this.getStartedLink.click();
    await expect(this.page).toHaveURL(/.*intro/);
  }
}
