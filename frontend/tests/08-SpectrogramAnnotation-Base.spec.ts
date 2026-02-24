import { essentialTag, expect, test } from './utils';
import { interceptRequests } from './utils/mock';
import { campaign, type UserType } from './utils/mock/types';
import { AnnotationPhaseType } from '../src/api/types.gql-generated';
import type { Params } from './utils/types';


// Utils
const TEST = {
    canGoBackToCampaign: ({ as, phase, tag }: Pick<Params, 'as' | 'phase' | 'tag'>) =>
        test(`on "${ phase }" phase`, { tag }, async ({ page }) => {
            await interceptRequests(page, {
                getCurrentUser: as,
                getAnnotationPhase: phase,
            })
            await test.step(`Navigate`, () => page.annotator.go({ as, phase }))

            await test.step('Back to campaign', () =>
                Promise.all([
                    page.waitForURL(`/app/annotation-campaign/${ campaign.id }/phase/${ phase }`),
                    page.annotator.backToCampaignButton.click(),
                ]))
        }),

    displayNoConfidence: ({ as, phase, tag }: Pick<Params, 'as' | 'phase' | 'tag'>) =>
        test(`on "${ phase }" phase`, { tag }, async ({ page }) => {
            await interceptRequests(page, {
                getCurrentUser: as,
                getAnnotationPhase: phase,
                getCampaign: 'withoutConfidence',
            })
            await test.step(`Navigate`, () => page.annotator.go({ as, phase }))

            await test.step('Do not display confidence', () =>
                expect(page.getByText('Confidence indicator ')).not.toBeVisible())
        }),
}


// Tests

test.describe('/annotation-campaign/:campaignID/phase/:phaseType/spectrogram/:spectrogramID', () => {
    const as: UserType = 'annotator'

    test.describe('Can go back to campaign', () => {
        TEST.canGoBackToCampaign({ as, phase: AnnotationPhaseType.Annotation, tag: essentialTag })
        TEST.canGoBackToCampaign({ as, phase: AnnotationPhaseType.Verification })
    })

    test.describe('Display no confidence if campaign doesn\'t have set', () => {
        TEST.displayNoConfidence({ as, phase: AnnotationPhaseType.Annotation, tag: essentialTag })
        TEST.displayNoConfidence({ as, phase: AnnotationPhaseType.Verification })
    })
})
