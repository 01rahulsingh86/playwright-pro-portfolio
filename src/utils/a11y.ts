// src/utils/a11y.ts
import { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import * as fs from 'fs';
import * as path from 'path';

export type Impact = 'minor' | 'moderate' | 'serious' | 'critical';

function groupByImpact(violations: any[]) {
  return violations.reduce<Record<string, any[]>>((acc, v) => {
    const key = v.impact || 'unknown';
    (acc[key] ||= []).push(v);
    return acc;
  }, {});
}

function writeJson(file: string, data: unknown) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

/**
 * Runs axe on the current page and writes a JSON report to test-results/a11y/.
 * Returns filtered violations (defaults to serious+critical).
 */
export async function runA11y(
  page: Page,
  testName: string,
  opts: { include?: string | string[]; impacts?: Impact[] } = {}
) {
  const { include, impacts = ['serious', 'critical'] } = opts;

  let builder = new AxeBuilder({ page });
  if (include) {
    const sels = Array.isArray(include) ? include : [include];
    for (const sel of sels) builder = builder.include(sel);
  }

  const results = await builder.analyze();
  const filtered = results.violations.filter(v => impacts.includes(v.impact as Impact));

  const safe = testName.replace(/[^\w.-]+/g, '_');
  const outfile = path.resolve('test-results/a11y', `${safe}.json`);
  writeJson(outfile, {
    url: page.url(),
    totalViolations: results.violations.length,
    filteredCount: filtered.length,
    byImpact: groupByImpact(results.violations),
    violations: results.violations,
  });

  return { results, violations: filtered };
}
