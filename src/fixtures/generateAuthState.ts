import 'dotenv/config';
import { chromium } from '@playwright/test';
import { SauceLoginPage } from '../pages/sauce.login.page';
import { mkdirSync, existsSync } from 'fs';

const STATE_PATH = 'src/fixtures/storageState.sauce.json';

(async () => {
  // skip if it already exists (idempotent)
  if (!existsSync('src/fixtures')) mkdirSync('src/fixtures', { recursive: true });
  if (existsSync(STATE_PATH)) {
    console.log(`[auth] Using existing ${STATE_PATH}`);
    process.exit(0);
  }

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const login = new SauceLoginPage(page);
  await login.goto();
  await login.login(process.env.SAUCE_USER!, process.env.SAUCE_PASS!);

  await context.storageState({ path: STATE_PATH });
  await browser.close();
  console.log(`[auth] Wrote ${STATE_PATH}`);
})();
