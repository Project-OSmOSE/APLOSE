import { essentialTag, expect, test } from './utils';
import { gqlRegex, interceptRequests } from './utils/mock';
import { campaign, spectrogram, TASKS, USERS } from './utils/mock/types';
import type { ListAnnotationTaskQueryVariables } from '../src/api/annotation-task';
import { AnnotationPhaseType } from '../src/api/types.gql-generated';
import type { Params } from './utils/types';
import type { Request } from 'playwright-core';

// Utils

const TEST = {

  handleEmptyState: ({ as, phase, tag }: Pick<Params, 'as' | 'phase' | 'tag'>) =>
    test(`Handle empty state as ${ as } for "${ phase }" phase`, { tag }, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: as,
        getAnnotationPhase: `${ as === 'annotator' ? '' : 'manager' }${ phase }`,
        listFileRanges: 'empty',
        listSpectrogramAnalysis: 'empty',
        listAnnotationTask: 'empty',
      })
      await test.step(`Navigate`, () => page.phaseDetail.go({ as, phase }))

      await test.step('Display no progress', async () => {
        await page.phaseDetail.progressModal.button.click()
        await expect(page.phaseDetail.progressModal.modal.getByText('No annotators')).toBeVisible();
        await expect(page.phaseDetail.progressModal.statusDownloadLink).not.toBeVisible()
        await expect(page.phaseDetail.progressModal.resultsDownloadLink).not.toBeVisible()
        await page.phaseDetail.progressModal.closeButton.click()
      })

      await test.step('Display no files', () =>
        expect(page.getByText('You have no files to annotate.')).toBeVisible())

      await test.step('Cannot resume', () =>
        expect(page.phaseDetail.resumeButton).not.toBeEnabled())
    }),

  displayData: ({ as, phase, tag }: Pick<Params, 'as' | 'phase' | 'tag'>) =>
    test(`Display data as ${ as } for "${ phase }" phase`, { tag }, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: as,
        getAnnotationPhase: `${ as === 'annotator' ? '' : 'manager' }${ phase }`,
      })
      await test.step(`Navigate`, () => page.phaseDetail.go({ as, phase }))

      await test.step('Display progress', async () => {
        await page.phaseDetail.progressModal.button.click()
        await expect(page.phaseDetail.progressModal.modal.getByText(USERS.annotator.displayName)).toBeVisible();
        await expect(page.phaseDetail.progressModal.modal.getByText(USERS.creator.displayName)).not.toBeVisible();
        await page.phaseDetail.progressModal.closeButton.click()
      })

      await test.step('Display files', async () =>
        expect(await page.getByText(spectrogram.filename, { exact: true }).count()).toEqual(2))
    }),

  canFilterFiles: ({ as, phase, tag }: Pick<Params, 'as' | 'phase' | 'tag'>) =>
    test(`Can filter files as ${ as } for "${ phase }" phase`, { tag }, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: as,
        getAnnotationPhase: `${ as === 'annotator' ? '' : 'manager' }${ phase }`,
      })
      await test.step(`Navigate`, () => page.phaseDetail.go({ as, phase }))

      const checkRequest = (request: Request) => {
        if (!new RegExp(gqlRegex).test(request.url())) return false;
        return request.postDataJSON().operationName === 'listAnnotationTask'
      }
      await page.waitForRequest(checkRequest)

      await test.step('Search file', async () => {
        const [ request ] = await Promise.all([
          page.waitForRequest(checkRequest),
          page.phaseDetail.searchFile(spectrogram.filename),
        ])
        const variables = request.postDataJSON().variables as ListAnnotationTaskQueryVariables
        expect(variables.search).toEqual(spectrogram.filename)
      })
    }),

  cannotUpdatePhase: ({ as, phase, tag }: Pick<Params, 'as' | 'phase' | 'tag'>) =>
    test(`Cannot update phase as ${ as } for "${ phase }" phase`, { tag }, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: as,
        getAnnotationPhase: `${ as === 'annotator' ? '' : 'manager' }${ phase }`,
      })
      await test.step(`Navigate`, () => page.phaseDetail.go({ as, phase }))

      await test.step('Cannot manage', () =>
        expect(page.phaseDetail.manageButton).not.toBeVisible())

    }),

  cannotDownloadInfo: ({ as, phase, tag }: Pick<Params, 'as' | 'phase' | 'tag'>) =>
    test(`Cannot download info as ${ as } for "${ phase }" phase`, { tag }, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: as,
        getAnnotationPhase: `${ as === 'annotator' ? '' : 'manager' }${ phase }`,
      })
      await test.step(`Navigate`, () => page.phaseDetail.go({ as, phase }))

      await test.step('Cannot download progress', async () => {
        await page.phaseDetail.progressModal.button.click()
        await expect(page.phaseDetail.progressModal.statusDownloadLink).not.toBeVisible()
        await expect(page.phaseDetail.progressModal.resultsDownloadLink).not.toBeVisible()
        await page.phaseDetail.progressModal.closeButton.click()
      })

    }),
  canDownloadInfo: ({ as, phase, tag }: Pick<Params, 'as' | 'phase' | 'tag'>) =>
    test(`Can download info as ${ as } for "${ phase }" phase`, { tag }, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: as,
        getAnnotationPhase: `${ as === 'annotator' ? '' : 'manager' }${ phase }`,
      })
      await test.step(`Navigate`, async () => {
        await page.phaseDetail.go({ as, phase })
        await page.phaseDetail.progressModal.button.click()
      })

      await test.step('Can download results', async () => {
        await expect(page.phaseDetail.progressModal.resultsDownloadLink).toBeEnabled()
      })

      await test.step('Can download status', async () => {
        await expect(page.phaseDetail.progressModal.statusDownloadLink).toBeEnabled()
      })

    }),

  // Annotation
  canAnnotateSubmittedFile: ({ as, phase, tag }: Pick<Params, 'as' | 'phase' | 'tag'>) =>
    test(`Can annotate submitted file as ${ as } for "${ phase }" phase`, { tag }, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: as,
        getAnnotationPhase: `${ as === 'annotator' ? '' : 'manager' }${ phase }`,
      })
      await test.step(`Navigate`, () => page.phaseDetail.go({ as, phase }))

      await test.step('Access annotation', async () => {
        await Promise.all([
          page.waitForURL(`**/annotation-campaign/${ campaign.id }/phase/${ AnnotationPhaseType.Annotation }/spectrogram/${ TASKS.submitted.id }`),
          page.getByTestId('access-button').last().click(),
        ])
      })
    }),
  canAnnotateUnsubmittedFile: ({ as, phase, tag }: Pick<Params, 'as' | 'phase' | 'tag'>) =>
    test(`Can annotate unsubmitted file as ${ as } for "${ phase }" phase`, { tag }, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: as,
        getAnnotationPhase: `${ as === 'annotator' ? '' : 'manager' }${ phase }`,
      })
      await test.step(`Navigate`, () => page.phaseDetail.go({ as, phase }))

      await test.step('Access annotation', async () => {
        await Promise.all([
          page.waitForURL(`**/annotation-campaign/${ campaign.id }/phase/${ AnnotationPhaseType.Annotation }/spectrogram/${ TASKS.unsubmitted.id }`),
          page.getByTestId('access-button').first().click(),
        ])
      })
    }),
  canResumeAnnotation: ({ as, phase, tag }: Pick<Params, 'as' | 'phase' | 'tag'>) =>
    test(`Can resume annotation as ${ as } for "${ phase }" phase`, { tag }, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: as,
        getAnnotationPhase: `${ as === 'annotator' ? '' : 'manager' }${ phase }`,
      })
      await test.step(`Navigate`, () => page.phaseDetail.go({ as, phase }))

      await test.step('Access annotation', async () => {
        await Promise.all([
          page.waitForURL(`**/annotation-campaign/${ campaign.id }/phase/${ phase }/spectrogram/${ TASKS.unsubmitted.id }`),
          page.phaseDetail.resumeButton.click(),
        ])
      })
    }),

  // Import annotation
  cannotImportAnnotation: ({ as, phase, tag }: Pick<Params, 'as' | 'phase' | 'tag'>) =>
    test(`Cannot import annotation as ${ as } for "${ phase }" phase`, { tag }, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: as,
        getAnnotationPhase: `${ as === 'annotator' ? '' : 'manager' }${ phase }`,
      })
      await test.step(`Navigate`, () => page.phaseDetail.go({ as, phase }))

      await test.step('Cannot import annotations', () =>
        expect(page.phaseDetail.importAnnotationsButton).not.toBeVisible())
    }),
  canImportAnnotation: ({ as, phase, tag }: Pick<Params, 'as' | 'phase' | 'tag'>) =>
    test(`Can import annotation as ${ as } for "${ phase }" phase`, { tag }, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: as,
        getAnnotationPhase: `${ as === 'annotator' ? '' : 'manager' }${ phase }`,
      })
      await test.step(`Navigate`, () => page.phaseDetail.go({ as, phase }))

      await test.step('Access import annotation', async () => {
        await Promise.all([
          page.waitForURL(`**/annotation-campaign/${ campaign.id }/phase/${ AnnotationPhaseType.Annotation }/import-annotations`),
          await page.phaseDetail.importAnnotationsButton.click(),
        ])
        await expect(page.phaseImport.title).toBeVisible()
      })
    }),

  // Manage annotators
  cannotManageAnnotators: ({ as, phase, tag }: Pick<Params, 'as' | 'phase' | 'tag'>) =>
    test(`Cannot manage annotators as ${ as } for "${ phase }" phase`, { tag }, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: as,
        getAnnotationPhase: `${ as === 'annotator' ? '' : 'manager' }${ phase }`,
      })
      await test.step(`Navigate`, () => page.phaseDetail.go({ as, phase }))

      await test.step('Cannot manage annotators', () =>
        expect(page.phaseDetail.manageButton).not.toBeVisible())
    }),
  canManageAnnotators: ({ as, phase, tag }: Pick<Params, 'as' | 'phase' | 'tag'>) =>
    test(`Can manage annotators as ${ as } for "${ phase }" phase`, { tag }, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: as,
        getAnnotationPhase: `${ as === 'annotator' ? '' : 'manager' }${ phase }`,
      })
      await test.step(`Navigate`, () => page.phaseDetail.go({ as, phase }))

      await test.step('Access manage annotators', async () => {
        await Promise.all([
          page.waitForURL(`**/annotation-campaign/${ campaign.id }/phase/${ phase }/edit-annotators`),
          await page.phaseDetail.manageButton.click(),
        ])
        await expect(page.phaseEdit.title).toBeVisible()
      })
    }),

}

// Tests
test.describe('[Phase detail]', () => {

  TEST.handleEmptyState({ as: 'annotator', phase: AnnotationPhaseType.Annotation, tag: essentialTag })
  TEST.handleEmptyState({ as: 'annotator', phase: AnnotationPhaseType.Verification, tag: essentialTag })
  TEST.handleEmptyState({ as: 'creator', phase: AnnotationPhaseType.Annotation, tag: essentialTag })
  TEST.handleEmptyState({ as: 'staff', phase: AnnotationPhaseType.Annotation })
  TEST.handleEmptyState({ as: 'superuser', phase: AnnotationPhaseType.Annotation })

  TEST.displayData({ as: 'annotator', phase: AnnotationPhaseType.Annotation, tag: essentialTag })
  TEST.displayData({ as: 'annotator', phase: AnnotationPhaseType.Verification, tag: essentialTag })

  TEST.canFilterFiles({ as: 'annotator', phase: AnnotationPhaseType.Annotation, tag: essentialTag })

  TEST.canAnnotateSubmittedFile({ as: 'annotator', phase: AnnotationPhaseType.Annotation, tag: essentialTag })
  TEST.canAnnotateUnsubmittedFile({ as: 'annotator', phase: AnnotationPhaseType.Annotation })
  TEST.canResumeAnnotation({ as: 'annotator', phase: AnnotationPhaseType.Annotation, tag: essentialTag })
  TEST.canResumeAnnotation({ as: 'annotator', phase: AnnotationPhaseType.Verification })

  TEST.cannotUpdatePhase({ as: 'annotator', phase: AnnotationPhaseType.Annotation, tag: essentialTag })

  TEST.cannotDownloadInfo({ as: 'annotator', phase: AnnotationPhaseType.Annotation, tag: essentialTag })
  TEST.canDownloadInfo({ as: 'creator', phase: AnnotationPhaseType.Annotation, tag: essentialTag })
  TEST.canDownloadInfo({ as: 'staff', phase: AnnotationPhaseType.Annotation })
  TEST.canDownloadInfo({ as: 'superuser', phase: AnnotationPhaseType.Annotation })

  TEST.cannotImportAnnotation({ as: 'annotator', phase: AnnotationPhaseType.Annotation, tag: essentialTag })
  TEST.cannotImportAnnotation({ as: 'annotator', phase: AnnotationPhaseType.Verification })
  TEST.canImportAnnotation({ as: 'creator', phase: AnnotationPhaseType.Annotation, tag: essentialTag })
  TEST.cannotImportAnnotation({ as: 'creator', phase: AnnotationPhaseType.Verification, tag: essentialTag })
  TEST.canImportAnnotation({ as: 'staff', phase: AnnotationPhaseType.Annotation })
  TEST.cannotImportAnnotation({ as: 'staff', phase: AnnotationPhaseType.Verification })
  TEST.canImportAnnotation({ as: 'superuser', phase: AnnotationPhaseType.Annotation })
  TEST.cannotImportAnnotation({ as: 'superuser', phase: AnnotationPhaseType.Verification })

  TEST.cannotManageAnnotators({ as: 'annotator', phase: AnnotationPhaseType.Annotation, tag: essentialTag })
  TEST.cannotManageAnnotators({ as: 'annotator', phase: AnnotationPhaseType.Verification, tag: essentialTag })
  TEST.canManageAnnotators({ as: 'creator', phase: AnnotationPhaseType.Annotation, tag: essentialTag })
  TEST.canManageAnnotators({ as: 'creator', phase: AnnotationPhaseType.Verification, tag: essentialTag })
  TEST.canManageAnnotators({ as: 'staff', phase: AnnotationPhaseType.Annotation })
  TEST.canManageAnnotators({ as: 'superuser', phase: AnnotationPhaseType.Annotation })

})
