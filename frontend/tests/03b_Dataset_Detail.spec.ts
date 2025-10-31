import { ESSENTIAL, expect, test } from './utils';
import { UserType } from './fixtures';
import { interceptRequests } from './utils/mock';
import { spectrogramAnalysis } from './utils/mock/types';
import type { ImportSpectrogramAnalysisMutationVariables } from '../src/api/spectrogram-analysis';

// Utils

const TEST = {
  empty: (as: UserType) => {
    return test('Should display empty state', async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: as,
        listSpectrogramAnalysis: 'empty',
        listChannelConfigurations: 'empty',
        listAvailableSpectrogramAnalysisForImport: 'empty',
      })
      await page.dataset.detail.go(as);
      await expect(page.locator('.table-content')).not.toBeVisible();
      await expect(page.getByText('No spectrogram analysis')).toBeVisible();

      const modal = await page.dataset.detail.openImportModal()
      await expect(modal.locator).toContainText('There is no new analysis')
    });
  },
  display: (as: UserType) => {
    return test('Should display loaded data', async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: as,
      })
      await page.dataset.detail.go(as);
      await expect(page.getByText(spectrogramAnalysis.name)).toBeVisible();

      const modal = await page.dataset.detail.openImportModal()
      await expect(modal.locator).toContainText('Test analysis 1')
      await expect(modal.locator).toContainText('Test analysis 2')
      await modal.search('1')
      await expect(modal.locator).toContainText('Test analysis 1')
      await expect(modal.locator).not.toContainText('Test analysis 2')
    });
  },
  manageAnalysisImport: (as: UserType) => {
    return test('Should manage import of an analysis', async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: as,
        importSpectrogramAnalysis: 'empty',
      })
      await page.dataset.detail.go(as);
      await expect(page.getByText(spectrogramAnalysis.name)).toBeVisible();

      const modal = await page.dataset.detail.openImportModal()

      const [ request ] = await Promise.all([
        page.waitForRequest('**/graphql'),
        await modal.importAnalysis(),
      ])
      const variables: ImportSpectrogramAnalysisMutationVariables = request.postDataJSON().variables
      expect(variables.name).toEqual('Test analysis 1')
    })
  },
}


// Tests

test.describe('Staff', ESSENTIAL, () => {
  TEST.empty('staff')
  TEST.display('staff')
  TEST.manageAnalysisImport('staff')
})

test.describe('Superuser', ESSENTIAL, () => {
  TEST.empty('superuser')
  TEST.display('superuser')
  TEST.manageAnalysisImport('superuser')
})
