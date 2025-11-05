import { ESSENTIAL, expect, test } from './utils';
import { gqlURL, interceptRequests } from './utils/mock';
import {
  campaign,
  CONFIDENCES,
  LABELS,
  spectrogramAnalysis,
  taskComment,
  TASKS,
  type UserType,
} from './utils/mock/types';
import {
  type AnnotationCommentInput,
  type AnnotationInput,
  AnnotationPhaseType,
} from '../src/api/types.gql-generated';
import type { SubmitTaskMutationVariables } from '../src/api/annotation-task/annotation-task.generated';

type Params = {
  as: UserType,
  phase: AnnotationPhaseType
}
type MethodParams = {
  as: UserType,
  phase: AnnotationPhaseType,
  method: 'mouse' | 'shortcut'
}

// Utils
const TEST = {
  canAddWeakAnnotation: ({ as, phase, method }: MethodParams) =>
    test(`Can add weak annotation using ${ method } on "${ phase } phase"`, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: 'annotator',
        getAnnotationPhase: phase,
        getAnnotationTask: 'unsubmitted',
      })
      await page.annotator.go(as);
      await expect(page.getByText('No results')).toBeVisible()

      await test.step('Add weak annotation', async () => {
        expect(await page.annotator.isLabelUsed(LABELS.classic)).toBeFalsy()
        await page.annotator.addWeak(LABELS.classic, method)
        expect(page.annotator.getAnnotationForLabel(LABELS.classic)).toBeTruthy()
        expect(await page.annotator.isLabelUsed(LABELS.classic)).toBeTruthy()
      })

      await test.step('Submit', async () => {
        const [ request ] = await Promise.all([
          page.waitForRequest(gqlURL),
          page.annotator.submit(method),
        ])
        const variables = request.postDataJSON().variables as SubmitTaskMutationVariables;
        expect(variables.campaignID).toEqual(campaign.id);
        expect(variables.phase).toEqual(AnnotationPhaseType.Annotation);
        expect(variables.spectrogramID).toEqual(TASKS.unsubmitted.id);
        expect(variables.annotations).toEqual([ {
          label: LABELS.classic.name,
          confidence: CONFIDENCES.sure.label,
          analysis: spectrogramAnalysis.id,
          comments: [],
        } as AnnotationInput ]);
        expect(variables.taskComments).toEqual([]);
      })
    }),

  canRemoveWeakAnnotation: ({ as, phase, method }: MethodParams) =>
    test(`Can remove weak annotation using ${ method } on "${ phase } phase`, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: 'annotator',
        getAnnotationPhase: phase,
        getAnnotationTask: 'submitted',
      })
      await page.annotator.go(as);
      await expect(page.getByText('No results')).not.toBeVisible()

      await test.step('Remove weak annotation', async () => {
        expect(await page.annotator.isLabelUsed(LABELS.classic)).toBeTruthy()
        expect(page.annotator.getAnnotationForLabel(LABELS.classic)).toBeTruthy()
        await page.annotator.removeWeak(LABELS.classic, method)
        await expect(page.getByRole('dialog').getByText('You are about to remove 2 annotations')).toBeVisible()
        await page.annotator.confirmeRemoveWeak(LABELS.classic, method)
        expect(await page.annotator.isLabelUsed(LABELS.classic)).toBeFalsy()
      })

      await test.step('Submit', async () => {
        const [ request ] = await Promise.all([
          page.waitForRequest(gqlURL),
          page.annotator.submit(method),
        ])
        const variables = request.postDataJSON().variables as SubmitTaskMutationVariables;
        expect(variables.campaignID).toEqual(campaign.id);
        expect(variables.phase).toEqual(AnnotationPhaseType.Annotation);
        expect(variables.spectrogramID).toEqual(TASKS.unsubmitted.id);
        expect(variables.annotations).toEqual([]);
        expect(variables.taskComments).toEqual([ {
          comment: taskComment.comment,
          id: +taskComment.id,
        } as AnnotationCommentInput ]);
      })
    }),

  canUpdateWeakAnnotationConfidence: ({ as, phase }: Params) =>
    test(`Can update weak annotation confidence on "${ phase } phase`, async ({ page }) => {
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

      await test.step('Update confidence', async () => {
        // Before: 'sure'
        await expect(page.annotator.annotationsBlock.getByText(CONFIDENCES.sure.label, { exact: true })).toBeVisible()
        await expect(page.annotator.annotationsBlock.getByText(CONFIDENCES.notSure.label, { exact: true })).not.toBeVisible()

        // Select
        await page.annotator.getConfidenceChip(CONFIDENCES.notSure).click();

        // After: 'not sure'
        await expect(page.annotator.annotationsBlock.getByText(CONFIDENCES.sure.label, { exact: true })).not.toBeVisible()
        await expect(page.annotator.annotationsBlock.getByText(CONFIDENCES.notSure.label, { exact: true })).toBeVisible()
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
          confidence: CONFIDENCES.notSure.label,
          analysis: spectrogramAnalysis.id,
          comments: [],
        } as AnnotationInput ]);
        expect(variables.taskComments).toEqual([]);
      })
    }),
}


// Tests
test.describe('[Spectrogram] Annotator can manage weak annotations', { tag: [ '@annotator', ESSENTIAL.tag ] }, () => {

  TEST.canAddWeakAnnotation({
    as: 'annotator',
    phase: AnnotationPhaseType.Annotation,
    method: 'mouse',
  })
  TEST.canAddWeakAnnotation({
    as: 'annotator',
    phase: AnnotationPhaseType.Annotation,
    method: 'shortcut',
  })
  TEST.canAddWeakAnnotation({
    as: 'annotator',
    phase: AnnotationPhaseType.Verification,
    method: 'mouse',
  })
  TEST.canAddWeakAnnotation({
    as: 'annotator',
    phase: AnnotationPhaseType.Verification,
    method: 'shortcut',
  })

  TEST.canRemoveWeakAnnotation({
    as: 'annotator',
    phase: AnnotationPhaseType.Annotation,
    method: 'mouse',
  })
  TEST.canRemoveWeakAnnotation({
    as: 'annotator',
    phase: AnnotationPhaseType.Annotation,
    method: 'shortcut',
  })
  TEST.canRemoveWeakAnnotation({
    as: 'annotator',
    phase: AnnotationPhaseType.Verification,
    method: 'mouse',
  })
  TEST.canRemoveWeakAnnotation({
    as: 'annotator',
    phase: AnnotationPhaseType.Verification,
    method: 'shortcut',
  })

  TEST.canUpdateWeakAnnotationConfidence({
    as: 'annotator',
    phase: AnnotationPhaseType.Annotation,
  })
  TEST.canUpdateWeakAnnotationConfidence({
    as: 'annotator',
    phase: AnnotationPhaseType.Verification,
  })
})
