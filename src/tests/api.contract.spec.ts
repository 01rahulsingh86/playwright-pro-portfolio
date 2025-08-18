import { test, expect, request } from '@playwright/test';
import { CatFactSchema, ProductSchema } from '../utils/schemas';

test.describe('@api contract', () => {
  test('CatFact contract holds', async () => {
    const ctx = await request.newContext();
    const res = await ctx.get('https://catfact.ninja/fact');
    expect(res.ok()).toBeTruthy();

    const json = await res.json();
    const parsed = CatFactSchema.safeParse(json);
    if (!parsed.success) {
      console.error(parsed.error.format());
    }
    expect(parsed.success).toBeTruthy();
  });

  test('FakeStore first product matches schema', async () => {
    const ctx = await request.newContext();
    const res = await ctx.get('https://fakestoreapi.com/products/1');
    expect(res.ok()).toBeTruthy();

    const json = await res.json();
    const parsed = ProductSchema.safeParse(json);
    if (!parsed.success) {
      console.error(parsed.error.format());
    }
    expect(parsed.success).toBeTruthy();

    // A couple of semantic expectations
    expect(json.id).toBe(1);
    expect(typeof json.title).toBe('string');
  });

  test('Negative: product must have required fields', async () => {
    // Simulate a backend change or broken contract
    const bad = { id: 1, title: '' }; // missing required fields
    const parsed = ProductSchema.safeParse(bad);
    expect(parsed.success).toBeFalsy(); // contract should fail
  });
});
