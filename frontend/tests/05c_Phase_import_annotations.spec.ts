import { ESSENTIAL, expect, test } from './utils';
import { DETECTOR_CONFIGURATION } from './fixtures';
import { interceptRequests } from './utils/mock';
import { REST_MOCK } from './utils/mock/_rest';


test.describe('Campaign creator', () => {
  test('[Check] Can import all', ESSENTIAL, async ({ page }) => {
    await interceptRequests(page, {
      getCurrentUser: 'creator',
      getAnnotationPhase: 'manager',
      listDetectors: 'empty',
    })
    await page.phaseImport.go('creator');
    await expect(page.getByRole('heading', { name: 'Import annotations' })).toBeVisible()

    await page.phaseImport.fillAnnotationCheck();

    await expect(page.phaseImport.importButton).toBeEnabled({ timeout: 500 })
    const [
      submitResultsRequest,
    ] = await Promise.all([
      page.waitForRequest(new RegExp(REST_MOCK.importAnnotations.url)),
      page.phaseImport.importButton.click(),
    ])

    const expectedLines = submitResultsRequest.postDataJSON().data.replaceAll('"', '').split('\n');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const fileLines = page.phaseImport.fileData.replaceAll('\r', '').split('\n')
    expect(expectedLines.length).toEqual(fileLines.length)
  });

  test('[Check] Can import only first Detector', ESSENTIAL, async ({ page }) => {
    await interceptRequests(page, {
      getCurrentUser: 'creator',
      getAnnotationPhase: 'manager',
      listDetectors: 'empty',
    })
    await page.phaseImport.go('creator');
    await page.phaseImport.fillAnnotationCheck({ onlyFirstDetector: true });

    await expect(page.getByText('detector1', { exact: true })).toBeVisible();
    await expect(page.getByText('detector2', { exact: true })).not.toBeVisible();
    await expect(page.getByText('detector3', { exact: true })).not.toBeVisible();
  });

  test('[Check] Can handle existing detector', ESSENTIAL, async ({ page }) => {
    await interceptRequests(page, {
      getCurrentUser: 'creator',
      getAnnotationPhase: 'manager',
      listDetectors: 'filled',
    })
    await page.phaseImport.go('creator');
    await page.phaseImport.importFile();

    await test.step('Select Detectors', async () => {
      await expect(page.getByText('detector1Already in database').first()).toBeVisible()
    })

    await test.step('Select Detectors configurations', async () => {
      await page.getByText('Select configuration').first().click()
      await expect(page.getByText(DETECTOR_CONFIGURATION).and(page.locator('div'))).toBeVisible()
    })
  });

  test('[Check] Can reset import', async ({ page }) => {
    await interceptRequests(page, {
      getCurrentUser: 'creator',
      getAnnotationPhase: 'manager',
      listDetectors: 'empty',
    })
    await page.phaseImport.go('creator')
    await page.phaseImport.fillAnnotationCheck()

    await test.step('Reset file', async () => {
      await page.phaseImport.resetFileButton.click()
    })

    await expect(page.getByText('Import annotations (csv)')).toBeVisible();
  });
});
