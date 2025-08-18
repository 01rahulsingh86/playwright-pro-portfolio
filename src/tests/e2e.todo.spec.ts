import { test, expect } from '@playwright/test';
import { TodoPage } from '../pages/todo.page';

// at top of e2e.todo.spec.ts
test.skip(({browserName})=> browserName !== 'chromium'); // 'Skipping on WebKit due to known issues with the demo site');


// Use the demo site just for this file
test.use({ baseURL: 'https://demo.playwright.dev' });

test.describe('@e2e TodoMVC', () => {
  test('add and clear completed', async ({ page }) => {
    const todo = new TodoPage(page);
    await todo.goto();

    await todo.addTodo('Learn Playwright POM');
    await todo.addTodo('Ship portfolio repo');
    await todo.expectCount(2);

    await todo.toggle(0);
    await todo.clearCompletedTodos();
    await todo.expectCount(1);

   // await expect(page).toHaveScreenshot(); // visual baseline
  });
});
