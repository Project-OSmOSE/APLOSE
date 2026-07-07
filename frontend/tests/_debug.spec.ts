import { expect, test } from './utils';
import { interceptRequests } from './utils/mock';

test('test simple', async ({ page }) => {
  await interceptRequests(page, {
    homeCollaborators: 'empty',
  })
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // Juste pour voir si la page charge
  await expect(page.locator('body')).toBeVisible();
});