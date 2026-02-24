import { essentialTag, expect, test } from './utils';
import { gqlURL, interceptRequests } from './utils/mock';
import { storageAnalysis, storageDataset, storageFolder } from './utils/mock/types';
import type { Params } from './utils/types';
import type {
    ImportAnalysisFromStorageMutationVariables,
    ImportDatasetFromStorageMutationVariables,
} from '../src/api/storage/storage.generated';

// Utils

const TEST = {

    handlePageEmptyState: ({ as, tag }: Pick<Params, 'as' | 'tag'>) =>
        test(`as ${ as }`, { tag }, async ({ page }) => {
            await interceptRequests(page, {
                getCurrentUser: as,
                listDatasets: 'empty',
                browseStorage: 'empty',

            })
            await test.step(`Navigate`, async () => {
                await page.storage.go({ as })
                await page.storage.searchStorage.button.click()
                await expect(page.storage.searchStorage.modal).toBeVisible()
            });

            await test.step('Display empty message', () =>
                expect(page.storage.searchStorage.modal.getByText('You can search for the exact path of:')).toBeVisible())
        }),

    searchFolder: ({ as, tag }: Pick<Params, 'as' | 'tag'>) =>
        test(`as ${ as }`, { tag }, async ({ page }) => {
            await interceptRequests(page, {
                getCurrentUser: as,
                searchStorage: 'folder',
                browseStorage: 'folder',
                importDatasetFromStorage: 'empty',
            })
            await test.step(`Navigate`, async () => {
                await page.storage.go({ as })
                await page.storage.searchStorage.button.click()
                await expect(page.storage.searchStorage.modal).toBeVisible()
            });

            await test.step('Browse', async () => {
                const modal = page.storage.searchStorage.modal;
                await page.storage.searchStorage.search(storageFolder.path)
                await expect(modal.getByText(storageFolder.name)).toBeVisible()
                await expect(modal.getByText(storageDataset.name)).toBeVisible()

                const [ request ] = await Promise.all([
                    page.waitForRequest(gqlURL),
                    modal.getByRole('button', { name: 'Import' }).click(),
                ])
                const variables: ImportDatasetFromStorageMutationVariables = request.postDataJSON().variables
                expect(variables.path).toEqual(storageDataset.path)
            })
        }),

    searchDataset: ({ as, tag }: Pick<Params, 'as' | 'tag'>) =>
        test(`as ${ as }`, { tag }, async ({ page }) => {
            await interceptRequests(page, {
                getCurrentUser: as,
                searchStorage: 'dataset',
                browseStorage: 'dataset',
                importDatasetFromStorage: 'empty',
            })
            await test.step(`Navigate`, async () => {
                await page.storage.go({ as })
                await page.storage.searchStorage.button.click()
                await expect(page.storage.searchStorage.modal).toBeVisible()
            });

            await test.step('Browse', async () => {
                const modal = page.storage.searchStorage.modal;
                await page.storage.searchStorage.search(storageDataset.path)
                await expect(modal.getByText(storageDataset.name)).toBeVisible()
                await expect(modal.getByText(storageAnalysis.name)).toBeVisible()

                const [ request ] = await Promise.all([
                    page.waitForRequest(gqlURL),
                    modal.getByRole('button', { name: 'Import' }).last().click(),
                ])
                const variables: ImportAnalysisFromStorageMutationVariables = request.postDataJSON().variables
                expect(variables.name).toEqual(storageAnalysis.name)
                expect(variables.datasetPath).toEqual(storageDataset.path)
            })
        }),

}


// Tests
test.describe('/storage', () => {

    test.describe('Search modal', () => {

        test.describe('Handle empty state', () => {
            TEST.handlePageEmptyState({ as: 'staff', tag: essentialTag })
            TEST.handlePageEmptyState({ as: 'superuser' })
        })

        test.describe('Can search folder', () => {
            TEST.searchFolder({ as: 'staff', tag: essentialTag })
            TEST.searchFolder({ as: 'superuser' })
        })

        test.describe('Can search dataset', () => {
            TEST.searchDataset({ as: 'staff', tag: essentialTag })
            TEST.searchDataset({ as: 'superuser' })
        })

    })
})
