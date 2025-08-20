import { test, expect, request } from '@playwright/test';
import { DummyProductSchema } from '../utils/schemas';

test('@api contract DummyJSON product schema', async () => {
  const ctx = await request.newContext({ baseURL: 'https://dummyjson.com' });
  const res = await ctx.get('/products/1');
  console.log('Status:', res.status(), res.statusText());
  console.log("response:",res);
  expect(res.ok()).toBeTruthy();

  const json = await res.json();
  const parsed = DummyProductSchema.safeParse(json);
  if (!parsed.success) console.error(parsed.error.format());
  expect(parsed.success).toBeTruthy();

  // a couple of semantic checks
  expect(json.id).toBe(1);
  expect(typeof json.title).toBe('string');
  expect(json.price).toBeGreaterThan(0);
});
