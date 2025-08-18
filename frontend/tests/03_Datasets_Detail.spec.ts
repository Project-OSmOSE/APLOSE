import { ESSENTIAL, expect, test } from './utils';
import { UserType } from './fixtures';

// Utils

const TEST = {
  empty: (as: UserType) => {
    return test('Should display empty state', async ({ page }) => {
      await page.dataset.detail.go(as, 'empty');
      await expect(page.locator('.table-content')).not.toBeVisible();
      await expect(page.getByText('No spectrogram analysis')).toBeVisible();

      const modal = await page.dataset.detail.openImportModal('empty')
      await expect(modal.locator).toContainText('There is no new analysis')
    });
  },
  display: (as: UserType) => {
    return test('Should display loaded data', async ({ page }) => {
      await page.dataset.detail.go(as);
      await expect(page.getByText('Test analysis')).toBeVisible();

      const modal = await page.dataset.detail.openImportModal()
      await expect(modal.locator).toContainText('Test analysis 1')
      await expect(modal.locator).toContainText('Test analysis 2')
      await modal.search('1')
      await expect(modal.locator).toContainText('Test analysis 1')
      await expect(modal.locator).not.toContainText('Test analysis 2')
    });
  },
  manageAnalysisImport: (as: UserType) => {
    return test('Should manage import of an analysis', async ({ page }) => {
      await page.dataset.detail.go(as);
      await expect(page.getByText('Test analysis')).toBeVisible();

      const modal = await page.dataset.detail.openImportModal()

      // TODO: intercept import mutation and check content
      await Promise.all([
        page.waitForRequest("**/graphql"),
        await modal.locator.locator('.download-analysis').first().click()
      ])
    })
  }
}


// Tests

test.describe('Staff', ESSENTIAL, () => {
  TEST.empty('staff')
  TEST.display('staff')
  TEST.manageAnalysisImport('staff')
})

test.describe('Superuser', ESSENTIAL, () => {
  TEST.empty('superuser')
  TEST.display('superuser')
  TEST.manageAnalysisImport('superuser')
})
