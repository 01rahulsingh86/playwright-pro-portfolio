import { ZodSchema } from 'zod';

export function assertContract<T>(schema: ZodSchema<T>, data: unknown, label: string): T {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    const pretty = JSON.stringify(parsed.error.format(), null, 2);
    throw new Error(`[contract] ${label} schema mismatch:\n${pretty}`);
  }
  return parsed.data;
}
