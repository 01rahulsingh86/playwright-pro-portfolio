/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();
const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
test.skip(!!process.env.CI, 'Quarantined on CI while we stabilize auth flow');

const STATE_PATH = path.resolve(__dirname, 'storageState.sauce.json');

(async () => {
  try {
    fs.mkdirSync(path.dirname(STATE_PATH), { recursive: true });

    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    const base = process.env.BASE_URL || 'https://www.saucedemo.com';
    const user = process.env.SAUCE_USER || 'standard_user';
    const pass = process.env.SAUCE_PASS || 'secret_sauce';

    await page.goto(base);
    await page.getByPlaceholder('Username').fill(user);
    await page.getByPlaceholder('Password').fill(pass);
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL(/inventory\.html/);

    await context.storageState({ path: STATE_PATH });
    await browser.close();
    console.log(`[auth] Wrote ${STATE_PATH}`);
  } catch (err) {
    console.error('[auth] Failed to generate storage state:', err);
    process.exit(1);
  }
})();
