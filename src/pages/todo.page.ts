import { Page, Locator, expect } from '@playwright/test';

export class TodoPage {
  readonly page: Page;
  readonly input: Locator;
  readonly items: Locator;
  readonly toggleAll: Locator;
  readonly clearCompleted: Locator;

  constructor(page: Page) {
    this.page = page;
    this.input = page.getByPlaceholder('What needs to be done?');
    this.items = page.locator('.todo-list li'); // stable here on the demo
    this.toggleAll = page.getByLabel('Mark all as complete');
    this.clearCompleted = page.getByRole('button', { name: 'Clear completed' });
  }

  async goto() {
    await this.page.goto('/todomvc');
    await expect(this.input).toBeVisible();
  }

  async addTodo(text: string) {
    await this.input.fill(text);
    await this.input.press('Enter');
  }

  async toggle(index: number) {
    await this.items.nth(index).locator('.toggle').check();
  }

  async expectCount(n: number) {
    await expect(this.items).toHaveCount(n);
  }

  async clearCompletedTodos() {
    if (await this.clearCompleted.isVisible()) {
      await this.clearCompleted.click();
    }
  }
}
