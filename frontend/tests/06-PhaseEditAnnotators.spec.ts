import { essentialTag, expect, test } from './utils';
import { gqlURL, interceptRequests } from './utils/mock';
import { campaign, dataset, fileRange, userGroup, USERS, type UserType } from './utils/mock/types';
import { AnnotationPhaseType } from '../src/api/types.gql-generated';
import { type UpdateFileRangesMutationVariables } from '../src/api/annotation-file-range';
import type { Params } from './utils/types';

// Utils

const TEST = {

    handleEmptyState: ({ as, phase, tag }: Pick<Params, 'as' | 'phase' | 'tag'>) =>
        test(`as ${ as } for "${ phase }" phase`, { tag }, async ({ page }) => {
            await interceptRequests(page, {
                getCurrentUser: as,
                getAnnotationPhase: `${ as === 'annotator' ? '' : 'manager' }${ phase }`,
                listSpectrogramAnalysis: 'empty',
                listFileRanges: 'empty',
                listAnnotationTask: 'empty',
                listUsers: 'empty',
            })
            await test.step(`Navigate`, () => page.phaseEdit.go({ as, phase }))

            await test.step(`Display empty message`, () =>
                expect(page.getByText('No annotators')).toBeVisible())
        }),

    displayData: ({ as, phase, tag }: Pick<Params, 'as' | 'phase' | 'tag'>) =>
        test(`as ${ as } for "${ phase }" phase`, { tag }, async ({ page }) => {
            await interceptRequests(page, {
                getCurrentUser: as,
                getAnnotationPhase: `${ as === 'annotator' ? '' : 'manager' }${ phase }`,
            })
            await test.step(`Navigate`, () => page.phaseEdit.go({ as, phase }))

            await test.step('Display existing ranges', async () => {
                await expect(page.getByText(USERS.annotator.displayName)).toBeVisible()
                await expect(page.phaseEdit.getfirstIndexInput(fileRange)).toHaveValue((fileRange.firstFileIndex + 1).toString())
                await expect(page.phaseEdit.getlastIndexInput(fileRange)).toHaveValue((fileRange.lastFileIndex + 1).toString())
                await expect(page.getByText(USERS.creator.displayName)).not.toBeVisible()
                await expect(page.getByText(USERS.staff.displayName)).not.toBeVisible()
                await expect(page.getByText(USERS.superuser.displayName)).not.toBeVisible()
            })
        }),

    addAnnotator: ({ as, phase, tag }: Pick<Params, 'as' | 'phase' | 'tag'>) =>
        test(`Add annotator as ${ as } for "${ phase }" phase`, { tag }, async ({ page }) => {
            await interceptRequests(page, {
                getCurrentUser: as,
                getAnnotationPhase: `${ as === 'annotator' ? '' : 'manager' }${ phase }`,
            })
            await test.step(`Navigate`, () => page.phaseEdit.go({ as, phase }))

            await test.step('Add new annotator', async () => {
                await page.getByPlaceholder('Search annotator').locator('input').fill(USERS.superuser.firstName);
                await page.locator('#searchbar-results').getByText(USERS.superuser.firstName).click();
                await expect(page.getByText(USERS.superuser.displayName)).toBeVisible()
                await expect(page.phaseEdit.getfirstIndexInput({ id: '-1' })).toBeVisible()
                await expect(page.phaseEdit.getlastIndexInput({ id: '-1' })).toBeVisible()
            })

            await test.step('Edit new annotator range', async () => {
                await page.phaseEdit.getfirstIndexInput({ id: '-1' }).fill('5')
                await page.phaseEdit.getlastIndexInput({ id: '-1' }).fill('15')
                const button = page.locator('.table-content button').last()
                await expect(button).toBeEnabled()
            })

            await test.step('Can add known annotator with some files', async () => {
                await page.getByPlaceholder('Search annotator').locator('input').fill(USERS.superuser.firstName);
                await page.locator('#searchbar-results').getByText(USERS.superuser.firstName).click()
                expect(await page.locator('.table-aplose').getByText(USERS.superuser.firstName).count()).toEqual(2)
            })

            await test.step('Cannot add known annotator with all files', async () => {
                await page.getByPlaceholder('Search annotator').locator('input').fill(USERS.superuser.firstName);
                await expect(page.locator('#searchbar-results').getByText(USERS.superuser.firstName)).not.toBeVisible();
            })

            await test.step('Add annotator group', async () => {
                await page.getByPlaceholder('Search annotator').locator('input').fill(userGroup.name);
                await page.locator('#searchbar-results').getByText(userGroup.name).click();
                await expect(page.getByText(USERS.staff.displayName)).toBeVisible()
                await expect(page.phaseEdit.getfirstIndexInput({ id: '-3' })).toBeVisible()
                await expect(page.phaseEdit.getlastIndexInput({ id: '-3' })).toBeVisible()
            })

            await test.step('Can submit', async () => {
                const [ request ] = await Promise.all([
                    page.waitForRequest(gqlURL),
                    page.getByRole('button', { name: 'Update annotators' }).click(),
                ])
                const variables: UpdateFileRangesMutationVariables = await request.postDataJSON().variables
                expect(variables.campaignID).toEqual(campaign.id)
                expect(variables.phaseType).toEqual(AnnotationPhaseType.Annotation)
                const expectedRanges: UpdateFileRangesMutationVariables['fileRanges'] = [
                    {
                        id: fileRange.id,
                        annotatorId: USERS.annotator.id,
                        firstFileIndex: fileRange.firstFileIndex,
                        lastFileIndex: fileRange.lastFileIndex,
                    }, {
                        annotatorId: USERS.superuser.id,
                        firstFileIndex: 4,
                        lastFileIndex: 14,
                    }, {
                        annotatorId: USERS.superuser.id,
                        firstFileIndex: 0,
                        lastFileIndex: dataset.spectrogramCount - 1,
                    }, {
                        annotatorId: USERS.staff.id,
                        firstFileIndex: 0,
                        lastFileIndex: dataset.spectrogramCount - 1,
                    },
                ]
                expect(variables.fileRanges).toEqual(expectedRanges)
            })
        }),

    editExistingAnnotator: ({ as, phase, tag }: Pick<Params, 'as' | 'phase' | 'tag'>) =>
        test(`Edit existing annotator as ${ as } for "${ phase }" phase`, { tag }, async ({ page }) => {
            await interceptRequests(page, {
                getCurrentUser: as,
                getAnnotationPhase: `${ as === 'annotator' ? '' : 'manager' }${ phase }`,
            })
            await test.step(`Navigate`, () => page.phaseEdit.go({ as, phase }))

            await test.step('Cannot edit or remove annotator with finished tasks', async () => {
                await expect(page.phaseEdit.getfirstIndexInput(fileRange)).toBeDisabled()
                await expect(page.phaseEdit.getlastIndexInput(fileRange)).toBeDisabled()
            })

            await test.step('Unlock range with finished tasks', async () => {
                await page.phaseEdit.getUnlockButton(fileRange).click()
                await page.getByRole('dialog').first().getByRole('button', { name: 'Update file range' }).click()

                await expect(page.phaseEdit.getfirstIndexInput(fileRange)).toBeEnabled()
                await expect(page.phaseEdit.getlastIndexInput(fileRange)).toBeEnabled()
            })

            await test.step('Remove range with finished tasks', async () => {
                await page.phaseEdit.getRemoveButton(fileRange).click()
            })

            await test.step('Can submit', async () => {
                const [ request ] = await Promise.all([
                    page.waitForRequest(gqlURL),
                    page.getByRole('button', { name: 'Update annotators' }).click(),
                ])
                const variables: UpdateFileRangesMutationVariables = await request.postDataJSON().variables
                expect(variables.campaignID).toEqual(campaign.id)
                expect(variables.phaseType).toEqual(AnnotationPhaseType.Annotation)
                expect(variables.fileRanges).toEqual([])
            })
        }),

}

// Tests

test.describe('/annotation-campaign/:campaignID/phase/:phaseType/edit-annotators', () => {
    const as: UserType = 'creator';

    test.describe('Handle empty state', () => {
        TEST.handleEmptyState({ as, phase: AnnotationPhaseType.Annotation, tag: essentialTag })
        TEST.handleEmptyState({ as, phase: AnnotationPhaseType.Verification })
    })

    test.describe('Display loaded data', () => {
        TEST.displayData({ as, phase: AnnotationPhaseType.Annotation, tag: essentialTag })
        TEST.displayData({ as, phase: AnnotationPhaseType.Verification })
    })

    TEST.addAnnotator({ as, phase: AnnotationPhaseType.Annotation, tag: essentialTag })

    TEST.editExistingAnnotator({ as, phase: AnnotationPhaseType.Annotation, tag: essentialTag })

})
