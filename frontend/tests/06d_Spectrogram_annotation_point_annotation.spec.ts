import { annotatorTag, essentialTag, expect, test } from './utils';
import {
  campaign,
  CONFIDENCES,
  LABELS,
  phase as phaseObj,
  spectrogramAnalysis,
  TASKS,
  USERS,
  type UserType,
} from './utils/mock/types';
import { type AnnotationInput, AnnotationPhaseType, AnnotationType } from '../src/api/types.gql-generated';
import { gqlURL, interceptRequests } from './utils/mock';
import type { SubmitTaskMutationVariables } from '../src/api/annotation-task/annotation-task.generated';
import type { Params } from './utils/types';


// Utils
const type = AnnotationType.Point
const TEST = {
  cannotAddPointAnnotations: ({ as, phase }: Pick<Params, 'as' | 'phase'>) =>
    test(`Cannot add point annotation if campaign doesn't allow on "${ phase } phase`, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: 'annotator',
        getAnnotationPhase: phase,
        getAnnotationTask: 'unsubmitted',
      })
      await test.step(`Navigate`, () => page.annotator.go({ as, phase }))

      await expect(page.getByText('No results')).toBeVisible()
      await page.annotator.addWeak(LABELS.classic, { method: 'mouse' })
      await page.annotator.getAnnotationForLabel(LABELS.classic, { type: AnnotationType.Weak }).click()

      await test.step('Cannot add point annotation', async () => {
        await page.annotator.draw(type);
        await expect(page.annotator.getAnnotationForLabel(LABELS.classic, { type })).not.toBeVisible()
      })
    }),

  canAddPointAnnotations: ({ as, phase }: Pick<Params, 'as' | 'phase'>) =>
    test(`Can add point annotation on "${ phase } phase`, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: 'annotator',
        getCampaign: 'allowPoint',
        getAnnotationPhase: phase,
        getAnnotationTask: 'unsubmitted',
      })
      await test.step(`Navigate`, () => page.annotator.go({ as, phase }))

      await expect(page.getByText('No results')).toBeVisible()
      await page.annotator.addWeak(LABELS.classic, { method: 'mouse' })
      await page.annotator.getAnnotationForLabel(LABELS.classic, { type: AnnotationType.Weak }).click()

      const bounds = await test.step('Add point annotation', async () => {
        const bounds = await page.annotator.draw(type);
        expect(page.annotator.getAnnotationForLabel(LABELS.classic, { type })).toBeTruthy()
        await expect(page.annotator.annotationsBlock.getByText(Math.floor(bounds.startTime).toString()).first()).toBeVisible();
        await expect(page.annotator.annotationsBlock.getByText(bounds.startFrequency.toString()).first()).toBeVisible();
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
          annotationPhase: phaseObj.id,
          ...bounds,
          label: LABELS.classic.name,
          confidence: CONFIDENCES.sure.label,
          analysis: spectrogramAnalysis.id,
          annotator: USERS[as].id,
          comments: [],
        } as AnnotationInput ]);
        expect(variables.taskComments).toEqual([]);
      })
    }),

  canRemovePointAnnotations: ({ as, phase, method }: Pick<Params, 'as' | 'phase' | 'method'>) =>
    test(`Can remove point annotation using ${ method } on "${ phase } phase`, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: 'annotator',
        getCampaign: 'allowPoint',
        getAnnotationPhase: phase,
        getAnnotationTask: 'unsubmitted',
      })
      await test.step(`Navigate`, () => page.annotator.go({ as, phase }))

      await expect(page.getByText('No results')).toBeVisible()
      await page.annotator.addWeak(LABELS.classic, { method })
      await page.annotator.draw(type);

      await test.step('Remove point annotation', async () => {
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
            label: LABELS.classic.name,
            confidence: CONFIDENCES.sure.label,
            analysis: spectrogramAnalysis.id,
            annotator: USERS[as].id,
            comments: [],
          } as AnnotationInput ]);
        expect(variables.taskComments).toEqual([]);
      })
    }),
}


// Tests
test.describe('[Spectrogram] Point annotations', { tag: [ annotatorTag, essentialTag ] }, () => {
  const as: UserType = 'annotator'

  TEST.canAddPointAnnotations({ as, phase: AnnotationPhaseType.Annotation })
  TEST.canAddPointAnnotations({ as, phase: AnnotationPhaseType.Verification })

  TEST.cannotAddPointAnnotations({ as, phase: AnnotationPhaseType.Annotation })
  TEST.cannotAddPointAnnotations({ as, phase: AnnotationPhaseType.Verification })

  TEST.canRemovePointAnnotations({ as, phase: AnnotationPhaseType.Annotation, method: 'mouse' })
  TEST.canRemovePointAnnotations({ as, phase: AnnotationPhaseType.Annotation, method: 'shortcut' })
  TEST.canRemovePointAnnotations({ as, phase: AnnotationPhaseType.Verification, method: 'mouse' })
  TEST.canRemovePointAnnotations({ as, phase: AnnotationPhaseType.Verification, method: 'shortcut' })
})
