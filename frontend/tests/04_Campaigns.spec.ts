import { ESSENTIAL, expect, interceptGQL, test } from './utils';


test.describe('Annotator', () => {

  test('Handle empty states', ESSENTIAL, async ({ page }) => {
    await page.campaign.list.go('annotator', 'empty');
    await expect(page.campaign.list.card).not.toBeVisible();
    await expect(page.getByText('No annotation campaigns')).toBeVisible();
  })

  test('Can see campaigns and access first', ESSENTIAL, async ({ page }) => {
    await page.campaign.list.go('annotator');
    await page.campaign.list.card.click()
    await page.waitForURL(`/app/annotation-campaign/1`)
  })

  test('Can access campaign creation', ESSENTIAL, async ({ page }) => {
    await page.campaign.list.go('annotator');
    await page.campaign.list.createButton.click()
    await page.waitForURL(`/app/annotation-campaign/new`)
  })

  test('Can filter campaigns', async ({ page }) => {
    await page.campaign.list.go('annotator');
    await interceptGQL(page, { getAnnotationCampaigns: 'filled' }, 0)

    await test.step('Search', async () => {
      await page.mock.campaigns()
      const [ request ] = await Promise.all([
        page.waitForRequest('**/graphql'),
        page.campaign.list.search('Test campaign'),
      ])
      expect(request.postDataJSON().variables.search).toEqual('Test campaign')
    })

    await test.step('Remove My work filter', async () => {
      await page.mock.campaigns()
      const [ request ] = await Promise.all([
        page.waitForRequest('**/graphql'),
        page.getByText('My work').click()
      ])
      expect(request.postDataJSON().variables.annotatorID).toEqual(undefined)
    })

    await test.step('Add Only archived filter', async () => {
      await page.mock.campaigns()
      const [ request ] = await Promise.all([
        page.waitForRequest('**/graphql'),
        page.getByText('Archived: False').click()
      ])
      expect(request.postDataJSON().variables.isArchived).toBeTruthy()
    })

    await test.step('Add Campaign mode to Annotation filter', async () => {
      await page.mock.campaigns()
      const [ request ] = await Promise.all([
        page.waitForRequest('**/graphql'),
        page.getByText('Campaign mode filter').click()
      ])
      expect(request.postDataJSON().variables.phase).toEqual("A")
    })

    await test.step('Change Campaign mode to Verification filter', async () => {
      await page.mock.campaigns()
      const [ request ] = await Promise.all([
        page.waitForRequest('**/graphql'),
        page.getByText('Campaign mode filter').click()
      ])
      expect(request.postDataJSON().variables.phase).toEqual("V")
    })

    await test.step('Add Owned campaigns filter', async () => {
      await page.mock.campaigns()
      const [ request ] = await Promise.all([
        page.waitForRequest('**/graphql'),
        page.getByText('Owned campaigns').click()
      ])
      expect(request.postDataJSON().variables.ownerID).toEqual(1)
    })
  })
})
