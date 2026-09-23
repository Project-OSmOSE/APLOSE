import { essentialTag, expect, test } from './utils';
import { gqlURL, interceptRequests } from './utils/mock';
import { fileRange, phase, USERS, type UserType } from './utils/mock/types';
import { AnnotationPhaseType } from '../src/api/types.gql-generated';
import type {
    CreateFileRangeMutationVariables,
    DeleteFileRangeMutationVariables,
    UpdateFileRangeMutationVariables,
} from '../src/features/AnnotationFileRange';
import type { Params } from './utils/types';

// Utils

const TEST = {

    handleEmptyState: ({ as, phase, tag }: Pick<Params, 'as' | 'phase' | 'tag'>) =>
        test(`as ${ as } for "${ phase }" phase`, { tag }, async ({ page }) => {
            await interceptRequests(page, {
                getCurrentUser: as,
                getAnnotationPhase: `${ as === 'annotator' ? '' : 'manager' }${ phase }`,
                allSpectrogramAnalysis: 'empty',
                listFileRanges: 'empty',
                allAnnotationSpectrograms: 'empty',
                allUsers: 'empty',
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
                await expect(page.phaseEdit.getRow(USERS.annotator)).toBeVisible()
                await expect(page.phaseEdit.getfirstIndexInput(USERS.annotator)).toHaveText((fileRange.firstFileIndex + 1).toString())
                await expect(page.phaseEdit.getlastIndexInput(USERS.annotator)).toHaveText((fileRange.lastFileIndex + 1).toString())

                await expect(page.phaseEdit.getRow(USERS.creator)).not.toBeVisible()
                await expect(page.phaseEdit.getRow(USERS.staff)).not.toBeVisible()
                await expect(page.phaseEdit.getRow(USERS.superuser)).not.toBeVisible()
            })
        }),

    addFileRange: ({ as, phase: phaseType, tag }: Pick<Params, 'as' | 'phase' | 'tag'>) =>
        test(`Add file range as ${ as } for "${ phaseType }" phase`, { tag }, async ({ page }) => {
            await interceptRequests(page, {
                getCurrentUser: as,
                getAnnotationPhase: `${ as === 'annotator' ? '' : 'manager' }${ phaseType }`,
                allUsers: 'filled',
                allUserGroups: 'staff',
            })
            await test.step(`Navigate`, () => page.phaseEdit.go({ as, phase: phaseType }))

            const newUser = USERS.superuser

            await test.step('Add new annotator', async () => {
                await page.phaseEdit.userSelect.fill(newUser.firstName);
                await page.getByRole('option', { name: newUser.firstName }).click();
                await page.phaseEdit.getRow(newUser).getByRole('button', { name: 'Add file range' }).click()
                await page.getByRole('spinbutton', { name: 'First file index *' }).fill('5')
                await page.getByRole('spinbutton', { name: 'Last file index *' }).fill('15')
                const [ request ] = await Promise.all([
                    page.waitForRequest(gqlURL),
                    page.getByRole('button', { name: 'Save' }).click(),
                ])
                const variables: CreateFileRangeMutationVariables = await request.postDataJSON().variables
                expect(variables.input.annotator).toEqual(newUser.id)
                expect(variables.input.annotationPhase).toEqual(phase.id)
                expect(variables.input.firstFileIndex).toEqual(4)
                expect(variables.input.lastFileIndex).toEqual(14)
            })
        }),

    filterGroup: ({ as, phase: phaseType, tag }: Pick<Params, 'as' | 'phase' | 'tag'>) =>
        test(`Filter group as ${ as } for "${ phaseType }" phase`, { tag }, async ({ page }) => {
            await interceptRequests(page, {
                getCurrentUser: as,
                getAnnotationPhase: `${ as === 'annotator' ? '' : 'manager' }${ phaseType }`,
                allUsers: 'filled',
                allUserGroups: 'staff',
            })
            await test.step(`Navigate`, () => page.phaseEdit.go({ as, phase: phaseType }))

            await test.step('Add annotator group', async () => {
                await page.phaseEdit.userGroupSelect.fill('Staff group');
                await page.getByRole('option', { name: 'Staff group' }).click();
                await expect(page.phaseEdit.getRow(USERS.annotator)).not.toBeVisible()
                await expect(page.phaseEdit.getRow(USERS.staff)).toBeVisible()
            })
        }),

    editFileRange: ({ as, phase, tag }: Pick<Params, 'as' | 'phase' | 'tag'>) =>
        test(`Edit file range as ${ as } for "${ phase }" phase`, { tag }, async ({ page }) => {
            await interceptRequests(page, {
                getCurrentUser: as,
                getAnnotationPhase: `${ as === 'annotator' ? '' : 'manager' }${ phase }`,
            })
            await test.step(`Navigate`, () => page.phaseEdit.go({ as, phase }))

            await test.step('Warn if edit file range with finished tasks', async () => {
                await page.phaseEdit.getRow(USERS.annotator).getByTestId('edit').click()
                await expect(page.getByRole('heading', { name: 'File range already started' })).toBeVisible()
            })

            await test.step('Edit range with finished tasks', async () => {
                await page.getByRole('button', { name: 'Update and risk annotation loss' }).click()
                await page.getByRole('spinbutton', { name: 'First file index *' }).fill('6')
                await page.getByRole('spinbutton', { name: 'Last file index *' }).fill('16')
                const [ request ] = await Promise.all([
                    page.waitForRequest(gqlURL),
                    page.getByRole('button', { name: 'Save' }).click(),
                ])
                const variables: UpdateFileRangeMutationVariables = await request.postDataJSON().variables
                expect(variables.input.id).toEqual(fileRange.id)
                expect(variables.input.firstFileIndex).toEqual(5)
                expect(variables.input.lastFileIndex).toEqual(15)
            })
        }),

    removeFileRange: ({ as, phase, tag }: Pick<Params, 'as' | 'phase' | 'tag'>) =>
        test(`Removefile range as ${ as } for "${ phase }" phase`, { tag }, async ({ page }) => {
            await interceptRequests(page, {
                getCurrentUser: as,
                getAnnotationPhase: `${ as === 'annotator' ? '' : 'manager' }${ phase }`,
            })
            await test.step(`Navigate`, () => page.phaseEdit.go({ as, phase }))

            await test.step('Warn if remove file range with finished tasks', async () => {
                await page.phaseEdit.getRow(USERS.annotator).getByTestId('remove').click()
                await expect(page.getByRole('heading', { name: 'File range already started' })).toBeVisible()
            })

            await test.step('Remove range with finished tasks', async () => {
                const [ request ] = await Promise.all([
                    page.waitForRequest(gqlURL),
                    page.getByRole('button', { name: 'Remove and lost annotations' }).click(),
                ])
                const variables: DeleteFileRangeMutationVariables = await request.postDataJSON().variables
                expect(variables.id).toEqual(fileRange.id)
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

    TEST.addFileRange({ as, phase: AnnotationPhaseType.Annotation, tag: essentialTag })
    TEST.editFileRange({ as, phase: AnnotationPhaseType.Annotation, tag: essentialTag })
    TEST.removeFileRange({ as, phase: AnnotationPhaseType.Annotation, tag: essentialTag })
    TEST.filterGroup({ as, phase: AnnotationPhaseType.Annotation, tag: essentialTag })

})
