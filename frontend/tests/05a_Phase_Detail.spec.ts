import { ESSENTIAL, expect, Page, test } from './utils';
import { gqlURL, interceptRequests } from './utils/mock';
import { campaign, phase, spectrogram, TASKS, USERS } from './utils/mock/types';
import type { ListAnnotationTaskQueryVariables } from '../src/api/annotation-task';
import { AnnotationPhaseType } from '../src/api/types.gql-generated';
import { DOWNLOAD_ANNOTATIONS, DOWNLOAD_PROGRESS } from '../src/consts/links';

// Utils

const STEP = {
  accessImportAnnotations: (page: Page) => {
    return test.step('Can import annotations', async () => {
      await expect(page.campaign.detail.importAnnotationsButton).toBeEnabled();
    })
  },
  accessDownloadCSV: async (page: Page) => {
    await test.step('Access progress downloads and update', async () => {
      const modal = await page.campaign.detail.openProgressModal();
      await expect(modal.downloadResultsButton).toBeEnabled();
      await expect(modal.downloadStatusButton).toBeEnabled();
      await modal.close()
    })
  },
  accessManageAnnotators: (page: Page) => test.step('Access manage annotators', async () => {
    await expect(page.campaign.detail.manageButton).toBeEnabled();
    const modal = await page.campaign.detail.openProgressModal();
    await modal.close()
  }),
}

// Tests

test.describe('Annotator', () => {
  test('Progress', async ({ page }) => {
    await interceptRequests(page, {
      getCurrentUser: 'annotator',
    })
    await page.campaign.detail.go('annotator');

    await test.step('Cannot manage', async () => {
      await expect(page.campaign.detail.manageButton).not.toBeVisible()
    })

    const modal = await page.campaign.detail.openProgressModal();
    await expect(modal.getByText(USERS.annotator.displayName)).toBeVisible();
    await expect(modal.getByText(USERS.creator.displayName)).not.toBeVisible();

    await test.step('Cannot download', async () => {
      await expect(modal.downloadStatusButton).not.toBeVisible()
      await expect(modal.downloadStatusButton).not.toBeVisible()
    })
  })

  test('Files', ESSENTIAL, async ({ page }) => {
    await interceptRequests(page, {
      getCurrentUser: 'annotator',
    })
    await page.campaign.detail.go('annotator');
    await test.step('See files', async () => {
      await expect(page.locator('.table-content').first()).toBeVisible();
    })
    await test.step('Can search file', async () => {
      await page.mock.fileRangesFiles()
      const [ request ] = await Promise.all([
        page.waitForRequest(gqlURL),
        page.campaign.detail.searchFile(spectrogram.filename),
      ])
      const variables = request.postDataJSON().variables as ListAnnotationTaskQueryVariables
      expect(variables.search).toEqual(spectrogram.filename)
      const params = new URLSearchParams('?' + page.url().split('?')[1])
      expect(params.get('search')).toEqual(spectrogram.filename)
      await page.campaign.detail.searchFile(undefined);
    })
  })

  test('Can annotate submitted file', ESSENTIAL, async ({ page }) => {
    await interceptRequests(page, {
      getCurrentUser: 'annotator',
    })
    await page.campaign.detail.go('annotator');
    await page.mock.annotator()
    const button = page.getByTestId('access-button').last()
    await button.waitFor()
    await Promise.all([
      page.waitForURL(`**/annotation-campaign/${ campaign.id }/phase/${ AnnotationPhaseType.Annotation }/spectrogram/${ TASKS.submitted.id }`),
      button.click(),
    ])
  })

  test('Can annotate unsubmitted file', ESSENTIAL, async ({ page }) => {
    await interceptRequests(page, {
      getCurrentUser: 'annotator',
    })
    await page.campaign.detail.go('annotator');
    await page.mock.annotator()
    const button = page.getByTestId('access-button').first()
    await button.waitFor()
    await Promise.all([
      page.waitForURL(`**/annotation-campaign/${ campaign.id }/phase/${ AnnotationPhaseType.Annotation }/spectrogram/${ TASKS.unsubmitted.id }`),
      button.click(),
    ])
  })

  test('Can resume annotation', ESSENTIAL, async ({ page }) => {
    await interceptRequests(page, {
      getCurrentUser: 'annotator',
    })
    await page.campaign.detail.go('annotator');
    await page.mock.annotator()
    await Promise.all([
      page.waitForURL(`**/annotation-campaign/${ campaign.id }/phase/${ AnnotationPhaseType.Annotation }/spectrogram/${ spectrogram.id }`),
      page.campaign.detail.resumeButton.click(),
    ])
  })

  test('Empty', ESSENTIAL, async ({ page }) => {
    await interceptRequests(page, {
      getCurrentUser: 'annotator',
      listFileRanges: 'empty',
      listAnnotationTask: 'empty',
    })
    await page.campaign.detail.go('annotator');

    await test.step('Progress', async () => {
      const modal = await page.campaign.detail.openProgressModal({ empty: true });
      await expect(modal.getByText('No annotators')).toBeVisible();
      await modal.close()
    })

    await test.step('Files', async () => {
      await expect(page.getByText('You have no files to annotate.')).toBeVisible();
      await expect(page.campaign.detail.resumeButton).not.toBeEnabled();
    })
  })
})

test.describe('Campaign creator', () => {

  test('Can import annotations', async ({ page }) => {
    await interceptRequests(page, {
      getCurrentUser: 'creator',
      getAnnotationPhase: 'manager',
    })
    await page.campaign.detail.go('creator');
    await STEP.accessImportAnnotations(page)
  })

  test('Can download progress results', async ({ page }) => {
    await interceptRequests(page, {
      getCurrentUser: 'creator',
      getAnnotationPhase: 'manager',
    })
    await page.campaign.detail.go('creator');
    const modal = await page.campaign.detail.openProgressModal()

    await test.step('Results', () => Promise.all([
      page.waitForRequest('**' + DOWNLOAD_ANNOTATIONS(phase.id)),
      modal.downloadResultsButton.click(),
    ]))
  })

  test('Can download progress status', async ({ page }) => {
    await interceptRequests(page, {
      getCurrentUser: 'creator',
      getAnnotationPhase: 'manager',
    })
    await page.campaign.detail.go('creator');
    const modal = await page.campaign.detail.openProgressModal()

    await test.step('Status', () => Promise.all([
      page.waitForRequest('**' + DOWNLOAD_PROGRESS(phase.id)),
      modal.downloadStatusButton.click(),
    ]))
  })

  test('Can manage annotators', async ({ page }) => {
    await interceptRequests(page, {
      getCurrentUser: 'creator',
      getAnnotationPhase: 'manager',
    })
    await page.campaign.detail.go('creator');
    await Promise.all([
      page.waitForURL(`**/annotation-campaign/${ campaign.id }/phase/${ AnnotationPhaseType.Annotation }/edit-annotators`),
      page.campaign.detail.manageButton.click(),
    ])
  })

  test('Empty', async ({ page }) => {
    await interceptRequests(page, {
      getCurrentUser: 'creator',
      getAnnotationPhase: 'manager',
      listFileRanges: 'empty',
      listSpectrogramAnalysis: 'empty',
      listAnnotationTask: 'empty',
    })
    await page.campaign.detail.go('creator');

    await test.step('Progress', async () => {
      await expect(page.campaign.detail.manageButton).toBeVisible();
      const modal = await page.campaign.detail.openProgressModal({ empty: true });
      await expect(modal.downloadStatusButton).not.toBeVisible();
      await expect(modal.downloadStatusButton).not.toBeVisible();
      await modal.close()
    })
  })

})

test('Staff', async ({ page }) => {
  await interceptRequests(page, {
    getCurrentUser: 'staff',
    getAnnotationPhase: 'manager',
  })
  await page.campaign.detail.go('staff');

  await STEP.accessImportAnnotations(page)
  await STEP.accessDownloadCSV(page)
  await STEP.accessManageAnnotators(page)
})

test('Superuser', ESSENTIAL, async ({ page }) => {
  await interceptRequests(page, {
    getCurrentUser: 'superuser',
    getAnnotationPhase: 'manager',
  })
  await page.campaign.detail.go('superuser');

  await STEP.accessImportAnnotations(page)
  await STEP.accessDownloadCSV(page)
  await STEP.accessManageAnnotators(page)
})
