import { ESSENTIAL, expect, test } from './utils';
import { CAMPAIGN, CAMPAIGN_PHASE, COMMENT, FILE_RANGE, LABEL, UserType } from './fixtures';
import { BoxBounds } from '../src/service/types';
import { interceptRequests } from './utils/mock';
import { AnnotationPhaseType } from '../src/api/types.gql-generated';

// Utils
const TEST = {
  empty: (as: UserType, { submit, phase }: { submit: 'mouse' | 'key', phase: AnnotationPhaseType }) => {
    return test(`Empty (submit ${ submit })`, ESSENTIAL, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: 'annotator',
        getAnnotationPhase: phase,
      })
      await page.annotator.go(as, { phase, empty: true });
      await expect(page.getByText('Confidence indicator ')).toBeVisible();


      await test.step('Can add box', async () => {
        const label = page.annotator.getLabel(LABEL.withFeatures);
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
        const label = page.annotator.getLabel(LABEL.withFeatures);
        await expect(label.getNthStrongResult(0)).not.toBeVisible();
      })

      await test.step('Cannot add point', async () => {
        const label = page.annotator.getLabel(LABEL.withFeatures);
        await label.getWeakResult().click();
        await page.annotator.draw('Point');
        await expect(label.getNthStrongResult(0)).not.toBeVisible();
      })

      if (submit === 'mouse') {
        await test.step('Can submit - mouse', async () => {
          const [ request ] = await Promise.all([
            page.waitForRequest(`/api/annotator/campaign/${ CAMPAIGN.id }/phase/${ CAMPAIGN_PHASE.id }/file/${ FILE_RANGE.unsubmittedFile.id }/`),
            page.annotator.submitButton.click(),
          ])
          const submittedData = request.postDataJSON();
          expect(submittedData.results).toEqual([]);
          expect(submittedData.task_comments).toEqual([ { comment: COMMENT.task.comment } ]);
        })
      } else {
        await test.step('Can submit - keyboard', async () => {
          const [ request ] = await Promise.all([
            page.waitForRequest(`/api/annotator/campaign/${ CAMPAIGN.id }/phase/${ CAMPAIGN_PHASE.id }/file/${ FILE_RANGE.unsubmittedFile.id }/`),
            page.keyboard.press('Enter'),
          ])
          const submittedData = request.postDataJSON();
          expect(submittedData.results).toEqual([]);
          expect(submittedData.task_comments).toEqual([ { comment: COMMENT.task.comment } ]);
        })
      }
    })
  },
}

// Tests

test.describe('"Annotation" phase', { tag: '@annotator' }, () => {

  test(`Can go back to campaign`, ESSENTIAL, async ({ page }) => {
    await interceptRequests(page, {
      getCurrentUser: 'annotator',
    })
    await page.annotator.go('annotator', { phase: 'Annotation' });
    await page.annotator.backToCampaignButton.click();
    await page.waitForURL(`/app/annotation-campaign/${ CAMPAIGN.id }/phase/${ CAMPAIGN_PHASE.id }`)
  })

  TEST.empty('annotator', { phase: AnnotationPhaseType.Annotation, submit: 'mouse' })
  TEST.empty('annotator', { phase: AnnotationPhaseType.Annotation, submit: 'key' })

  test(`Empty | allow point annotation`, ESSENTIAL, async ({ page }) => {
    await interceptRequests(page, {
      getCurrentUser: 'annotator',
      getCampaign: 'allowPoint',
    })
    await page.annotator.go('annotator', { empty: true });

    await test.step('Can add presence - mouse', async () => {
      const label = page.annotator.getLabel(LABEL.classic);
      expect(await label.getLabelState()).toBeFalsy();
      await label.addPresence();
      await expect(label.getWeakResult()).toBeVisible();
      expect(await label.getLabelState()).toBeTruthy();
    })

    await test.step('Can add point', async () => {
      const label = page.annotator.getLabel(LABEL.classic);
      await label.getWeakResult().click();

      const bounds = await page.annotator.draw('Point');

      await expect(label.getNthStrongResult(0)).toBeVisible();
      await expect(page.annotator.resultsBlock.getByText(Math.floor(bounds.start_time).toString()).first()).toBeVisible();
      await expect(page.annotator.resultsBlock.getByText(bounds.start_frequency.toString()).first()).toBeVisible();
    })

    await test.step('Can remove point', async () => {
      await page.annotator.removeStrong()
      const label = page.annotator.getLabel(LABEL.withFeatures);
      await expect(label.getNthStrongResult(0)).not.toBeVisible();
    })

  })

  test(`No confidence`, ESSENTIAL, async ({ page }) => {
    await interceptRequests(page, {
      getCurrentUser: 'annotator',
      getCampaign: 'withoutConfidence',
    })
    await page.annotator.go('annotator');
    await expect(page.getByText('Confidence indicator ')).not.toBeVisible();
  })
})

test.describe('"Verification" phase', { tag: '@annotator' }, () => {

  test(`Can go back to campaign`, ESSENTIAL, async ({ page }) => {
    await interceptRequests(page, {
      getCurrentUser: 'annotator',
      getAnnotationPhase: AnnotationPhaseType.Verification,
    })
    await page.annotator.go('annotator', { phase: 'Verification' });
    await page.annotator.backToCampaignButton.click();
    await page.waitForURL(`/app/annotation-campaign/${ CAMPAIGN.id }/phase/${ CAMPAIGN_PHASE.id }`)
  })

  TEST.empty('annotator', { phase: AnnotationPhaseType.Verification, submit: 'mouse' })
  TEST.empty('annotator', { phase: AnnotationPhaseType.Verification, submit: 'key' })

  test(`Empty | allow point annotation`, ESSENTIAL, async ({ page }) => {
    await interceptRequests(page, {
      getCurrentUser: 'annotator',
      getAnnotationPhase: AnnotationPhaseType.Verification,
      getCampaign: 'allowPoint',
    })
    await page.annotator.go('annotator', { phase: 'Verification', empty: true });

    await test.step('Can add presence - mouse', async () => {
      const label = page.annotator.getLabel(LABEL.classic);
      expect(await label.getLabelState()).toBeFalsy();
      await label.addPresence();
      await expect(label.getWeakResult()).toBeVisible();
      expect(await label.getLabelState()).toBeTruthy();
    })

    await test.step('Can add point', async () => {
      const label = page.annotator.getLabel(LABEL.classic);
      await label.getWeakResult().click();

      const bounds = await page.annotator.draw('Point');

      await expect(label.getNthStrongResult(0)).toBeVisible();
      await expect(page.annotator.resultsBlock.getByText(Math.floor(bounds.start_time).toString()).first()).toBeVisible();
      await expect(page.annotator.resultsBlock.getByText(bounds.start_frequency.toString()).first()).toBeVisible();
    })

    await test.step('Can remove point', async () => {
      await page.annotator.removeStrong()
      const label = page.annotator.getLabel(LABEL.withFeatures);
      await expect(label.getNthStrongResult(0)).not.toBeVisible();
    })

  })

  test(`No confidence`, ESSENTIAL, async ({ page }) => {
    await interceptRequests(page, {
      getCurrentUser: 'annotator',
      getAnnotationPhase: AnnotationPhaseType.Verification,
      getCampaign: 'withoutConfidence',
    })
    await page.annotator.go('annotator', { phase: 'Verification' });
    await expect(page.getByText('Confidence indicator ')).not.toBeVisible();
  })
})
