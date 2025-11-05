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
  weakAnnotationComment,
} from './utils/mock/types';
import {
  type AnnotationCommentInput,
  type AnnotationInput,
  AnnotationPhaseType,
  AnnotationType,
} from '../src/api/types.gql-generated';
import { BoxBounds } from '../src/service/types';
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
  canGoBackToCampaign: ({ as, phase }: Params) =>
    test(`Can go back to campaign`, ESSENTIAL, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: as,
      })
      await page.annotator.go(as);
      await Promise.all([
        page.waitForURL(`/app/annotation-campaign/${ campaign.id }/phase/${ phase }`, { timeout: 500 }),
        page.annotator.backToCampaignButton.click({ timeout: 500 }),
      ])
    }),

  canAddWeakAnnotation: ({ as, phase, method }: MethodParams) =>
    test(`Can add weak annotation using ${ method }`, ESSENTIAL, async ({ page }) => {
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
    test(`Can remove weak annotation using ${ method }`, ESSENTIAL, async ({ page }) => {
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
    test(`Can update weak annotation confidence`, ESSENTIAL, async ({ page }) => {
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

  canAddComments: ({ as, phase }: Params) =>
    test(`Can add comments`, ESSENTIAL, async ({ page }) => {
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

  canAddBoxAnnotations: ({ as, phase }: Params) =>
    test(`Can add strong annotations`, ESSENTIAL, async ({ page }) => {
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

  canAnnotateOnUnsubmittedTaskUsingMouse: ({ as, phase }: Params) => {
    return test(`Can annotate on unsubmitted task using mouse`, ESSENTIAL, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: 'annotator',
        getAnnotationPhase: phase,
        getAnnotationTask: 'unsubmitted',
      })
      await page.annotator.go(as);
      await expect(page.getByText('Confidence indicator ')).toBeVisible();

      await test.step('See no results', async () => {
        await expect(page.getByText('No results')).toBeVisible()
      })

      await test.step('Can add presence', async () => {
        const label = page.annotator.getLabel(LABELS.classic.name);
        expect(await label.getLabelState()).toBeFalsy();
        await label.addPresence();
        await expect(label.getWeakResult()).toBeVisible();
        expect(await label.getLabelState()).toBeTruthy();
      })

      await test.step('Can remove presence', async () => {
        const label = page.annotator.getLabel(LABELS.classic.name);
        await label.remove();
        await expect(label.getWeakResult()).not.toBeVisible();
        expect(await label.getLabelState()).toBeFalsy();
      })

      await test.step('Can update confidence', async () => {
        const label = page.annotator.getLabel(LABELS.featured.name);
        await label.getWeakResult().click();
        await expect(page.getByText(CONFIDENCES.sure.label, { exact: true }).nth(1)).toBeVisible()
        await expect(page.getByText(CONFIDENCES.notSure.label, { exact: true }).nth(1)).not.toBeVisible()
        const confidence = page.annotator.getConfidence(CONFIDENCES.notSure.label);
        await confidence.select()
        await expect(page.getByText(CONFIDENCES.sure.label, { exact: true }).nth(1)).not.toBeVisible()
        await expect(page.getByText(CONFIDENCES.notSure.label, { exact: true }).nth(1)).toBeVisible()
      })

      await test.step('Can add presence comment', async () => {
        await page.annotator.commentInput.fill(weakAnnotationComment.comment);
        await expect(page.getByText(weakAnnotationComment.comment)).toBeVisible();
      })

      await test.step('Can add task comment', async () => {
        await page.annotator.taskCommentButton.click();
        await expect(page.getByText(weakAnnotationComment.comment)).not.toBeVisible();
        await page.annotator.commentInput.fill(taskComment.comment);
        await expect(page.getByText(taskComment.comment)).toBeVisible();
      })

      await test.step('Can switch to presence comment', async () => {
        const label = page.annotator.getLabel(LABELS.featured.name);
        await label.getWeakResult().click();
        await expect(page.getByText(taskComment.comment)).not.toBeVisible();
        await expect(page.getByText(weakAnnotationComment.comment)).toBeVisible();
      })

      await test.step('Can add box', async () => {
        const label = page.annotator.getLabel(LABELS.featured.name);
        await label.getWeakResult().click();

        const bounds = await page.annotator.draw('Box') as BoxBounds;

        await expect(label.getNthStrongResult(0)).toBeVisible();
        await expect(page.annotator.resultsBlock.getByText(Math.floor(bounds.start_time).toString()).first()).toBeVisible();
        await expect(page.annotator.resultsBlock.getByText(Math.floor(bounds.end_time).toString()).first()).toBeVisible();
        await expect(page.annotator.resultsBlock.getByText(bounds.start_frequency.toString()).first()).toBeVisible();
        await expect(page.annotator.resultsBlock.getByText(bounds.end_frequency.toString()).first()).toBeVisible();
      })

      await test.step('Can remove box', async () => {
        await page.annotator.removeStrong()
        const label = page.annotator.getLabel(LABELS.featured.name);
        await expect(label.getNthStrongResult(0)).not.toBeVisible();
      })

      await test.step('Cannot add point', async () => {
        const label = page.annotator.getLabel(LABELS.featured.name);
        await label.getWeakResult().click();
        await page.annotator.draw('Point');
        await expect(label.getNthStrongResult(0)).not.toBeVisible();
      })


      await test.step('Can remove presence with boxes', async () => {
        const label = page.annotator.getLabel(LABELS.featured.name);
        await label.getWeakResult().click();

        await page.annotator.draw('Box');
        await label.remove();
        await expect(label.getWeakResult()).not.toBeVisible();
        await expect(label.getNthStrongResult(0)).not.toBeVisible();
        expect(await label.getLabelState()).toBeFalsy();
      })

      await test.step('Can submit - mouse', async () => {
        const [ request ] = await Promise.all([
          page.waitForRequest(`/api/annotator/campaign/${ campaign.id }/phase/${ phase }/file/${ TASKS.unsubmitted.id }/`),
          page.annotator.submitButton.click(),
        ])
        const submittedData = request.postDataJSON();
        expect(submittedData.results).toEqual([]);
        expect(submittedData.task_comments).toEqual([ { comment: taskComment.comment } ]);
      })
    })
  },

  canAnnotateWeakOnUnsubmittedTaskUsingMouse: ({ as, phase }: Params) => {
    return test(`Can annotate on unsubmitted task using mouse`, ESSENTIAL, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: 'annotator',
        getAnnotationPhase: phase,
        getAnnotationTask: 'unsubmitted',
      })
      await page.annotator.go(as);
      await expect(page.getByText('Confidence indicator ')).toBeVisible();

      await test.step('See no results', async () => {
        await expect(page.getByText('No results')).toBeVisible()
      })

      await test.step('Can add presence', async () => {
        const label = page.annotator.getLabel(LABELS.classic.name);
        expect(await label.getLabelState()).toBeFalsy();
        await label.addPresence();
        await expect(label.getWeakResult()).toBeVisible();
        expect(await label.getLabelState()).toBeTruthy();
      })

      await test.step('Can remove presence', async () => {
        const label = page.annotator.getLabel(LABELS.classic.name);
        await label.remove();
        await expect(label.getWeakResult()).not.toBeVisible();
        expect(await label.getLabelState()).toBeFalsy();
      })

      await test.step('Can update confidence', async () => {
        const label = page.annotator.getLabel(LABELS.featured.name);
        await label.getWeakResult().click();
        await expect(page.getByText(CONFIDENCES.sure.label, { exact: true }).nth(1)).toBeVisible()
        await expect(page.getByText(CONFIDENCES.notSure.label, { exact: true }).nth(1)).not.toBeVisible()
        const confidence = page.annotator.getConfidence(CONFIDENCES.notSure.label);
        await confidence.select()
        await expect(page.getByText(CONFIDENCES.sure.label, { exact: true }).nth(1)).not.toBeVisible()
        await expect(page.getByText(CONFIDENCES.notSure.label, { exact: true }).nth(1)).toBeVisible()
      })

      await test.step('Can add presence comment', async () => {
        await page.annotator.commentInput.fill(weakAnnotationComment.comment);
        await expect(page.getByText(weakAnnotationComment.comment)).toBeVisible();
      })

      await test.step('Can add task comment', async () => {
        await page.annotator.taskCommentButton.click();
        await expect(page.getByText(weakAnnotationComment.comment)).not.toBeVisible();
        await page.annotator.commentInput.fill(taskComment.comment);
        await expect(page.getByText(taskComment.comment)).toBeVisible();
      })

      await test.step('Can switch to presence comment', async () => {
        const label = page.annotator.getLabel(LABELS.featured.name);
        await label.getWeakResult().click();
        await expect(page.getByText(taskComment.comment)).not.toBeVisible();
        await expect(page.getByText(weakAnnotationComment.comment)).toBeVisible();
      })

      await test.step('Can add box', async () => {
        const label = page.annotator.getLabel(LABELS.featured.name);
        await label.getWeakResult().click();

        const bounds = await page.annotator.draw('Box') as BoxBounds;

        await expect(label.getNthStrongResult(0)).toBeVisible();
        await expect(page.annotator.resultsBlock.getByText(Math.floor(bounds.start_time).toString()).first()).toBeVisible();
        await expect(page.annotator.resultsBlock.getByText(Math.floor(bounds.end_time).toString()).first()).toBeVisible();
        await expect(page.annotator.resultsBlock.getByText(bounds.start_frequency.toString()).first()).toBeVisible();
        await expect(page.annotator.resultsBlock.getByText(bounds.end_frequency.toString()).first()).toBeVisible();
      })

      await test.step('Can remove box', async () => {
        await page.annotator.removeStrong()
        const label = page.annotator.getLabel(LABELS.featured.name);
        await expect(label.getNthStrongResult(0)).not.toBeVisible();
      })

      await test.step('Cannot add point', async () => {
        const label = page.annotator.getLabel(LABELS.featured.name);
        await label.getWeakResult().click();
        await page.annotator.draw('Point');
        await expect(label.getNthStrongResult(0)).not.toBeVisible();
      })


      await test.step('Can remove presence with boxes', async () => {
        const label = page.annotator.getLabel(LABELS.featured.name);
        await label.getWeakResult().click();

        await page.annotator.draw('Box');
        await label.remove();
        await expect(label.getWeakResult()).not.toBeVisible();
        await expect(label.getNthStrongResult(0)).not.toBeVisible();
        expect(await label.getLabelState()).toBeFalsy();
      })

      await test.step('Can submit - mouse', async () => {
        const [ request ] = await Promise.all([
          page.waitForRequest(`/api/annotator/campaign/${ campaign.id }/phase/${ phase }/file/${ TASKS.unsubmitted.id }/`),
          page.annotator.submitButton.click(),
        ])
        const submittedData = request.postDataJSON();
        expect(submittedData.results).toEqual([]);
        expect(submittedData.task_comments).toEqual([ { comment: taskComment.comment } ]);
      })
    })
  },

  canAnnotateOnUnsubmittedTaskUsingShortcuts: ({ as, phase }: Params) => {
    return test(`Can annotate on unsubmitted task using shortcuts`, ESSENTIAL, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: 'annotator',
        getAnnotationPhase: phase,
        getAnnotationTask: 'unsubmitted',
      })
      await page.annotator.go(as);

      await test.step('See no results', async () => {
        await expect(page.getByText('No results')).toBeVisible()
      })

      await test.step('Can add presence', async () => {
        const label = page.annotator.getLabel(LABELS.classic.name);
        expect(await label.getLabelState()).toBeFalsy();
        await page.keyboard.press('1')
        await expect(label.getWeakResult()).toBeVisible();
        expect(await label.getLabelState()).toBeTruthy();
      })

      await test.step('Can remove presence', async () => {
        const label = page.annotator.getLabel(LABELS.classic.name);
        await label.remove();
        await expect(label.getWeakResult()).not.toBeVisible();
        expect(await label.getLabelState()).toBeFalsy();
      })

      await test.step('Can update confidence', async () => {
        const label = page.annotator.getLabel(LABELS.featured.name);
        await label.getWeakResult().click();
        await expect(page.getByText(CONFIDENCES.sure.label, { exact: true }).nth(1)).toBeVisible()
        await expect(page.getByText(CONFIDENCES.notSure.label, { exact: true }).nth(1)).not.toBeVisible()
        const confidence = page.annotator.getConfidence(CONFIDENCES.notSure.label);
        await confidence.select()
        await expect(page.getByText(CONFIDENCES.sure.label, { exact: true }).nth(1)).not.toBeVisible()
        await expect(page.getByText(CONFIDENCES.notSure.label, { exact: true }).nth(1)).toBeVisible()
      })

      await test.step('Can add presence comment', async () => {
        await page.annotator.commentInput.fill(weakAnnotationComment.comment);
        await expect(page.getByText(weakAnnotationComment.comment)).toBeVisible();
      })

      await test.step('Can add task comment', async () => {
        await page.annotator.taskCommentButton.click();
        await expect(page.getByText(weakAnnotationComment.comment)).not.toBeVisible();
        await page.annotator.commentInput.fill(taskComment.comment);
        await expect(page.getByText(taskComment.comment)).toBeVisible();
      })

      await test.step('Can switch to presence comment', async () => {
        const label = page.annotator.getLabel(LABELS.featured.name);
        await label.getWeakResult().click();
        await expect(page.getByText(taskComment.comment)).not.toBeVisible();
        await expect(page.getByText(weakAnnotationComment.comment)).toBeVisible();
      })

      await test.step('Can add box', async () => {
        const label = page.annotator.getLabel(LABELS.featured.name);
        await label.getWeakResult().click();

        const bounds = await page.annotator.draw('Box') as BoxBounds;

        await expect(label.getNthStrongResult(0)).toBeVisible();
        await expect(page.annotator.resultsBlock.getByText(Math.floor(bounds.start_time).toString()).first()).toBeVisible();
        await expect(page.annotator.resultsBlock.getByText(Math.floor(bounds.end_time).toString()).first()).toBeVisible();
        await expect(page.annotator.resultsBlock.getByText(bounds.start_frequency.toString()).first()).toBeVisible();
        await expect(page.annotator.resultsBlock.getByText(bounds.end_frequency.toString()).first()).toBeVisible();
      })

      await test.step('Can remove box', async () => {
        await page.annotator.removeStrong()
        const label = page.annotator.getLabel(LABELS.featured.name);
        await expect(label.getNthStrongResult(0)).not.toBeVisible();
      })

      await test.step('Cannot add point', async () => {
        const label = page.annotator.getLabel(LABELS.featured.name);
        await label.getWeakResult().click();
        await page.annotator.draw('Point');
        await expect(label.getNthStrongResult(0)).not.toBeVisible();
      })


      await test.step('Can remove presence with boxes', async () => {
        const label = page.annotator.getLabel(LABELS.featured.name);
        await label.getWeakResult().click();

        await page.annotator.draw('Box');
        await label.remove();
        await expect(label.getWeakResult()).not.toBeVisible();
        await expect(label.getNthStrongResult(0)).not.toBeVisible();
        expect(await label.getLabelState()).toBeFalsy();
      })

      await test.step('Can submit - mouse', async () => {
        const [ request ] = await Promise.all([
          page.waitForRequest(`/api/annotator/campaign/${ campaign.id }/phase/${ phase }/file/${ TASKS.unsubmitted.id }/`),
          page.annotator.submitButton.click(),
        ])
        const submittedData = request.postDataJSON();
        expect(submittedData.results).toEqual([]);
        expect(submittedData.task_comments).toEqual([ { comment: taskComment.comment } ]);
      })
    })
  },
}


// Tests

test.describe('Annotator on "Annotation" phase', { tag: '@annotator' }, () => {
  const params: Params = {
    as: 'annotator',
    phase: AnnotationPhaseType.Annotation,
  }

  TEST.canGoBackToCampaign(params)

  TEST.canAddWeakAnnotation({ ...params, method: 'mouse' })
  TEST.canAddWeakAnnotation({ ...params, method: 'shortcut' })

  TEST.canRemoveWeakAnnotation({ ...params, method: 'mouse' })
  TEST.canRemoveWeakAnnotation({ ...params, method: 'shortcut' })

  TEST.canUpdateWeakAnnotationConfidence(params)

  TEST.canAddComments(params)

})

// test.describe('Annotator on "Verification" phase', { tag: '@annotator' }, () => {
//   const params: Params = {
//     as: 'annotator',
//     phase: AnnotationPhaseType.Verification,
//   }
//
//   TEST.canGoBackToCampaign(params)
//
// })
