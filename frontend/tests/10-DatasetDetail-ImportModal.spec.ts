import { essentialTag, expect, test } from './utils';
import { gqlURL, interceptRequests } from './utils/mock';
import type { Params } from './utils/types';
import { dataset, storageAnalysis } from './utils/mock/types';
import type { ImportAnalysisFromStorageMutationVariables } from '../src/api/storage/storage.generated';

// Utils

const TEST = {

    handleModalEmptyState: ({ as, tag }: Pick<Params, 'as' | 'tag'>) =>
        test(`Handle empty state in Import modal as ${ as }`, { tag }, async ({ page }) => {
            await interceptRequests(page, {
                getCurrentUser: as,
                listSpectrogramAnalysis: 'empty',
                listChannelConfigurations: 'empty',
                listAvailableSpectrogramAnalysisForImport: 'empty',
                browseStorage: 'empty',
            })
            await test.step(`Navigate`, async () => {
                await page.datasetDetail.go({ as })
                await page.datasetDetail.importAnalysis.button.click()
                await expect(page.datasetDetail.importAnalysis.modal).toBeVisible()
            });

            await test.step('Display empty message', async () => {
                await expect(page.datasetDetail.importAnalysis.modal).toContainText(dataset.name)
                await expect(page.datasetDetail.importAnalysis.modal).toContainText('Empty')
            })
        }),

    modalDisplayLoadedData: ({ as, tag }: Pick<Params, 'as' | 'tag'>) =>
        test(`Display loaded data in Import modal as ${ as }`, { tag }, async ({ page }) => {
            await interceptRequests(page, {
                getCurrentUser: as,
                browseStorage: 'dataset'
            })
            await test.step(`Navigate`, async () => {
                await page.datasetDetail.go({ as })
                await page.datasetDetail.importAnalysis.button.click()
                await expect(page.datasetDetail.importAnalysis.modal).toBeVisible()
            });

            await test.step('Import modal display data', async () => {
                await expect(page.datasetDetail.importAnalysis.modal).toContainText(dataset.name)
                await expect(page.datasetDetail.importAnalysis.modal).toContainText(storageAnalysis.name)
            })
        }),

    importAnalysis: ({ as, tag }: Pick<Params, 'as' | 'tag'>) =>
        test(`Import an analysis as ${ as }`, { tag }, async ({ page }) => {
            await interceptRequests(page, {
                getCurrentUser: as,
                browseStorage: 'dataset',
                importAnalysisFromStorage: 'empty',
            })
            await test.step(`Navigate`, async () => {
                await page.datasetDetail.go({ as })
                await page.datasetDetail.importAnalysis.button.click()
                await expect(page.datasetDetail.importAnalysis.modal).toBeVisible()
            });

            const [ request ] = await Promise.all([
                page.waitForRequest(gqlURL),
                await page.datasetDetail.importAnalysis.importButton.click(),
            ])
            const variables: ImportAnalysisFromStorageMutationVariables = request.postDataJSON().variables
            expect(variables.name).toEqual(storageAnalysis.name)
            expect(variables.datasetPath).toEqual(dataset.path)
        }),
}


// Tests
test.describe('/dataset/:datasetID', () => {

    TEST.handleModalEmptyState({ as: 'staff', tag: essentialTag })
    TEST.handleModalEmptyState({ as: 'superuser' })

    TEST.modalDisplayLoadedData({ as: 'staff', tag: essentialTag })
    TEST.modalDisplayLoadedData({ as: 'superuser' })

    TEST.importAnalysis({ as: 'staff', tag: essentialTag })
    TEST.importAnalysis({ as: 'superuser' })

})
