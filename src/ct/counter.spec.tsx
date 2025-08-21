import { test, expect } from '@playwright/experimental-ct-react';
import Counter from '../components/Counter';

test.describe('@ct Counter', () => {
  test('increments, decrements, resets', async ({ mount }) => {
    const comp = await mount(<Counter start={1} />);
    await expect(comp.getByLabel('count')).toHaveText('1');

    await comp.getByRole('button', { name: 'Increment' }).click();
    await expect(comp.getByLabel('count')).toHaveText('2');

    await comp.getByRole('button', { name: 'Decrement' }).click();
    await expect(comp.getByLabel('count')).toHaveText('1');

    await comp.getByRole('button', { name: 'Reset' }).click();
    await expect(comp.getByLabel('count')).toHaveText('0');
  });
});
