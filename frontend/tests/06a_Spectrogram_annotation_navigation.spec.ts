import { ESSENTIAL, test } from './utils';
import { interceptRequests } from './utils/mock';
import { campaign, type UserType } from './utils/mock/types';
import { AnnotationPhaseType } from '../src/api/types.gql-generated';

type Params = {
  as: UserType,
  phase: AnnotationPhaseType
}

// Utils
const TEST = {
  canGoBackToCampaign: ({ as, phase }: Params) =>
    test(`Can go back to campaign on "${ phase } phase`, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: as,
      })
      await page.annotator.go(as);
      await Promise.all([
        page.waitForURL(`/app/annotation-campaign/${ campaign.id }/phase/${ phase }`, { timeout: 500 }),
        page.annotator.backToCampaignButton.click({ timeout: 500 }),
      ])
    }),
}


// Tests

test.describe('[Spectrogram] Annotator can navigate', { tag: [ '@annotator', ESSENTIAL.tag ] }, () => {
  const as: UserType = 'annotator'

  TEST.canGoBackToCampaign({ as, phase: AnnotationPhaseType.Annotation })
  TEST.canGoBackToCampaign({ as, phase: AnnotationPhaseType.Verification })
})
