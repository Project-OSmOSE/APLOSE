import { annotatorTag, essentialTag, expect, test } from './utils';
import {
    boxAnnotation,
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

  canAddComments: ({ as, phase }: Pick<Params, 'as' | 'phase'>) =>
    test(`Can add comments on "${ phase } phase`, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: 'annotator',
        getAnnotationPhase: phase,
        getAnnotationTask: 'unsubmitted',
      })
      await test.step(`Navigate`, () => page.annotator.go({ as, phase }))
      await expect(page.getByText('No results')).toBeVisible()
      await page.annotator.addWeak(LABELS.classic, { method: 'mouse' })

      await test.step('Select annotation', async () => {
        await page.annotator.getAnnotationForLabel(LABELS.classic, { type: AnnotationType.Weak }).click()
      })

      await test.step('Add annotation comment', async () => {
        await page.annotator.commentInput.fill(weakAnnotationComment.comment);
        await expect(page.getByText(weakAnnotationComment.comment)).toBeVisible();
      })

      await test.step('Switch to task', async () => {
        await page.annotator.taskCommentButton.click();
        await expect(page.getByText(weakAnnotationComment.comment)).not.toBeVisible();
      })

      await test.step('Add task comment', async () => {
        await page.annotator.commentInput.fill(taskComment.comment);
        await expect(page.getByText(taskComment.comment)).toBeVisible();
      })

      await test.step('Switch to annotation', async () => {
        await page.annotator.getAnnotationForLabel(LABELS.classic, { type: AnnotationType.Weak }).click()
        await expect(page.getByText(taskComment.comment)).not.toBeVisible();
        await expect(page.getByText(weakAnnotationComment.comment)).toBeVisible();
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
          comments: [ {
            comment: weakAnnotationComment.comment,
          } ],
        } as AnnotationInput ]);
        expect(variables.taskComments).toEqual([ {
          comment: taskComment.comment,
        } as AnnotationCommentInput ]);
      })
    }),

  canRemoveComments: ({ as, phase }: Pick<Params, 'as' | 'phase'>) =>
    test(`Can remove comments on "${ phase } phase`, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: 'annotator',
        getAnnotationPhase: phase,
        getAnnotationTask: 'submitted',
      })
      await test.step(`Navigate`, () => page.annotator.go({ as, phase }))

      await test.step('Clear task comment', async () => {
        await page.annotator.taskCommentButton.click()
        await expect(page.getByText(taskComment.comment)).toBeVisible();
        await page.annotator.commentInput.clear();
        await expect(page.getByText(taskComment.comment)).not.toBeVisible();
      })

      await test.step('Select annotation', async () => {
        await page.annotator.getAnnotationForLabel(LABELS.classic, { type: AnnotationType.Weak }).click()
      })

      await test.step('Clear annotation comment', async () => {
        await expect(page.getByText(weakAnnotationComment.comment)).toBeVisible();
        await page.annotator.commentInput.clear();
        await expect(page.getByText(weakAnnotationComment.comment)).not.toBeVisible();
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
        expect(variables.annotations).toEqual([
          {
            annotationPhase: phaseObj.id,
            id: +weakAnnotation.id,
            label: LABELS.classic.name,
            confidence: CONFIDENCES.sure.label,
            analysis: spectrogramAnalysis.id,
            annotator: USERS.annotator.id,
            comments: [],
          } as AnnotationInput,
          {
            annotationPhase: phaseObj.id,
            id: +boxAnnotation.id,
            startTime: boxAnnotation.startTime,
            endTime: boxAnnotation.endTime,
            startFrequency: boxAnnotation.startFrequency,
            endFrequency: boxAnnotation.endFrequency,
            label: LABELS.classic.name,
            confidence: CONFIDENCES.notSure.label,
            analysis: spectrogramAnalysis.id,
            annotator: USERS.annotator.id,
            comments: [],
          } as AnnotationInput ]);
        expect(variables.taskComments).toEqual([]);
      })
    }),
}


// Tests
test.describe('/annotation-campaign/:campaignID/phase/:phaseType/spectrogram/:spectrogramID',{ tag: [ annotatorTag, essentialTag ] }, () => {
  const as: UserType = 'annotator'

  TEST.canAddComments({ as, phase: AnnotationPhaseType.Annotation })
  TEST.canAddComments({ as, phase: AnnotationPhaseType.Verification })

  TEST.canRemoveComments({ as, phase: AnnotationPhaseType.Annotation })
  TEST.canRemoveComments({ as, phase: AnnotationPhaseType.Verification })
})
