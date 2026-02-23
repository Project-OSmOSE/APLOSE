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
        test(`Handle empty state as ${ as }`, { tag }, async ({ page }) => {
            await interceptRequests(page, {
                getCurrentUser: as,
                listDatasets: 'empty',
                browseStorage: 'empty',
            })
            await test.step(`Navigate`, () => page.storage.go({ as }));

            await test.step('Display empty message', () =>
                expect(page.getByText('Empty')).toBeVisible())
        }),

    canBrowseData: ({ as, tag }: Pick<Params, 'as' | 'tag'>) =>
        test(`Can browse data as ${ as }`, { tag }, async ({ page }) => {
            await interceptRequests(page, {
                getCurrentUser: as,
                browseStorage: 'root'
            })
            await test.step(`Navigate`, () => page.storage.go({ as }));

            await test.step('Browse', async () => {
                await expect(page.getByText(storageFolder.name)).toBeVisible()

                await interceptRequests(page, { getCurrentUser: as, browseStorage: 'folder'})
                await page.getByText(storageFolder.name).click()
                await expect(page.getByText(storageDataset.name)).toBeVisible()

                await interceptRequests(page, { getCurrentUser: as, browseStorage: 'dataset'})
                await page.getByText(storageDataset.name).click()
                await expect(page.getByText(storageAnalysis.name)).toBeVisible()
            })
        }),

    canImportDataset: ({ as, tag }: Pick<Params, 'as' | 'tag'>) =>
        test(`Can import dataset as ${ as }`, { tag }, async ({ page }) => {
            await interceptRequests(page, {
                getCurrentUser: as,
                browseStorage: 'root',
                importDatasetFromStorage: 'empty'
            })
            await test.step(`Navigate`, () => page.storage.go({ as }));

            await test.step('Browse', async () => {
                await interceptRequests(page, { getCurrentUser: as, browseStorage: 'folder'})
                await page.getByText(storageFolder.name).click()


                await expect(page.getByText(storageDataset.name)).toBeVisible()
                const [ request ] = await Promise.all([
                    page.waitForRequest(gqlURL),
                    page.getByRole('button', { name: 'Import' }).click()
                ])
                const variables: ImportDatasetFromStorageMutationVariables = request.postDataJSON().variables
                expect(variables.path).toEqual(storageDataset.path)
            })
        }),


    canImportAnalysis: ({ as, tag }: Pick<Params, 'as' | 'tag'>) =>
        test(`Can import analysis as ${ as }`, { tag }, async ({ page }) => {
            await interceptRequests(page, {
                getCurrentUser: as,
                browseStorage: 'root',
                importAnalysisFromStorage: 'empty'
            })
            await test.step(`Navigate`, () => page.storage.go({ as }));

            await test.step('Browse', async () => {
                await interceptRequests(page, { getCurrentUser: as, browseStorage: 'folder'})
                await page.getByText(storageFolder.name).click()
                await interceptRequests(page, { getCurrentUser: as, browseStorage: 'dataset'})
                await page.getByText(storageDataset.name).click()

                await expect(page.getByText(storageAnalysis.name)).toBeVisible()
                const [ request ] = await Promise.all([
                    page.waitForRequest(gqlURL),
                    page.getByRole('button', { name: 'Import' }).last().click()
                ])
                const variables: ImportAnalysisFromStorageMutationVariables = request.postDataJSON().variables
                expect(variables.name).toEqual(storageAnalysis.name)
                expect(variables.datasetPath).toEqual(storageDataset.path)
            })
        }),

}


// Tests
test.describe('/storage', () => {

    TEST.handlePageEmptyState({ as: 'staff', tag: essentialTag })
    TEST.handlePageEmptyState({ as: 'superuser' })

    TEST.canBrowseData({ as: 'staff', tag: essentialTag })
    TEST.canBrowseData({ as: 'superuser' })

    TEST.canImportDataset({ as: 'staff', tag: essentialTag })
    TEST.canImportDataset({ as: 'superuser' })

    TEST.canImportAnalysis({ as: 'staff', tag: essentialTag })
    TEST.canImportAnalysis({ as: 'superuser' })

})
