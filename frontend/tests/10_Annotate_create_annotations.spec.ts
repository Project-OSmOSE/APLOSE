import { ESSENTIAL, expect, test } from './utils';
import { interceptRequests } from './utils/mock';
import { AnnotationPhaseType } from '../src/api/types.gql-generated';


// Tests

test.describe('"Annotation" phase', { tag: '@annotator' }, () => {

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
