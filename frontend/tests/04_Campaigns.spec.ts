import { ESSENTIAL, expect, test } from './utils';
import { CAMPAIGN } from "./fixtures";


test.describe('Annotator', () => {
  test('Handle empty states', ESSENTIAL, async ({ page }) => {
    await page.campaign.list.go('annotator', 'empty');
    await expect(page.campaign.list.card).not.toBeVisible();
    await expect(page.getByText('No campaigns')).toBeVisible();
  })

  test('Can see campaigns and access first', ESSENTIAL, async ({ page }) => {
    await page.campaign.list.go('annotator');
    await page.campaign.list.card.click()
    await page.waitForURL(`/app/annotation-campaign/1/phase/Annotation`)
  })

  test('Can access campaign creation', ESSENTIAL, async ({ page }) => {
    await page.campaign.list.go('annotator');
    await page.campaign.list.createButton.click()
    await page.waitForURL(`/app/annotation-campaign/new`)
  })

  test('Can filter campaigns', async ({ page }) => {
    await page.campaign.list.go('annotator');

    await test.step('Search', async () => {
      await page.mock.campaigns()
      await Promise.all([
        page.waitForRequest(/.*\/api\/annotation-campaign\/?\?.*search/g),
        page.campaign.list.search(CAMPAIGN.name),
      ])
    })

    // TODO: fix following step
    //  Not working because the request has already been made and the view recover it from RTK cache
    //  await test.step('Remove My work filter', async () => {
    //    await page.mock.campaigns()
    //    await Promise.all([
    //      page.waitForRequest(/\/api\/annotation-campaign\/\?((?!annotator).)*$/g),
    //      page.getByText('My work').click()
    //    ])
    //  })

    await test.step('Add Only archived filter', async () => {
      await page.mock.campaigns()
      await Promise.all([
        page.waitForRequest(/\/api\/annotation-campaign\/x?\?.*archive__isnull=false.*$/g),
        page.getByText('Archived: False').click()
      ])
    })

    await test.step('Add Campaign mode to Annotation filter', async () => {
      await page.mock.campaigns()
      await Promise.all([
        page.waitForRequest(/\/api\/annotation-campaign\/?\?.*?phases__phase=A/g),
        page.getByText('Campaign mode filter').click()
      ])
    })

    await test.step('Change Campaign mode to Verification filter', async () => {
      await page.mock.campaigns()
      await Promise.all([
        page.waitForRequest(/\/api\/annotation-campaign\/?\?.*?phases__phase=V/g),
        page.getByText('Campaign mode filter').click()
      ])
    })

    await test.step('Add Owned campaigns filter', async () => {
      await page.mock.campaigns()
      await Promise.all([
        page.waitForRequest(/\/api\/annotation-campaign\/?\?.*?owner/g),
        page.getByText('Owned campaigns').click()
      ])
    })
  })
})
