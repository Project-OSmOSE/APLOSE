import { ESSENTIAL, expect, test } from './utils';
import { UserType } from './fixtures';
import { MOCK } from "./utils/services";

// Utils

const TEST = {
  empty: (as: UserType) => {
    return test('Should display empty state', async ({ page, interceptGQL }) => {
      interceptGQL(page, 'getDatasets', MOCK.getDatasets.empty)
      await page.dataset.go(as);
      await expect(page.locator('.table-content')).not.toBeVisible();
      await expect(page.getByText('No datasets')).toBeVisible();
    });
  },
  display: (as: UserType) => {
    return test('Should display loaded data', async ({ page, interceptGQL }) => {
      interceptGQL(page, 'getDatasets', MOCK.getDatasets.filled)
      await page.dataset.go(as);
      await expect(page.getByText('Test dataset')).toBeVisible();
    });
  },
}


// Tests

test.describe('Staff', ESSENTIAL, () => {
  TEST.empty('staff')
  TEST.display('staff')
})

test.describe('Superuser', ESSENTIAL, () => {
  TEST.empty('superuser')
  TEST.display('superuser')
})
