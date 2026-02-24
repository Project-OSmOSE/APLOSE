import { essentialTag, expect, test } from './utils';
import { interceptRequests } from './utils/mock';
import { spectrogramAnalysis } from './utils/mock/types';
import type { Params } from './utils/types';

// Utils

const TEST = {

    // Page

    handlePageEmptyState: ({ as, tag }: Pick<Params, 'as' | 'tag'>) =>
        test(`as ${ as }`, { tag }, async ({ page }) => {
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
        test(`as ${ as }`, { tag }, async ({ page }) => {
            await interceptRequests(page, { getCurrentUser: as })
            await test.step(`Navigate`, () => page.datasetDetail.go({ as }));

            await test.step('Display dataset', () =>
                expect(page.getByText(spectrogramAnalysis.name)).toBeVisible())
        }),

}


// Tests
test.describe('/dataset/:datasetID', () => {

    test.describe('Handle empty state', () => {
        TEST.handlePageEmptyState({ as: 'staff', tag: essentialTag })
        TEST.handlePageEmptyState({ as: 'superuser' })
    })

    test.describe('Display loaded data', () => {
        TEST.pageDisplayLoadedData({ as: 'staff', tag: essentialTag })
        TEST.pageDisplayLoadedData({ as: 'superuser' })
    })

})
