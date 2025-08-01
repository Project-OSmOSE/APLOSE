import { ESSENTIAL, expect, test } from './utils';
import { UserType } from './fixtures';
import { MOCK } from "./utils/services";

// Utils

const TEST = {
  empty: (as: UserType) => {
    return test('Should display empty state', async ({ page, interceptGQL }) => {
      await page.dataset.go(as);
      interceptGQL(page, "getAvailableDatasetsForImport", MOCK.getDatasetsAvailableForImport.empty)
      const modal = await page.dataset.openImportModal()

      await expect(modal.locator).toContainText('There is no new dataset or analysis')
    });
  },
  display: (as: UserType) => {
    return test('Should display loaded data', async ({ page, interceptGQL }) => {
      await page.dataset.go(as);
      interceptGQL(page, "getAvailableDatasetsForImport", MOCK.getDatasetsAvailableForImport.filled)
      const modal = await page.dataset.openImportModal()

      await expect(modal.locator).toContainText('Test import dataset')
      await expect(modal.locator).toContainText('Test analysis 1')
      await expect(modal.locator).toContainText('Test analysis 2')

      await modal.search('1')
      await expect(modal.locator).toContainText('Test import dataset')
      await expect(modal.locator).toContainText('Test analysis 1')
      await expect(modal.locator).not.toContainText('Test analysis 2')
    })
  },
  manageDatasetImport: (as: UserType) => {
    return test('Should manage import of a dataset', async ({ page, interceptGQL }) => {
      await page.dataset.go(as);
      interceptGQL(page, "getAvailableDatasetsForImport", MOCK.getDatasetsAvailableForImport.filled)
      const modal = await page.dataset.openImportModal()

      // TODO: intercept import mutation and check content
      interceptGQL(page, "importDatasets", {})
      await Promise.all([
        page.waitForRequest("**/graphql"),
        await modal.locator.locator('.download-dataset').click()
      ])
    })
  },
  manageAnalysisImport: (as: UserType) => {
    return test('Should manage import of an analysis', async ({ page, interceptGQL }) => {
      await page.dataset.go(as);
      interceptGQL(page, "getAvailableDatasetsForImport", MOCK.getDatasetsAvailableForImport.filled)
      const modal = await page.dataset.openImportModal()

      // TODO: intercept import mutation and check content
      interceptGQL(page, "importDatasets", {})
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
  TEST.manageDatasetImport('staff')
  TEST.manageAnalysisImport('staff')
})

test.describe('Superuser', ESSENTIAL, () => {
  TEST.empty('superuser')
  TEST.display('superuser')
  TEST.manageDatasetImport('superuser')
  TEST.manageAnalysisImport('superuser')
})
