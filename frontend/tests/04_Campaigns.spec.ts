import { ESSENTIAL, expect, test } from './utils';
import { AnnotationPhaseType } from '../src/api';
import { interceptRequests } from './utils/mock';


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
      await page.mock.campaigns()
      const [ request ] = await Promise.all([
        page.waitForRequest('**/graphql'),
        page.campaign.list.search('Test campaign'),
      ])
      expect(request.postDataJSON().variables.search).toEqual('Test campaign')
    })

    // TODO: fix following step
    //  Not working because the request has already been made and the view recover it from RTK cache
    await test.step('Remove My work filter', async () => {
      await page.mock.campaigns()
      const [ request ] = await Promise.all([
        page.waitForRequest('**/graphql'),
        page.getByText('My work').click(),
      ])
      expect(request.postDataJSON().variables.annotatorID).toEqual(undefined)
    })

    await test.step('Add Only archived filter', async () => {
      await page.mock.campaigns()
      const [ request ] = await Promise.all([
        page.waitForRequest('**/graphql'),
        page.getByText('Archived: False').click(),
      ])
      expect(request.postDataJSON().variables.isArchived).toBeTruthy()
    })

    await test.step('Add Has verification filter', async () => {
      await page.mock.campaigns()
      const [ request ] = await Promise.all([
        page.waitForRequest('**/graphql'),
        page.getByText('Has verification').click(),
      ])
      expect(request.postDataJSON().variables.phase).toEqual(AnnotationPhaseType.Verification)
    })

    await test.step('Add Owned campaigns filter', async () => {
      await page.mock.campaigns()
      const [ request ] = await Promise.all([
        page.waitForRequest('**/graphql'),
        page.getByText('Owned campaigns').click(),
      ])
      expect(request.postDataJSON().variables.ownerPk).toEqual(1)
    })
  })
})
