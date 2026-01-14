import { annotatorTag, essentialTag, expect, test } from './utils';
import { gqlURL, interceptRequests } from './utils/mock';
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
} from './utils/mock/types';
import {
  type AnnotationCommentInput,
  type AnnotationInput,
  AnnotationPhaseType,
  AnnotationType,
} from '../src/api/types.gql-generated';
import type { SubmitTaskMutationVariables } from '../src/api/annotation-task/annotation-task.generated';
import type { Params } from './utils/types';

// Utils
const type = AnnotationType.Weak

const TEST = {
  canAddWeakAnnotation: ({ as, phase, method, tag }: Pick<Params, 'as' | 'phase' | 'method' | 'tag'>) =>
    test(`Can add weak annotation using ${ method } on "${ phase } phase"`, { tag }, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: 'annotator',
        getAnnotationPhase: phase,
        getAnnotationTask: 'unsubmitted',
      })
      await test.step(`Navigate`, () => page.annotator.go({ as, phase }))

      await expect(page.getByText('No results')).toBeVisible()

      await test.step('Add weak annotation', async () => {
        expect(await page.annotator.isLabelUsed(LABELS.classic)).toBeFalsy()
        await page.annotator.addWeak(LABELS.classic, { method })
        expect(page.annotator.getAnnotationForLabel(LABELS.classic, { type })).toBeTruthy()
        expect(await page.annotator.isLabelUsed(LABELS.classic)).toBeTruthy()
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
        expect(variables.annotations).toEqual([ {
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

  canRemoveWeakAnnotation: ({ as, phase, method, tag }: Pick<Params, 'as' | 'phase' | 'method' | 'tag'>) =>
    test(`Can remove weak annotation using ${ method } on "${ phase } phase`, { tag }, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: 'annotator',
        getAnnotationPhase: phase,
        getAnnotationTask: 'submitted',
      })
      await test.step(`Navigate`, () => page.annotator.go({ as, phase }))

      await expect(page.getByText('No results')).not.toBeVisible()

      await test.step('Remove weak annotation', async () => {
        expect(await page.annotator.isLabelUsed(LABELS.classic)).toBeTruthy()
        expect(page.annotator.getAnnotationForLabel(LABELS.classic, { type })).toBeTruthy()
        await page.annotator.removeWeak(LABELS.classic, { method })
        await expect(page.getByRole('dialog').getByText('You are about to remove 2 annotations')).toBeVisible()
        await page.annotator.confirmeRemoveWeak(LABELS.classic, { method })
        expect(await page.annotator.isLabelUsed(LABELS.classic)).toBeFalsy()
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
        expect(variables.annotations).toEqual([]);
        expect(variables.taskComments).toEqual([ {
          comment: taskComment.comment,
          id: +taskComment.id,
        } as AnnotationCommentInput ]);
      })
    }),

  canUpdateWeakAnnotationConfidence: ({ as, phase, tag }: Pick<Params, 'as' | 'phase' | 'tag'>) =>
    test(`Can update weak annotation confidence on "${ phase } phase`, { tag }, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: 'annotator',
        getAnnotationPhase: phase,
        getAnnotationTask: 'unsubmitted',
      })
      await test.step(`Navigate`, () => page.annotator.go({ as, phase }))

      await expect(page.getByText('No results')).toBeVisible()
      await page.annotator.addWeak(LABELS.classic, { method: 'mouse' })

      await test.step('Select annotation', async () => {
        await page.annotator.getAnnotationForLabel(LABELS.classic, { type }).click()
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
          page.annotator.submit({ method: 'mouse' }),
        ])
        const variables = request.postDataJSON().variables as SubmitTaskMutationVariables;
        expect(variables.campaignID).toEqual(campaign.id);
        expect(variables.phase).toEqual(phase);
        expect(variables.spectrogramID).toEqual(TASKS.unsubmitted.id);
        expect(variables.annotations).toEqual([ {
          annotationPhase: phaseObj.id,
          label: LABELS.classic.name,
          confidence: CONFIDENCES.notSure.label,
          analysis: spectrogramAnalysis.id,
          annotator: USERS[as].id,
          comments: [],
        } as AnnotationInput ]);
        expect(variables.taskComments).toEqual([]);
      })
    }),
}


// Tests
test.describe('[Spectrogram] Weak annotations', { tag: [ annotatorTag, essentialTag ] }, () => {
  const as: UserType = 'annotator'

  TEST.canAddWeakAnnotation({ as, phase: AnnotationPhaseType.Annotation, method: 'mouse' })
  TEST.canAddWeakAnnotation({ as, phase: AnnotationPhaseType.Annotation, method: 'shortcut' })
  TEST.canAddWeakAnnotation({ as, phase: AnnotationPhaseType.Verification, method: 'mouse' })
  TEST.canAddWeakAnnotation({ as, phase: AnnotationPhaseType.Verification, method: 'shortcut' })

  TEST.canRemoveWeakAnnotation({ as, phase: AnnotationPhaseType.Annotation, method: 'mouse' })
  TEST.canRemoveWeakAnnotation({ as, phase: AnnotationPhaseType.Annotation, method: 'shortcut' })
  TEST.canRemoveWeakAnnotation({ as, phase: AnnotationPhaseType.Verification, method: 'mouse' })
  TEST.canRemoveWeakAnnotation({ as, phase: AnnotationPhaseType.Verification, method: 'shortcut' })

  TEST.canUpdateWeakAnnotationConfidence({ as, phase: AnnotationPhaseType.Annotation })
  TEST.canUpdateWeakAnnotationConfidence({ as, phase: AnnotationPhaseType.Verification })
})
