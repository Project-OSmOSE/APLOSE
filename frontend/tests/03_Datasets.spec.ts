import { ESSENTIAL, expect, test } from './utils';
import { UserType } from './fixtures';

// Utils

const TEST = {
  empty: (as: UserType) => {
    return test('Should display empty state', async ({ page }) => {
      await page.dataset.list.go(as, 'empty');
      await expect(page.getByText('No datasets')).toBeVisible();

      const modal = await page.dataset.list.openImportModal('empty')
      await expect(modal.locator).toContainText('There is no new dataset or analysis')
    });
  },
  display: (as: UserType) => {
    return test('Should display loaded data', async ({ page }) => {
      await page.dataset.list.go(as);
      await expect(page.getByText('Test dataset')).toBeVisible();

      const modal = await page.dataset.list.openImportModal()
      await expect(modal.locator).toContainText('Test import dataset')
      await expect(modal.locator).toContainText('Test analysis 1')
      await expect(modal.locator).toContainText('Test analysis 2')
      await modal.search('1')
      await expect(modal.locator).toContainText('Test import dataset')
      await expect(modal.locator).toContainText('Test analysis 1')
      await expect(modal.locator).not.toContainText('Test analysis 2')
    });
  },
  manageDatasetImport: (as: UserType) => {
    return test('Should manage import of a dataset', async ({ page }) => {
      await page.dataset.list.go(as);
      const modal = await page.dataset.list.openImportModal()

      // TODO: intercept import mutation and check content
      await Promise.all([
        page.waitForRequest("**/graphql"),
        await modal.importDataset()
      ])
    })
  },
  manageAnalysisImport: (as: UserType) => {
    return test('Should manage import of an analysis', async ({ page }) => {
      await page.dataset.list.go(as);
      const modal = await page.dataset.list.openImportModal()

      // TODO: intercept import mutation and check content
      await Promise.all([
        page.waitForRequest("**/graphql"),
        await modal.importAnalysis()
      ])
    })
  }
}


// Tests

test.describe('Staff', ESSENTIAL, () => {
  TEST.empty('staff')
  TEST.display('staff')
  TEST.manageDatasetImport('staff')
  TEST.manageAnalysisImport('staff')
})

test.describe('Superuser', ESSENTIAL, () => {
  TEST.empty('superuser')
  TEST.display('superuser')
  TEST.manageDatasetImport('superuser')
  TEST.manageAnalysisImport('superuser')
})
