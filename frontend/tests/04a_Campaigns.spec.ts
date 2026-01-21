import { essentialTag, expect, test } from './utils';
import { AnnotationPhaseType } from '../src/api/types.gql-generated';
import { gqlURL, interceptRequests } from './utils/mock';
import { campaign, USERS, type UserType } from './utils/mock/types';
import type { Params } from './utils/types';
import { AllCampaignFilters } from "../src/api";


// Utils
const TEST = {

  handleEmptyState: ({ as, tag }: Pick<Params, 'as' | 'tag'>) =>
    test(`Handle empty states as ${ as }`, { tag }, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: as,
        listCampaigns: 'empty',
      })
      await test.step(`Navigate`, () => page.campaigns.go({ as }));

      await test.step('Display no campaign', () =>
        expect(page.campaigns.card).not.toBeVisible())

      await test.step('Display empty message', () =>
        expect(page.getByText('No campaigns')).toBeVisible())
    }),

  displayCampaigns: ({ as, tag }: Pick<Params, 'as' | 'tag'>) =>
    test(`Display campaigns ${ as }`, { tag }, async ({ page }) => {
      await interceptRequests(page, { getCurrentUser: as })
      await test.step(`Navigate`, () => page.campaigns.go({ as }));

      await test.step('Display campaign', () =>
        expect(page.getByText(campaign.name).first()).toBeVisible())

      await test.step('Access campaign', async () => {
        await page.getByText(campaign.name).click()
        await page.waitForURL(`/app/annotation-campaign/${ campaign.id }/phase/Annotation`)
      })
    }),

  filterCampaigns: ({ as, tag }: Pick<Params, 'as' | 'tag'>) =>
    test(`Filter campaigns ${ as }`, { tag }, async ({ page }) => {
      await interceptRequests(page, { getCurrentUser: as })
      await test.step(`Navigate`, () => page.campaigns.go({ as }));

      await test.step('Filter are initialized', () =>
        expect(page.getByText('Archived: False')).toBeVisible())

      await test.step('Search', async () => {
        const [ request ] = await Promise.all([
          page.waitForRequest(gqlURL),
          page.campaigns.search('Test campaign'),
        ])
        const variables: AllCampaignFilters = request.postDataJSON().variables
        expect(variables.filter_isArchived).toBeFalsy()
        expect(variables.filter_phase).toBeFalsy()
        expect(variables.filter_ownerID).toBeFalsy()
        expect(variables.filter_annotatorID).toEqual(+USERS.annotator.id)
        expect(variables.search).toEqual('Test campaign') // Updated
        const params = new URLSearchParams('?' + page.url().split('?')[1])
        expect(JSON.parse(params.get('filter_isArchived'))).toBeFalsy()
        expect(JSON.parse(params.get('filter_phase'))).toBeFalsy()
        expect(JSON.parse(params.get('filter_ownerID'))).toBeFalsy()
        expect(JSON.parse(params.get('filter_annotatorID'))).toEqual(+USERS.annotator.id)
        expect(params.get('search')).toEqual('Test campaign') // Updated
      })

      await test.step('Add Only archived filter', async () => {
        const [ request ] = await Promise.all([
          page.waitForRequest(gqlURL),
          page.getByText('Archived: False').click(),
        ])
        const variables: AllCampaignFilters = request.postDataJSON().variables
        expect(variables.filter_isArchived).toBeTruthy() // Updated
        expect(variables.filter_phase).toBeFalsy()
        expect(variables.filter_ownerID).toBeFalsy()
        expect(variables.filter_annotatorID).toEqual(+USERS.annotator.id)
        expect(variables.search).toEqual('Test campaign')
        const params = new URLSearchParams('?' + page.url().split('?')[1])
        expect(JSON.parse(params.get('filter_isArchived'))).toBeTruthy() // Updated
        expect(JSON.parse(params.get('filter_phase'))).toBeFalsy()
        expect(JSON.parse(params.get('filter_ownerID'))).toBeFalsy()
        expect(JSON.parse(params.get('filter_annotatorID'))).toEqual(+USERS.annotator.id)
        expect(params.get('search')).toEqual('Test campaign')
      })

      await test.step('Add Has verification filter', async () => {
        const [ request ] = await Promise.all([
          page.waitForRequest(gqlURL),
          page.getByText('Has verification').click(),
        ])
        expect(request.postDataJSON().variables.filter_isArchived).toBeTruthy()
        expect(request.postDataJSON().variables.filter_phase).toEqual(AnnotationPhaseType.Verification)
        expect(request.postDataJSON().variables.filter_ownerID).toBeFalsy()
        expect(request.postDataJSON().variables.filter_annotatorID).toEqual(+USERS.annotator.id)
        expect(request.postDataJSON().variables.search).toEqual('Test campaign')
        const params = new URLSearchParams('?' + page.url().split('?')[1])
        expect(JSON.parse(params.get('filter_isArchived'))).toBeTruthy()
        expect(params.get('filter_phase')).toEqual(AnnotationPhaseType.Verification) // Updated
        expect(JSON.parse(params.get('filter_ownerID'))).toBeFalsy()
        expect(JSON.parse(params.get('filter_annotatorID'))).toEqual(+USERS.annotator.id)
        expect(params.get('search')).toEqual('Test campaign')
      })

      await test.step('Add Owned campaigns filter', async () => {
        const [ request ] = await Promise.all([
          page.waitForRequest(gqlURL),
          page.getByText('Owned campaigns').click(),
        ])
        expect(request.postDataJSON().variables.filter_isArchived).toBeTruthy()
        expect(request.postDataJSON().variables.filter_phase).toEqual(AnnotationPhaseType.Verification)
        expect(request.postDataJSON().variables.filter_ownerID).toEqual(+USERS.annotator.id) // Updated
        expect(request.postDataJSON().variables.filter_annotatorID).toEqual(+USERS.annotator.id)
        expect(request.postDataJSON().variables.search).toEqual('Test campaign')
        const params = new URLSearchParams('?' + page.url().split('?')[1])
        expect(JSON.parse(params.get('filter_isArchived'))).toBeTruthy()
        expect(params.get('filter_phase')).toEqual(AnnotationPhaseType.Verification)
        expect(JSON.parse(params.get('filter_ownerID'))).toEqual(+USERS.annotator.id) // Updated
        expect(JSON.parse(params.get('filter_annotatorID'))).toEqual(+USERS.annotator.id)
        expect(params.get('search')).toEqual('Test campaign')
      })

      await test.step('Remove My work filter', async () => {
        const [ request ] = await Promise.all([
          page.waitForRequest(gqlURL),
          page.getByText('My work').click(),
        ])
        expect(request.postDataJSON().variables.filter_isArchived).toBeTruthy()
        expect(request.postDataJSON().variables.filter_phase).toEqual(AnnotationPhaseType.Verification)
        expect(request.postDataJSON().variables.filter_ownerID).toEqual(+USERS.annotator.id)
        expect(request.postDataJSON().variables.filter_annotatorID).toBeFalsy() // Updated
        expect(request.postDataJSON().variables.search).toEqual('Test campaign')
        const params = new URLSearchParams('?' + page.url().split('?')[1])
        expect(JSON.parse(params.get('filter_isArchived'))).toBeTruthy()
        expect(params.get('filter_phase')).toEqual(AnnotationPhaseType.Verification)
        expect(JSON.parse(params.get('filter_ownerID'))).toEqual(+USERS.annotator.id)
        expect(JSON.parse(params.get('filter_annotatorID'))).toBeFalsy() // Updated
        expect(params.get('search')).toEqual('Test campaign')
      })
    }),

  accessCampaignCreation: ({ as, tag }: Pick<Params, 'as' | 'tag'>) =>
    test(`Access campaign creation ${ as }`, { tag }, async ({ page }) => {
      await interceptRequests(page, { getCurrentUser: as })
      await test.step(`Navigate`, () => page.campaigns.go({ as }));

      await test.step('Access campaign creation', async () => {
        await page.campaigns.createCampaignButton.click()
        await page.waitForURL(`/app/annotation-campaign/new`)
      })
    }),
}
test.describe('[Campaign list]', () => {
  const as: UserType = 'annotator'

  TEST.handleEmptyState({ as, tag: essentialTag })

  TEST.displayCampaigns({ as, tag: essentialTag })

  TEST.filterCampaigns({ as, tag: essentialTag })

  TEST.accessCampaignCreation({ as, tag: essentialTag })

})
