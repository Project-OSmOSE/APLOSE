import { essential, expect, test } from './utils';
import { interceptRequests } from './utils/mock';
import { spectrogramAnalysis } from './utils/mock/types';
import type { ImportSpectrogramAnalysisMutationVariables } from '../src/api/spectrogram-analysis';
import type { Params } from './utils/types';

// Utils

const TEST = {

  // Page

  handlePageEmptyState: ({ as, tag }: Pick<Params, 'as' | 'tag'>) =>
    test(`Handle empty state as ${ as }`, { tag }, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: as,
        listSpectrogramAnalysis: 'empty',
        listChannelConfigurations: 'empty',
        listAvailableSpectrogramAnalysisForImport: 'empty',
      })
      await test.step(`Navigate`, () => page.datasetDetail.go({ as }));

      await test.step('Display empty message', () =>
        expect(page.getByText('No spectrogram analysis')).toBeVisible())
    }),

  pageDisplayLoadedData: ({ as, tag }: Pick<Params, 'as' | 'tag'>) =>
    test(`Display loaded data as ${ as }`, { tag }, async ({ page }) => {
      await interceptRequests(page, { getCurrentUser: as })
      await test.step(`Navigate`, () => page.datasetDetail.go({ as }));

      await test.step('Display dataset', () =>
        expect(page.getByText(spectrogramAnalysis.name)).toBeVisible())
    }),

  // Modal

  handleModalEmptyState: ({ as, tag }: Pick<Params, 'as' | 'tag'>) =>
    test(`Handle empty state as ${ as }`, { tag }, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: as,
        listSpectrogramAnalysis: 'empty',
        listChannelConfigurations: 'empty',
        listAvailableSpectrogramAnalysisForImport: 'empty',
      })
      await test.step(`Navigate`, async () => {
        await page.datasetDetail.go({ as })
        await page.datasetDetail.importAnalysis.button.click()
        await expect(page.datasetDetail.importAnalysis.modal).toBeVisible()
      });

      await test.step('Display empty message', () =>
        expect(page.datasetDetail.importAnalysis.modal).toContainText('There is no new analysis'))
    }),

  modalDisplayLoadedData: ({ as, tag }: Pick<Params, 'as' | 'tag'>) =>
    test(`Display loaded data as ${ as }`, { tag }, async ({ page }) => {
      await interceptRequests(page, { getCurrentUser: as })
      await test.step(`Navigate`, async () => {
        await page.datasetDetail.go({ as })
        await page.datasetDetail.importAnalysis.button.click()
        await expect(page.datasetDetail.importAnalysis.modal).toBeVisible()
      });

      await test.step('Import modal display data', async () => {
        await expect(page.datasetDetail.importAnalysis.modal).toContainText('Test analysis 1')
        await expect(page.datasetDetail.importAnalysis.modal).toContainText('Test analysis 2')
        await page.datasetDetail.importAnalysis.search('1')
        await expect(page.datasetDetail.importAnalysis.modal).toContainText('Test analysis 1')
        await expect(page.datasetDetail.importAnalysis.modal).not.toContainText('Test analysis 2')
      })
    }),

  importAnalysis: ({ as, tag }: Pick<Params, 'as' | 'tag'>) =>
    test(`Import an analysis as ${ as }`, { tag }, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: as,
        importDataset: 'empty',
      })
      await test.step(`Navigate`, async () => {
        await page.datasetDetail.go({ as })
        await page.datasetDetail.importAnalysis.button.click()
        await expect(page.datasetDetail.importAnalysis.modal).toBeVisible()
      });

      const [ request ] = await Promise.all([
        page.waitForRequest('**/graphql'),
        await page.datasetDetail.importAnalysis.importAnalysisButton.click(),
      ])
      const variables: ImportSpectrogramAnalysisMutationVariables = request.postDataJSON().variables
      expect(variables.name).toEqual('Test analysis 1')
    }),
}


// Tests
test.describe('[Dataset detail]', () => {

  TEST.handlePageEmptyState({ as: 'staff', tag: essential })
  TEST.handlePageEmptyState({ as: 'superuser' })

  TEST.pageDisplayLoadedData({ as: 'staff', tag: essential })
  TEST.pageDisplayLoadedData({ as: 'superuser' })

})
test.describe('[Dataset detail] Import modal', () => {

  TEST.handleModalEmptyState({ as: 'staff', tag: essential })
  TEST.handleModalEmptyState({ as: 'superuser' })

  TEST.modalDisplayLoadedData({ as: 'staff', tag: essential })
  TEST.modalDisplayLoadedData({ as: 'superuser' })

  TEST.importAnalysis({ as: 'staff', tag: essential })
  TEST.importAnalysis({ as: 'superuser' })

})
