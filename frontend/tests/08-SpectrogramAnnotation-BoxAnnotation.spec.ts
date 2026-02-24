import { annotatorTag, essentialTag, expect, test } from './utils';
import {
    campaign,
    CONFIDENCES,
    LABELS,
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
import { gqlURL, interceptRequests } from './utils/mock';
import type { SubmitTaskMutationVariables } from '../src/api/annotation-task/annotation-task.generated';
import type { Params } from './utils/types';


// Utils
const TEST = {
    canAddBoxAnnotations: ({ as, phase }: Pick<Params, 'as' | 'phase'>) =>
        test(`on "${ phase } phase`, async ({ page }) => {
            await interceptRequests(page, {
                getCurrentUser: 'annotator',
                getAnnotationPhase: phase,
                getAnnotationTask: 'unsubmitted',
            })
            await test.step(`Navigate`, () => page.annotator.go({ as, phase }))
            const type = AnnotationType.Box

            await expect(page.getByText('No results')).toBeVisible()
            await page.annotator.addWeak(LABELS.classic, { method: 'mouse' })

            await test.step('Select weak annotation', async () => {
                await page.annotator.getAnnotationForLabel(LABELS.classic, { type: AnnotationType.Weak }).click()
            })

            const bounds = await test.step('Add box annotation', async () => {
                const bounds = await page.annotator.draw(type);
                expect(page.annotator.getAnnotationForLabel(LABELS.classic, { type })).toBeTruthy()
                await expect(page.annotator.annotationsBlock.getByText(Math.floor(bounds.startTime).toString()).first()).toBeVisible();
                await expect(page.annotator.annotationsBlock.getByText(Math.floor(bounds.endTime).toString()).first()).toBeVisible();
                await expect(page.annotator.annotationsBlock.getByText(bounds.startFrequency.toString()).first()).toBeVisible();
                await expect(page.annotator.annotationsBlock.getByText(bounds.endFrequency.toString()).first()).toBeVisible();
                return bounds
            })

            await test.step('Submit', async () => {
                const [ request ] = await Promise.all([
                    page.waitForRequest(gqlURL),
                    page.annotator.submit({ method: 'mouse' }),
                ])
                const variables = request.postDataJSON().variables as SubmitTaskMutationVariables;
                expect(variables.campaignID).toEqual(campaign.id);
                expect(variables.phase).toEqual(phase);
                expect(variables.spectrogramID).toEqual(TASKS.unsubmitted.id);
                expect(variables.annotations).toEqual([ {
                    annotationPhase: phaseObj.id,
                    label: LABELS.classic.name,
                    confidence: CONFIDENCES.sure.label,
                    analysis: spectrogramAnalysis.id,
                    annotator: USERS[as].id,
                    comments: [],
                } as AnnotationInput, {
                    ...bounds,
                    annotationPhase: phaseObj.id,
                    label: LABELS.classic.name,
                    confidence: CONFIDENCES.sure.label,
                    analysis: spectrogramAnalysis.id,
                    annotator: USERS[as].id,
                    comments: [],
                } as AnnotationInput ]);
                expect(variables.taskComments).toEqual([]);
            })
        }),

    canRemoveBoxAnnotations: ({ as, phase, method }: Pick<Params, 'as' | 'phase' | 'method'>) =>
        test(`using ${ method } on "${ phase } phase`, async ({ page }) => {
            await interceptRequests(page, {
                getCurrentUser: 'annotator',
                getAnnotationPhase: phase,
                getAnnotationTask: 'submitted',
            })
            await test.step(`Navigate`, () => page.annotator.go({ as, phase }))
            const type = AnnotationType.Box

            await test.step('Remove box annotation', async () => {
                await page.annotator.removeStrong(LABELS.classic, { type, method })
                await expect(page.annotator.getAnnotationForLabel(LABELS.classic, { type })).not.toBeVisible()
            })

            await test.step('Submit', async () => {
                const [ request ] = await Promise.all([
                    page.waitForRequest(gqlURL),
                    page.annotator.submit({ method }),
                ])
                const variables = request.postDataJSON().variables as SubmitTaskMutationVariables;
                expect(variables.campaignID).toEqual(campaign.id);
                expect(variables.phase).toEqual(phase);
                expect(variables.spectrogramID).toEqual(TASKS.unsubmitted.id);
                expect(variables.annotations).toEqual([
                    {
                        annotationPhase: phaseObj.id,
                        id: +weakAnnotation.id,
                        comments: [ {
                            id: +weakAnnotationComment.id,
                            comment: weakAnnotationComment.comment,
                        } ],
                        label: LABELS.classic.name,
                        annotator: USERS.annotator.id,
                        confidence: CONFIDENCES.sure.label,
                        analysis: spectrogramAnalysis.id,
                    } as AnnotationInput ]);
                expect(variables.taskComments).toEqual([ {
                    comment: taskComment.comment,
                    id: +taskComment.id,
                } as AnnotationCommentInput ]);
            })
        }),

}


// Tests
test.describe('/annotation-campaign/:campaignID/phase/:phaseType/spectrogram/:spectrogramID', { tag: [ annotatorTag, essentialTag ] }, () => {
    const as: UserType = 'annotator'

    test.describe(`[Box annotation] as ${ as }`, () => {

        test.describe('Can add', () => {
            TEST.canAddBoxAnnotations({ as, phase: AnnotationPhaseType.Annotation })
            TEST.canAddBoxAnnotations({ as, phase: AnnotationPhaseType.Verification })
        })

        test.describe('Can remove', () => {
            TEST.canRemoveBoxAnnotations({ as, phase: AnnotationPhaseType.Annotation, method: 'mouse' })
            TEST.canRemoveBoxAnnotations({ as, phase: AnnotationPhaseType.Annotation, method: 'shortcut' })
            TEST.canRemoveBoxAnnotations({ as, phase: AnnotationPhaseType.Verification, method: 'mouse' })
            TEST.canRemoveBoxAnnotations({ as, phase: AnnotationPhaseType.Verification, method: 'shortcut' })
        })
    })

})
