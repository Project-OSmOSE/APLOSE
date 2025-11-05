import { ESSENTIAL, expect, test } from './utils';
import {
  boxAnnotation,
  campaign,
  CONFIDENCES,
  LABELS,
  spectrogramAnalysis,
  taskComment,
  TASKS,
  type UserType,
  weakAnnotation,
  weakAnnotationComment,
} from './utils/mock/types';
import {
  type AnnotationCommentInput,
  type AnnotationInput,
  AnnotationPhaseType,
} from '../src/api/types.gql-generated';
import { gqlURL, interceptRequests } from './utils/mock';
import type { SubmitTaskMutationVariables } from '../src/api/annotation-task/annotation-task.generated';

type Params = {
  as: UserType,
  phase: AnnotationPhaseType
}

// Utils
const TEST = {
  canAddComments: ({ as, phase }: Params) =>
    test(`Can add comments on "${ phase } phase`, ESSENTIAL, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: 'annotator',
        getAnnotationPhase: phase,
        getAnnotationTask: 'unsubmitted',
      })
      await page.annotator.go(as);
      await expect(page.getByText('No results')).toBeVisible()
      await page.annotator.addWeak(LABELS.classic)

      await test.step('Select annotation', async () => {
        await page.annotator.getAnnotationForLabel(LABELS.classic).click()
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
        await page.annotator.getAnnotationForLabel(LABELS.classic).click()
        await expect(page.getByText(taskComment.comment)).not.toBeVisible();
        await expect(page.getByText(weakAnnotationComment.comment)).toBeVisible();
      })

      await test.step('Submit', async () => {
        const [ request ] = await Promise.all([
          page.waitForRequest(gqlURL),
          page.annotator.submit(),
        ])
        const variables = request.postDataJSON().variables as SubmitTaskMutationVariables;
        expect(variables.campaignID).toEqual(campaign.id);
        expect(variables.phase).toEqual(AnnotationPhaseType.Annotation);
        expect(variables.spectrogramID).toEqual(TASKS.unsubmitted.id);
        expect(variables.annotations).toEqual([ {
          label: LABELS.classic.name,
          confidence: CONFIDENCES.sure.label,
          analysis: spectrogramAnalysis.id,
          comments: [ {
            comment: weakAnnotationComment.comment,
          } ],
        } as AnnotationInput ]);
        expect(variables.taskComments).toEqual([ {
          comment: taskComment.comment,
        } as AnnotationCommentInput ]);
      })
    }),

  canRemoveComments: ({ as, phase }: Params) =>
    test(`Can remove comments on "${ phase } phase`, ESSENTIAL, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: 'annotator',
        getAnnotationPhase: phase,
        getAnnotationTask: 'submitted',
      })
      await page.annotator.go(as);

      await test.step('Clear task comment', async () => {
        await page.annotator.commentInput.clear();
        await expect(page.getByText(taskComment.comment)).not.toBeVisible();
      })

      await test.step('Select annotation', async () => {
        await page.annotator.getAnnotationForLabel(LABELS.classic).click()
      })

      await test.step('Clear annotation comment', async () => {
        await page.annotator.commentInput.clear();
        await expect(page.getByText(weakAnnotationComment.comment)).not.toBeVisible();
      })

      await test.step('Submit', async () => {
        const [ request ] = await Promise.all([
          page.waitForRequest(gqlURL),
          page.annotator.submit(),
        ])
        const variables = request.postDataJSON().variables as SubmitTaskMutationVariables;
        expect(variables.campaignID).toEqual(campaign.id);
        expect(variables.phase).toEqual(AnnotationPhaseType.Annotation);
        expect(variables.spectrogramID).toEqual(TASKS.unsubmitted.id);
        expect(variables.annotations).toEqual([
          {
            id: +weakAnnotation.id,
            label: LABELS.classic.name,
            confidence: CONFIDENCES.sure.label,
            analysis: spectrogramAnalysis.id,
            comments: null,
          } as AnnotationInput,
          {
            id: +boxAnnotation.id,
            startTime: boxAnnotation.startTime,
            endTime: boxAnnotation.endTime,
            startFrequency: boxAnnotation.startFrequency,
            endFrequency: boxAnnotation.endFrequency,
            label: LABELS.classic.name,
            confidence: CONFIDENCES.notSure.label,
            analysis: spectrogramAnalysis.id,
            comments: null,
          } as AnnotationInput ]);
        expect(variables.taskComments).toEqual([]);
      })
    }),
}


// Tests
test.describe('[Spectrogram] Annotator can manage comments', { tag: [ '@annotator', ESSENTIAL.tag ] }, () => {
  const as: UserType = 'annotator'

  TEST.canAddComments({ as, phase: AnnotationPhaseType.Annotation })
  TEST.canAddComments({ as, phase: AnnotationPhaseType.Verification })

  TEST.canRemoveComments({ as, phase: AnnotationPhaseType.Annotation })
  TEST.canRemoveComments({ as, phase: AnnotationPhaseType.Verification })
})
