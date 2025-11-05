import { essential, expect, test } from './utils';
import { interceptRequests } from './utils/mock';
import { dataset } from './utils/mock/types';
import { ImportNewDatasetMutationVariables } from '../src/api/dataset';
import { type ImportSpectrogramAnalysisMutationVariables } from '../src/api/spectrogram-analysis';
import type { Params } from './utils/types';

// Utils

const TEST = {

  // List

  handleListEmptyState: ({ as }: Pick<Params, 'as'>) =>
    test(`Handle empty state as ${ as }`, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: as,
        listDatasets: 'empty',
        listAvailableDatasetsForImport: 'empty',
      })
      await test.step(`Navigate`, () => page.datasets.go({ as }));

      await test.step('Display empty message', () =>
        expect(page.getByText('No datasets')).toBeVisible())
    }),

  listDisplayLoadedData: ({ as }: Pick<Params, 'as'>) =>
    test(`Display loaded data as ${ as }`, async ({ page }) => {
      await interceptRequests(page, { getCurrentUser: as })
      await test.step(`Navigate`, () => page.datasets.go({ as }));

      await test.step('Display dataset', () =>
        expect(page.getByText(dataset.name)).toBeVisible())
    }),


  // Modal

  handleModalEmptyState: ({ as }: Pick<Params, 'as'>) =>
    test(`Handle empty state as ${ as }`, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: as,
        listDatasets: 'empty',
        listAvailableDatasetsForImport: 'empty',
      })
      await test.step(`Navigate`, async () => {
        await page.datasets.go({ as })
        await page.datasets.importDataset.button.click()
        await expect(page.datasets.importDataset.modal).toBeVisible()
      });

      await test.step('Display empty message', async () => {
        await expect(page.datasets.importDataset.modal).toContainText('There is no new dataset or analysis')
      })
    }),

  modalDisplayLoadedData: ({ as }: Pick<Params, 'as'>) =>
    test(`Display loaded data as ${ as }`, async ({ page }) => {
      await interceptRequests(page, { getCurrentUser: as })
      await test.step(`Navigate`, async () => {
        await page.datasets.go({ as })
        await page.datasets.importDataset.button.click()
        await expect(page.datasets.importDataset.modal).toBeVisible()
      });

      await test.step('Import modal display data', async () => {
        await expect(page.datasets.importDataset.modal).toContainText('Test import dataset')
        await expect(page.datasets.importDataset.modal).toContainText('Test analysis 1')
        await expect(page.datasets.importDataset.modal).toContainText('Test analysis 2')
        await page.datasets.importDataset.search('1')
        await expect(page.datasets.importDataset.modal).toContainText('Test import dataset')
        await expect(page.datasets.importDataset.modal).toContainText('Test analysis 1')
        await expect(page.datasets.importDataset.modal).not.toContainText('Test analysis 2')
      })
    }),

  importDataset: ({ as }: Pick<Params, 'as'>) =>
    test(`Import a dataset as ${ as }`, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: as,
        importDataset: 'empty',
      })
      await test.step(`Navigate`, async () => {
        await page.datasets.go({ as })
        await page.datasets.importDataset.button.click()
        await expect(page.datasets.importDataset.modal).toBeVisible()
      });

      const [ request ] = await Promise.all([
        page.waitForRequest('**/graphql'),
        await page.datasets.importDataset.importDatasetButton.click(),
      ])
      const variables: ImportNewDatasetMutationVariables = request.postDataJSON().variables
      expect(variables.name).toEqual('Test import dataset')
    }),

  importAnalysis: ({ as }: Pick<Params, 'as'>) =>
    test(`Import an analysis as ${ as }`, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: as,
        importDataset: 'empty',
      })
      await test.step(`Navigate`, async () => {
        await page.datasets.go({ as })
        await page.datasets.importDataset.button.click()
        await expect(page.datasets.importDataset.modal).toBeVisible()
      });

      const [ request ] = await Promise.all([
        page.waitForRequest('**/graphql'),
        await page.datasets.importDataset.importAnalysisButton.click(),
      ])
      const variables: ImportSpectrogramAnalysisMutationVariables = request.postDataJSON().variables
      expect(variables.name).toEqual('Test analysis 1')
    }),
}


// Tests
test.describe('[Dataset list]', { tag: essential }, () => {

  TEST.handleListEmptyState({ as: 'staff' })
  TEST.handleListEmptyState({ as: 'superuser' })

  TEST.listDisplayLoadedData({ as: 'staff' })
  TEST.listDisplayLoadedData({ as: 'superuser' })

})

test.describe('[Dataset list] Import modal', { tag: essential }, () => {

  TEST.handleModalEmptyState({ as: 'staff' })
  TEST.handleModalEmptyState({ as: 'superuser' })

  TEST.modalDisplayLoadedData({ as: 'staff' })
  TEST.modalDisplayLoadedData({ as: 'superuser' })

  TEST.importDataset({ as: 'staff' })
  TEST.importDataset({ as: 'superuser' })

  TEST.importAnalysis({ as: 'staff' })
  TEST.importAnalysis({ as: 'superuser' })

})
