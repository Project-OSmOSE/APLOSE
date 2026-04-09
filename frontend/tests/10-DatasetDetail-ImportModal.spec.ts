import { essentialTag, expect, test } from './utils';
import { interceptRequests } from './utils/mock';
import type { Params } from './utils/types';
import { storageAnalysis, storageDataset } from './utils/mock/types';
import type { ImportDataFromStorageMutationVariables } from '../src/features/Storage/api';

// Utils

const TEST = {

    handleModalEmptyState: ({ as, tag }: Pick<Params, 'as' | 'tag'>) =>
        test(`as ${ as }`, { tag }, async ({ page }) => {
            await interceptRequests(page, {
                getCurrentUser: as,
                listSpectrogramAnalysis: 'empty',
                listChannelConfigurations: 'empty',
                searchStorage: 'dataset',
                browseStorage: 'empty',
            })
            await test.step(`Navigate`, async () => {
                await page.datasetDetail.go({ as })
                await page.datasetDetail.importAnalysis.button.click()
                await expect(page.datasetDetail.importAnalysis.modal).toBeVisible()
            });

            await test.step('Display empty message', async () => {
                await expect(page.datasetDetail.importAnalysis.modal).toContainText(storageDataset.name)
                await expect(page.datasetDetail.importAnalysis.modal).toContainText('Empty')
            })
        }),

    modalDisplayLoadedData: ({ as, tag }: Pick<Params, 'as' | 'tag'>) =>
        test(`as ${ as }`, { tag }, async ({ page }) => {
            await interceptRequests(page, {
                getCurrentUser: as,
                searchStorage: 'dataset',
                browseStorage: 'dataset',
            })
            await test.step(`Navigate`, async () => {
                await page.datasetDetail.go({ as })
                await page.datasetDetail.importAnalysis.button.click()
                await expect(page.datasetDetail.importAnalysis.modal).toBeVisible()
            });

            await test.step('Import modal display data', async () => {
                await expect(page.datasetDetail.importAnalysis.modal).toContainText(storageDataset.name)
                await expect(page.datasetDetail.importAnalysis.modal).toContainText(storageAnalysis.name)
            })
        }),

    importAnalysis: ({ as, tag }: Pick<Params, 'as' | 'tag'>) =>
        test(`as ${ as }`, { tag }, async ({ page }) => {
            await interceptRequests(page, {
                getCurrentUser: as,
                searchStorage: 'dataset',
                browseStorage: 'dataset',
                importDataFromStorage: 'empty',
            })
            await test.step(`Navigate`, async () => {
                await page.datasetDetail.go({ as })
                await page.datasetDetail.importAnalysis.button.click()
                await expect(page.datasetDetail.importAnalysis.modal).toBeVisible()
            });

            const [ request ] = await Promise.all([
                page.waitForGqlRequest('importDataFromStorage'),
                await page.datasetDetail.importAnalysis.importButton.click(),
            ])
            const variables: ImportDataFromStorageMutationVariables = request.postDataJSON().variables
            expect(variables.path).toEqual(storageAnalysis.path)
        }),
}


// Tests
test.describe('/dataset/:datasetID', () => {
    test.describe('[Import modal]', () => {

        test.describe('Handle empty state', () => {
            TEST.handleModalEmptyState({ as: 'staff', tag: essentialTag })
            TEST.handleModalEmptyState({ as: 'superuser' })
        })

        test.describe('Display loaded data', () => {
            TEST.modalDisplayLoadedData({ as: 'staff', tag: essentialTag })
            TEST.modalDisplayLoadedData({ as: 'superuser' })
        })

        test.describe('Can import analysis', () => {
            TEST.importAnalysis({ as: 'staff', tag: essentialTag })
            TEST.importAnalysis({ as: 'superuser' })
        })
    })

})
