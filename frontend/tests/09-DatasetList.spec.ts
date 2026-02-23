import { essentialTag, expect, test } from './utils';
import { interceptRequests } from './utils/mock';
import { dataset } from './utils/mock/types';
import type { Params } from './utils/types';

// Utils

const TEST = {

  // Page

  handlePageEmptyState: ({ as, tag }: Pick<Params, 'as' | 'tag'>) =>
    test(`Handle empty state as ${ as }`, { tag }, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: as,
        listDatasets: 'empty',
      })
      await test.step(`Navigate`, () => page.datasets.go({ as }));

      await test.step('Display empty message', () =>
        expect(page.getByText('No datasets')).toBeVisible())
    }),

  pageDisplayLoadedData: ({ as, tag }: Pick<Params, 'as' | 'tag'>) =>
    test(`Display loaded data as ${ as }`, { tag }, async ({ page }) => {
      await interceptRequests(page, { getCurrentUser: as })
      await test.step(`Navigate`, () => page.datasets.go({ as }));

      await test.step('Display dataset', () =>
        expect(page.getByText(dataset.name)).toBeVisible())
    }),

}


// Tests
test.describe('/dataset', () => {

  TEST.handlePageEmptyState({ as: 'staff', tag: essentialTag })
  TEST.handlePageEmptyState({ as: 'superuser' })

  TEST.pageDisplayLoadedData({ as: 'staff', tag: essentialTag })
  TEST.pageDisplayLoadedData({ as: 'superuser' })

})

