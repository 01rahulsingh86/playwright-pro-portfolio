import { Page, expect } from '@playwright/test';

export class SauceLoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto(process.env.BASE_URL || 'https://www.saucedemo.com');
    await expect(this.page.getByRole('button', { name: 'Login' })).toBeVisible();
  }

  async login(username: string, password: string) {
    await this.page.getByPlaceholder('Username').fill(username);
    await this.page.getByPlaceholder('Password').fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
    await expect(this.page).toHaveURL(/inventory.html/);
  }
}
