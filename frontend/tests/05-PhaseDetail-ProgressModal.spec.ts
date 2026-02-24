import { essentialTag, expect, test } from './utils';
import { interceptRequests } from './utils/mock';
import { USERS } from './utils/mock/types';
import { AnnotationPhaseType } from '../src/api/types.gql-generated';
import type { Params } from './utils/types';

// Utils

const TEST = {

    handleEmptyState: ({ as, phase, tag }: Pick<Params, 'as' | 'phase' | 'tag'>) =>
        test(`as ${ as } for "${ phase }" phase`, { tag }, async ({ page }) => {
            await interceptRequests(page, {
                getCurrentUser: as,
                getAnnotationPhase: `${ as === 'annotator' ? '' : 'manager' }${ phase }`,
                listFileRanges: 'empty',
                listSpectrogramAnalysis: 'empty',
                listAnnotationTask: 'empty',
            })
            await test.step(`Navigate`, async () => {
                await page.phaseDetail.go({ as, phase })
                await page.phaseDetail.progressModal.button.click()
            })

            await test.step('Display no progress', async () => {
                await expect(page.phaseDetail.progressModal.modal.getByText('No annotators')).toBeVisible();
                await expect(page.phaseDetail.progressModal.statusDownloadLink).not.toBeVisible()
                await expect(page.phaseDetail.progressModal.resultsDownloadLink).not.toBeVisible()
            })
        }),

    displayData: ({ as, phase, tag }: Pick<Params, 'as' | 'phase' | 'tag'>) =>
        test(`as ${ as } for "${ phase }" phase`, { tag }, async ({ page }) => {
            await interceptRequests(page, {
                getCurrentUser: as,
                getAnnotationPhase: `${ as === 'annotator' ? '' : 'manager' }${ phase }`,
            })
            await test.step(`Navigate`, async () => {
                await page.phaseDetail.go({ as, phase })
                await page.phaseDetail.progressModal.button.click()
            })

            await test.step('Display progress', async () => {
                await expect(page.phaseDetail.progressModal.modal.getByText(USERS.annotator.displayName)).toBeVisible();
                await expect(page.phaseDetail.progressModal.modal.getByText(USERS.creator.displayName)).not.toBeVisible();
            })
        }),


    cannotDownloadInfo: ({ as, phase, tag }: Pick<Params, 'as' | 'phase' | 'tag'>) =>
        test(`Cannot download as ${ as } for "${ phase }" phase`, { tag }, async ({ page }) => {
            await interceptRequests(page, {
                getCurrentUser: as,
                getAnnotationPhase: `${ as === 'annotator' ? '' : 'manager' }${ phase }`,
            })
            await test.step(`Navigate`, async () => {
                await page.phaseDetail.go({ as, phase })
                await page.phaseDetail.progressModal.button.click()
            })

            await test.step('Cannot download progress', async () => {
                await expect(page.phaseDetail.progressModal.statusDownloadLink).not.toBeVisible()
                await expect(page.phaseDetail.progressModal.resultsDownloadLink).not.toBeVisible()
            })

        }),
    canDownloadInfo: ({ as, phase, tag }: Pick<Params, 'as' | 'phase' | 'tag'>) =>
        test(`Can download as ${ as } for "${ phase }" phase`, { tag }, async ({ page }) => {
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

}

// Tests
test.describe('/annotation-campaign/:campaignID/phase/:phaseType', () => {
    test.describe('[Progress Modal]', () => {

        test.describe('Handle empty state', () => {
            TEST.handleEmptyState({ as: 'annotator', phase: AnnotationPhaseType.Annotation, tag: essentialTag })
            TEST.handleEmptyState({ as: 'annotator', phase: AnnotationPhaseType.Verification, tag: essentialTag })
            TEST.handleEmptyState({ as: 'creator', phase: AnnotationPhaseType.Annotation, tag: essentialTag })
            TEST.handleEmptyState({ as: 'staff', phase: AnnotationPhaseType.Annotation })
            TEST.handleEmptyState({ as: 'superuser', phase: AnnotationPhaseType.Annotation })
        })

        test.describe('Display loaded data', () => {
            TEST.displayData({ as: 'annotator', phase: AnnotationPhaseType.Annotation, tag: essentialTag })
            TEST.displayData({ as: 'annotator', phase: AnnotationPhaseType.Verification, tag: essentialTag })
        })

        test.describe('Handle info download', () => {
            TEST.cannotDownloadInfo({ as: 'annotator', phase: AnnotationPhaseType.Annotation, tag: essentialTag })
            TEST.canDownloadInfo({ as: 'creator', phase: AnnotationPhaseType.Annotation, tag: essentialTag })
            TEST.canDownloadInfo({ as: 'staff', phase: AnnotationPhaseType.Annotation })
            TEST.canDownloadInfo({ as: 'superuser', phase: AnnotationPhaseType.Annotation })
        })

    })
})
