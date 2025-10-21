import { expect, test } from './utils';

test('test simple', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Juste pour voir si la page charge
  await expect(page.locator('body')).toBeVisible();
});