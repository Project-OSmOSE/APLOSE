import { annotatorTag, essentialTag, expect, type Page, test } from './utils';
import { gqlRegex, interceptRequests } from './utils/mock';
import {
    boxAnnotation,
    campaign,
    CONFIDENCES,
    LABELS,
    otherPhase,
    phase as phaseObj,
    spectrogramAnalysis,
    taskComment,
    TASKS,
    USERS,
    type UserType,
    weakAnnotation,
    weakAnnotationComment,
} from './utils/mock/types';
import {
    type AnnotationCommentInput,
    type AnnotationInput,
    AnnotationPhaseType,
    AnnotationType,
} from '../src/api/types.gql-generated';
import type { SubmitTaskMutationVariables } from '../src/api/annotation-task/annotation-task.generated';
import type { Params } from './utils/types';
import type { Request } from 'playwright-core';

// Utils
const phase = AnnotationPhaseType.Verification

const STEP = {
    submit: (page: Page, validations: { weak: boolean, box: boolean }, ...extraAnnotations: AnnotationInput[]) =>
        test.step('Submit', async () => {
            const checkRequest = (request: Request) => {
                if (!new RegExp(gqlRegex).test(request.url())) return false;
                return request.postDataJSON().operationName === 'submitTask'
            }
            const [ request ] = await Promise.all([
                page.waitForRequest(checkRequest),
                page.annotator.submit({ method: 'mouse' }),
            ])
            const variables = request.postDataJSON().variables as SubmitTaskMutationVariables;
            expect(variables.campaignID).toEqual(campaign.id);
            expect(variables.phase).toEqual(phase);
            expect(variables.spectrogramID).toEqual(TASKS.unsubmitted.id);
            const expectedAnnotations: AnnotationInput[] = [
                {
                    annotationPhase: otherPhase.id,
                    id: +weakAnnotation.id,
                    comments: [ {
                        id: +weakAnnotationComment.id,
                        comment: weakAnnotationComment.comment,
                    } ],
                    label: LABELS.classic.name,
                    annotator: USERS.creator.id,
                    confidence: CONFIDENCES.sure.label,
                    analysis: spectrogramAnalysis.id,
                    validations: [
                        {
                            isValid: validations.weak,
                        },
                    ],
                }, {
                    annotationPhase: otherPhase.id,
                    id: +boxAnnotation.id,
                    startTime: boxAnnotation.startTime,
                    endTime: boxAnnotation.endTime,
                    startFrequency: boxAnnotation.startFrequency,
                    endFrequency: boxAnnotation.endFrequency,
                    comments: [],
                    label: LABELS.classic.name,
                    annotator: USERS.creator.id,
                    confidence: CONFIDENCES.notSure.label,
                    analysis: spectrogramAnalysis.id,
                    validations: [
                        {
                            isValid: validations.box,
                        },
                    ],
                } ]
            if (extraAnnotations) expectedAnnotations.push(...extraAnnotations)
            expect(variables.annotations).toEqual(expectedAnnotations);
            expect(variables.taskComments).toEqual([ {
                comment: taskComment.comment,
                id: +taskComment.id,
            } as AnnotationCommentInput ]);
        }),

}

const TEST = {

    canSendSubmittedVerification: ({ as, tag, method }: Pick<Params, 'as' | 'tag' | 'method'>) =>
        test(`on "${ phase }" phase using ${ method }`, { tag }, async ({ page }) => {
            await interceptRequests(page, {
                getCurrentUser: as,
                getAnnotationPhase: phase,
                getAnnotationTask: 'submittedAsOwner',
            })
            await test.step(`Navigate`, () => page.annotator.go({ as, phase }))

            await page.waitForTimeout(500)

            await test.step(`Display valid state`, async () => {
                expect(await page.annotator.isAnnotationValid({ type: AnnotationType.Weak })).toBeTruthy()
                expect(await page.annotator.isAnnotationValid({ type: AnnotationType.Box })).toBeTruthy()
            })

            await STEP.submit(page, { weak: true, box: true })
        }),

    invalidatePresenceInvalidatesAll: ({ as, tag }: Pick<Params, 'as' | 'tag'>) =>
        test(`Invalidate presence invalidates all on "${ phase }" phase `, { tag }, async ({ page }) => {
            await interceptRequests(page, {
                getCurrentUser: as,
                getAnnotationPhase: phase,
                getAnnotationTask: 'submittedAsOwner',
            })
            await test.step(`Navigate`, () => page.annotator.go({ as, phase }))

            await test.step(`Invalidate presence`, () =>
                page.annotator.invalidateAnnotation({ type: AnnotationType.Weak }))

            await test.step(`Display invalid state`, async () => {
                expect(await page.annotator.isAnnotationValid({ type: AnnotationType.Weak })).toBeFalsy()
                expect(await page.annotator.isAnnotationValid({ type: AnnotationType.Box })).toBeFalsy()
            })

            await STEP.submit(page, { weak: false, box: false })
        }),

    validateBoxValidatesAll: ({ as, tag }: Pick<Params, 'as' | 'tag'>) =>
        test(`Validate box validates all on "${ phase }" phase `, { tag }, async ({ page }) => {
            await interceptRequests(page, {
                getCurrentUser: as,
                getAnnotationPhase: phase,
                getAnnotationTask: 'submittedAsOwner',
            })
            await test.step(`Navigate`, () => page.annotator.go({ as, phase }))

            await page.annotator.invalidateAnnotation({ type: AnnotationType.Weak })

            await test.step(`Validate box`, () =>
                page.annotator.getAnnotationValidateBtn({ type: AnnotationType.Box }).click())

            await test.step(`Display invalid state`, async () => {
                expect(await page.annotator.isAnnotationValid({ type: AnnotationType.Weak })).toBeTruthy()
                expect(await page.annotator.isAnnotationValid({ type: AnnotationType.Box })).toBeTruthy()
            })

            await STEP.submit(page, { weak: true, box: true })
        }),

    invalidateBoxOnly: ({ as, tag }: Pick<Params, 'as' | 'tag'>) =>
        test(`Invalidate box only on "${ phase }" phase `, { tag }, async ({ page }) => {
            await interceptRequests(page, {
                getCurrentUser: as,
                getAnnotationPhase: phase,
                getAnnotationTask: 'submittedAsOwner',
            })
            await test.step(`Navigate`, () => page.annotator.go({ as, phase }))

            await test.step(`Invalidate box`, () =>
                page.annotator.invalidateAnnotation({ type: AnnotationType.Box }))

            await test.step(`Display state`, async () => {
                expect(await page.annotator.isAnnotationValid({ type: AnnotationType.Weak })).toBeTruthy()
                expect(await page.annotator.isAnnotationValid({ type: AnnotationType.Box })).toBeFalsy()
            })

            await STEP.submit(page, { weak: true, box: false })
        }),

    validateWeakOnly: ({ as, tag }: Pick<Params, 'as' | 'tag'>) =>
        test(`Validate weak only on "${ phase }" phase `, { tag }, async ({ page }) => {
            await interceptRequests(page, {
                getCurrentUser: as,
                getAnnotationPhase: phase,
                getAnnotationTask: 'submittedAsOwner',
            })
            await test.step(`Navigate`, () => page.annotator.go({ as, phase }))

            await page.annotator.invalidateAnnotation({ type: AnnotationType.Weak })

            await test.step(`Validate weak`, () =>
                page.annotator.getAnnotationValidateBtn({ type: AnnotationType.Weak }).click())

            await test.step(`Display state`, async () => {
                expect(await page.annotator.isAnnotationValid({ type: AnnotationType.Weak })).toBeTruthy()
                expect(await page.annotator.isAnnotationValid({ type: AnnotationType.Box })).toBeFalsy()
            })

            await STEP.submit(page, { weak: true, box: false })
        }),

    updateBoxLabel: ({ as, tag }: Pick<Params, 'as' | 'tag'>) =>
        test(`Update box label on "${ phase }" phase `, { tag }, async ({ page }) => {
            await interceptRequests(page, {
                getCurrentUser: as,
                getAnnotationPhase: phase,
                getAnnotationTask: 'submittedAsOwner',
            })
            await test.step(`Navigate`, () => page.annotator.go({ as, phase }))

            await page.annotator.invalidateAnnotation({ type: AnnotationType.Weak })

            await test.step(`Update label`, () =>
                page.annotator.updateBoxAnnotationLabel(LABELS.featured))

            await test.step(`Display state`, async () => {
                // Created weak
                await expect(page.annotator.getAnnotationForLabel(LABELS.featured, { type: AnnotationType.Weak })).toBeVisible()
                await expect(page.annotator.getAnnotationForLabel(LABELS.featured, { type: AnnotationType.Box })).toBeVisible()
            })

            await STEP.submit(page, { weak: false, box: false }, {
                annotationPhase: phaseObj.id,
                comments: [],
                label: LABELS.featured.name,
                annotator: USERS.annotator.id,
                confidence: CONFIDENCES.notSure.label,
                analysis: spectrogramAnalysis.id,
            }, {
                annotationPhase: phaseObj.id,
                isUpdateOf: boxAnnotation.id,
                startTime: boxAnnotation.startTime,
                endTime: boxAnnotation.endTime,
                startFrequency: boxAnnotation.startFrequency,
                endFrequency: boxAnnotation.endFrequency,
                comments: [],
                label: LABELS.featured.name,
                annotator: USERS.annotator.id,
                confidence: CONFIDENCES.notSure.label,
                analysis: spectrogramAnalysis.id,
            })
        }),

    updateBoxLabelThenValidate: ({ as, tag }: Pick<Params, 'as' | 'tag'>) =>
        test(`Update box label then validate on "${ phase }" phase `, { tag }, async ({ page }) => {
            await interceptRequests(page, {
                getCurrentUser: as,
                getAnnotationPhase: phase,
                getAnnotationTask: 'submittedAsOwner',
            })
            await test.step(`Navigate`, () => page.annotator.go({ as, phase }))

            await page.annotator.invalidateAnnotation({ type: AnnotationType.Weak })

            await test.step(`Update label`, () =>
                page.annotator.updateBoxAnnotationLabel(LABELS.featured))

            await test.step(`Validate box`, () =>
                page.annotator.getAnnotationValidateBtn({ type: AnnotationType.Box }).click())

            await test.step(`Display state`, async () => {
                // Created weak
                await expect(page.annotator.getAnnotationForLabel(LABELS.featured, { type: AnnotationType.Weak })).toBeVisible()
                await expect(page.annotator.getAnnotationForLabel(LABELS.featured, { type: AnnotationType.Box })).not.toBeVisible()

                expect(await page.annotator.isAnnotationValid({ type: AnnotationType.Box })).toBeTruthy()
            })

            await STEP.submit(page, { weak: true, box: true }, {
                annotationPhase: phaseObj.id,
                comments: [],
                label: LABELS.featured.name,
                annotator: USERS.annotator.id,
                confidence: CONFIDENCES.notSure.label,
                analysis: spectrogramAnalysis.id,
            })
        }),

}


// Tests
test.describe('/annotation-campaign/:campaignID/phase/:phaseType/spectrogram/:spectrogramID', { tag: [ annotatorTag, essentialTag ] }, () => {
    const as: UserType = 'annotator'

    test.describe(`[Validation] as ${ as }`, () => {

        test.describe('Can sen submitted verification', () => {
            TEST.canSendSubmittedVerification({ as, method: 'mouse', tag: essentialTag })
            TEST.canSendSubmittedVerification({ as, method: 'shortcut' })
        })

        TEST.invalidatePresenceInvalidatesAll({ as, tag: essentialTag })

        TEST.validateBoxValidatesAll({ as, tag: essentialTag })

        TEST.invalidateBoxOnly({ as, tag: essentialTag })

        TEST.validateWeakOnly({ as, tag: essentialTag })

        TEST.updateBoxLabel({ as, tag: essentialTag })

        TEST.updateBoxLabelThenValidate({ as, tag: essentialTag })

    })

})
