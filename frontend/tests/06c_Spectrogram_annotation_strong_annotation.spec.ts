import { ESSENTIAL, expect, test } from './utils';
import {
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
  AnnotationType,
} from '../src/api/types.gql-generated';
import { gqlURL, interceptRequests } from './utils/mock';
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
  canAddBoxAnnotations: ({ as, phase }: Params) =>
    test(`Can add box annotation on "${ phase } phase`, ESSENTIAL, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: 'annotator',
        getAnnotationPhase: phase,
        getAnnotationTask: 'unsubmitted',
      })
      await page.annotator.go(as);
      await expect(page.getByText('No results')).toBeVisible()
      await page.annotator.addWeak(LABELS.classic)

      await test.step('Select weak annotation', async () => {
        await page.annotator.getAnnotationForLabel(LABELS.classic).click()
      })

      const bounds = await test.step('Add box annotation', async () => {
        const bounds = await page.annotator.draw(AnnotationType.Box);
        expect(page.annotator.getAnnotationForLabel(LABELS.classic, 'strong')).toBeTruthy()
        await expect(page.annotator.annotationsBlock.getByText(Math.floor(bounds.startTime).toString()).first()).toBeVisible();
        await expect(page.annotator.annotationsBlock.getByText(Math.floor(bounds.endTime).toString()).first()).toBeVisible();
        await expect(page.annotator.annotationsBlock.getByText(bounds.startFrequency.toString()).first()).toBeVisible();
        await expect(page.annotator.annotationsBlock.getByText(bounds.endFrequency.toString()).first()).toBeVisible();
        return bounds
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
          comments: [],
        } as AnnotationInput, {
          ...bounds,
          label: LABELS.classic.name,
          confidence: CONFIDENCES.sure.label,
          analysis: spectrogramAnalysis.id,
          comments: [],
        } as AnnotationInput ]);
        expect(variables.taskComments).toEqual([]);
      })
    }),

  canRemoveBoxAnnotations: ({ as, phase, method }: MethodParams) =>
    test(`Can remove box annotation using ${ method } on "${ phase } phase`, ESSENTIAL, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: 'annotator',
        getAnnotationPhase: phase,
        getAnnotationTask: 'submitted',
      })
      await page.annotator.go(as);
      await expect(page.getByText('No results')).toBeVisible()

      await test.step('Remove box annotation', async () => {
        await page.annotator.removeStrong(LABELS.classic, method)
        expect(page.annotator.getAnnotationForLabel(LABELS.classic, 'strong')).toBeFalsy()
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
            comments: [ {
              id: +weakAnnotationComment.id,
              comment: weakAnnotationComment.comment,
            } ],
            label: LABELS.classic.name,
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
test.describe('[Spectrogram] Annotator can manage strong annotations', { tag: [ '@annotator', ESSENTIAL.tag ] }, () => {
  const as: UserType = 'annotator'

  TEST.canAddBoxAnnotations({ as, phase: AnnotationPhaseType.Annotation })
  TEST.canAddBoxAnnotations({ as, phase: AnnotationPhaseType.Verification })

  TEST.canRemoveBoxAnnotations({ as, phase: AnnotationPhaseType.Annotation, method: 'mouse' })
  TEST.canRemoveBoxAnnotations({ as, phase: AnnotationPhaseType.Annotation, method: 'shortcut' })
  TEST.canRemoveBoxAnnotations({ as, phase: AnnotationPhaseType.Verification, method: 'mouse' })
  TEST.canRemoveBoxAnnotations({ as, phase: AnnotationPhaseType.Verification, method: 'shortcut' })
})
