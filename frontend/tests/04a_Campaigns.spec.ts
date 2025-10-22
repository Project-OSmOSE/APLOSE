import { ESSENTIAL, expect, test } from './utils';
import { AnnotationPhaseType } from '../src/api/types.gql-generated';
import { gqlURL, interceptRequests, USERS } from './utils/mock';


test.describe('Annotator', () => {
  test('Handle empty states', ESSENTIAL, async ({ page }) => {
    await interceptRequests(page, {
      getCurrentUser: 'annotator',
      listCampaignsAndPhases: 'empty',
    })
    await page.campaign.list.go('annotator');
    await expect(page.campaign.list.card).not.toBeVisible();
    await expect(page.getByText('No campaigns')).toBeVisible();
  })

  test('Can see campaigns and access first', ESSENTIAL, async ({ page }) => {
    await interceptRequests(page, {
      getCurrentUser: 'annotator',
    })
    await page.campaign.list.go('annotator');
    await page.campaign.list.card.click()
    await page.waitForURL(`/app/annotation-campaign/1/phase/Annotation`)
  })

  test('Can access campaign creation', ESSENTIAL, async ({ page }) => {
    await interceptRequests(page, {
      getCurrentUser: 'annotator',
    })
    await page.campaign.list.go('annotator');
    await page.campaign.list.createButton.click()
    await page.waitForURL(`/app/annotation-campaign/new`)
  })

  test('Can filter campaigns', async ({ page }) => {
    await interceptRequests(page, {
      getCurrentUser: 'annotator',
    })
    await page.campaign.list.go('annotator');
    await expect(page.getByText('Archived: False')).toBeVisible() // Filters are initialized

    await test.step('Search', async () => {
      const [ request ] = await Promise.all([
        page.waitForRequest(gqlURL),
        page.campaign.list.search('Test campaign'),
      ])
      expect(request.postDataJSON().variables.isArchived).toBeFalsy()
      expect(request.postDataJSON().variables.phase).toBeFalsy()
      expect(request.postDataJSON().variables.ownerID).toBeFalsy()
      expect(request.postDataJSON().variables.annotatorID).toEqual(+USERS.annotator.id)
      expect(request.postDataJSON().variables.search).toEqual('Test campaign') // Updated
      const params = new URLSearchParams('?' + page.url().split('?')[1])
      expect(JSON.parse(params.get('isArchived'))).toBeFalsy()
      expect(JSON.parse(params.get('phase'))).toBeFalsy()
      expect(JSON.parse(params.get('ownerID'))).toBeFalsy()
      expect(JSON.parse(params.get('annotatorID'))).toEqual(+USERS.annotator.id)
      expect(params.get('search')).toEqual('Test campaign') // Updated
    })

    await test.step('Add Only archived filter', async () => {
      const [ request ] = await Promise.all([
        page.waitForRequest(gqlURL),
        page.getByText('Archived: False').click(),
      ])

      expect(request.postDataJSON().variables.isArchived).toBeTruthy() // Updated
      expect(request.postDataJSON().variables.phase).toBeFalsy()
      expect(request.postDataJSON().variables.ownerID).toBeFalsy()
      expect(request.postDataJSON().variables.annotatorID).toEqual(+USERS.annotator.id)
      expect(request.postDataJSON().variables.search).toEqual('Test campaign')
      const params = new URLSearchParams('?' + page.url().split('?')[1])
      expect(JSON.parse(params.get('isArchived'))).toBeTruthy() // Updated
      expect(JSON.parse(params.get('phase'))).toBeFalsy()
      expect(JSON.parse(params.get('ownerID'))).toBeFalsy()
      expect(JSON.parse(params.get('annotatorID'))).toEqual(+USERS.annotator.id)
      expect(params.get('search')).toEqual('Test campaign')
    })


    await test.step('Add Has verification filter', async () => {
      const [ request ] = await Promise.all([
        page.waitForRequest(gqlURL),
        page.getByText('Has verification').click(),
      ])
      expect(request.postDataJSON().variables.isArchived).toBeTruthy()
      expect(request.postDataJSON().variables.phase).toEqual(AnnotationPhaseType.Verification)
      expect(request.postDataJSON().variables.ownerID).toBeFalsy()
      expect(request.postDataJSON().variables.annotatorID).toEqual(+USERS.annotator.id)
      expect(request.postDataJSON().variables.search).toEqual('Test campaign')
      const params = new URLSearchParams('?' + page.url().split('?')[1])
      expect(JSON.parse(params.get('isArchived'))).toBeTruthy()
      expect(params.get('phase')).toEqual(AnnotationPhaseType.Verification) // Updated
      expect(JSON.parse(params.get('ownerID'))).toBeFalsy()
      expect(JSON.parse(params.get('annotatorID'))).toEqual(+USERS.annotator.id)
      expect(params.get('search')).toEqual('Test campaign')
    })

    await test.step('Add Owned campaigns filter', async () => {
      const [ request ] = await Promise.all([
        page.waitForRequest(gqlURL),
        page.getByText('Owned campaigns').click(),
      ])
      expect(request.postDataJSON().variables.isArchived).toBeTruthy()
      expect(request.postDataJSON().variables.phase).toEqual(AnnotationPhaseType.Verification)
      expect(request.postDataJSON().variables.ownerID).toEqual(+USERS.annotator.id) // Updated
      expect(request.postDataJSON().variables.annotatorID).toEqual(+USERS.annotator.id)
      expect(request.postDataJSON().variables.search).toEqual('Test campaign')
      const params = new URLSearchParams('?' + page.url().split('?')[1])
      expect(JSON.parse(params.get('isArchived'))).toBeTruthy()
      expect(params.get('phase')).toEqual(AnnotationPhaseType.Verification)
      expect(JSON.parse(params.get('ownerID'))).toEqual(+USERS.annotator.id) // Updated
      expect(JSON.parse(params.get('annotatorID'))).toEqual(+USERS.annotator.id)
      expect(params.get('search')).toEqual('Test campaign')
    })

    await test.step('Remove My work filter', async () => {
      const [ request ] = await Promise.all([
        page.waitForRequest(gqlURL),
        page.getByText('My work').click(),
      ])
      expect(request.postDataJSON().variables.isArchived).toBeTruthy()
      expect(request.postDataJSON().variables.phase).toEqual(AnnotationPhaseType.Verification)
      expect(request.postDataJSON().variables.ownerID).toEqual(+USERS.annotator.id)
      expect(request.postDataJSON().variables.annotatorID).toBeFalsy() // Updated
      expect(request.postDataJSON().variables.search).toEqual('Test campaign')
      const params = new URLSearchParams('?' + page.url().split('?')[1])
      expect(JSON.parse(params.get('isArchived'))).toBeTruthy()
      expect(params.get('phase')).toEqual(AnnotationPhaseType.Verification)
      expect(JSON.parse(params.get('ownerID'))).toEqual(+USERS.annotator.id)
      expect(JSON.parse(params.get('annotatorID'))).toBeFalsy() // Updated
      expect(params.get('search')).toEqual('Test campaign')
    })
  })
})
