import { AnnotationPhaseType } from '../src/api/types.gql-generated';
import { essentialTag, expect, test } from './utils';
import { dateToString } from '../src/service/function';
import { gqlURL, interceptRequests } from './utils/mock';
import { campaign, confidenceSet, dataset, LABELS, labelSet, spectrogramAnalysis, USERS } from './utils/mock/types';
import type { GqlMutation } from './utils/mock/_gql';
import type { Params } from './utils/types';


// Utils

const TEST = {

  handleEmptyState: ({ as, tag }: Pick<Params, 'as' | 'tag'>) =>
    test(`Handle empty state as ${ as }`, { tag }, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: as,
        getCampaign: as == 'annotator' ? 'default' : 'manager',
        listSpectrogramAnalysis: 'empty',
        getAnnotationPhase: 'empty',
        listAnnotationTask: 'empty',
      })
      await test.step(`Navigate`, async () => {
        await page.campaignDetail.go({ as })
        await page.campaignDetail.informationTab.click()
      });

      await test.step('Display message', () =>
        expect(page.getByText('No spectrogram analysis')).toBeVisible())
    }),

  displayCampaign: ({ as, tag }: Pick<Params, 'as' | 'tag'>) =>
    test(`Display campaign as ${ as }`, { tag }, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: as,
        getCampaign: as == 'annotator' ? 'default' : 'manager',
      })
      await test.step(`Navigate`, () => page.campaignDetail.go({ as }));

      await test.step('Display global information', async () => {
        await expect(page.getByRole('heading', { name: campaign.name })).toBeVisible();
        await expect(page.getByText(`Created on ${ dateToString(campaign.createdAt) } by ${ USERS.creator.displayName }`)).toBeVisible();
        await expect(page.getByText(campaign.description)).toBeVisible();
        await expect(page.getByText(dateToString(campaign.deadline))).toBeVisible();
        await expect(page.getByRole('button', { name: AnnotationPhaseType.Annotation, exact: true })).toBeVisible();
      })

      await test.step('Can copy owner email', async () => {
        await page.locator('p').filter({ hasText: 'Created on ' }).getByRole('button').click()
        await expect(page.getByText(`${ USERS.creator.displayName } email address`)).toBeVisible();
      })

      await test.step('Display data', async () => {
        await expect(page.getByText(spectrogramAnalysis.name)).toBeVisible()
      })

      await test.step('Display label set', async () => {
        await expect(page.getByText(labelSet.name)).toBeVisible()
        await page.campaignDetail.labelModal.button.click()
        await expect(page.campaignDetail.labelModal.modal.getByText(labelSet.name)).toBeVisible()

        await expect(page.campaignDetail.labelModal.modal.getByText(LABELS.classic.name)).toBeVisible()
        await expect(page.campaignDetail.labelModal.modal.getByText(LABELS.featured.name)).toBeVisible()

        expect(await page.campaignDetail.labelModal.hasAcousticFeatures(LABELS.classic)).toBeFalsy()
        expect(await page.campaignDetail.labelModal.hasAcousticFeatures(LABELS.featured)).toBeTruthy()

        await page.campaignDetail.labelModal.closeButton.click()
      })

      await test.step('Display confidence set', () =>
        expect(page.getByText(confidenceSet.name)).toBeVisible())
    }),

  canAccessDataset: ({ as, tag }: Pick<Params, 'as' | 'tag'>) =>
    test(`Can access dataset as ${ as }`, { tag }, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: as,
        getCampaign: as == 'annotator' ? 'default' : 'manager',
      })
      await test.step(`Navigate`, () => page.campaignDetail.go({ as }));

      await test.step('Access dataset', async () => {
        await page.getByRole('button', { name: dataset.name }).click()
        await page.waitForURL(`/app/dataset/${ dataset.id }/`)
      })
    }),

  cannotUpdateCampaign: ({ as, tag }: Pick<Params, 'as' | 'tag'>) =>
    test(`Cannot update campaign as ${ as }`, { tag }, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: as,
        getCampaign: as == 'annotator' ? 'default' : 'manager',
      })
      await test.step(`Navigate`, () => page.campaignDetail.go({ as }));

      await test.step('Cannot archive', async () => {
        await expect(page.campaignDetail.archiveButton).not.toBeVisible();
      })

      await test.step('Cannot update labels with features', async () => {
        await page.campaignDetail.labelModal.button.click()
        await expect(page.campaignDetail.labelModal.updateButton).not.toBeVisible();
        await page.campaignDetail.labelModal.closeButton.click()
      })
    }),

  canArchiveCampaign: ({ as, tag }: Pick<Params, 'as' | 'tag'>) =>
    test(`Can archive campaign as ${ as }`, { tag }, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: as,
        getCampaign: as == 'annotator' ? 'default' : 'manager',
      })
      await test.step(`Navigate`, () => page.campaignDetail.go({ as }));

      await test.step('Archive', async () => {
        await page.campaignDetail.archiveButton.click();

        const alert = page.getByRole('dialog').first()
        await expect(alert).toBeVisible();
        const [ request ] = await Promise.all([
          page.waitForRequest(gqlURL),
          alert.getByRole('button', { name: 'Archive' }).click(),
        ])
        const data = await request.postDataJSON();
        expect(data.operationName).toBe('archiveCampaign' as GqlMutation);
        expect(data.variables.id).toEqual(campaign.id)
      })
    }),

  canUpdateFeaturedLabels: ({ as, tag }: Pick<Params, 'as' | 'tag'>) =>
    test(`Can update featured labels as ${ as }`, { tag }, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: as,
        getCampaign: as == 'annotator' ? 'default' : 'manager',
      })
      await test.step(`Navigate`, () => page.campaignDetail.go({ as }));

      await test.step('Update featured labels', async () => {
        await page.campaignDetail.labelModal.button.click()
        await page.campaignDetail.labelModal.updateButton.click();

        expect(await page.campaignDetail.labelModal.hasAcousticFeatures(LABELS.classic)).toBeFalsy()
        expect(await page.campaignDetail.labelModal.hasAcousticFeatures(LABELS.featured)).toBeTruthy()

        await page.campaignDetail.labelModal.getLabelCheckbox(LABELS.classic).click()
        await page.campaignDetail.labelModal.getLabelCheckbox(LABELS.featured).click()

        const [ request ] = await Promise.all([
          page.waitForRequest(gqlURL),
          page.campaignDetail.labelModal.saveButton.click(),
        ])
        const data = await request.postDataJSON();
        expect(data.operationName).toEqual('updateCampaignFeaturedLabels' as GqlMutation);
        expect(data.variables.id).toEqual(campaign.id)
        expect(data.variables.labelsWithAcousticFeatures).toEqual([ LABELS.classic.id ])
      })
    }),
}

// Tests
test.describe('/annotation-campaign/:campaignID', () => {

  TEST.handleEmptyState({ as: 'annotator', tag: essentialTag })
  TEST.handleEmptyState({ as: 'creator' })

  TEST.displayCampaign({ as: 'annotator', tag: essentialTag })

  TEST.canAccessDataset({ as: 'annotator', tag: essentialTag })

  TEST.cannotUpdateCampaign({ as: 'annotator', tag: essentialTag })

  TEST.canArchiveCampaign({ as: 'creator', tag: essentialTag })
  TEST.canArchiveCampaign({ as: 'staff', tag: essentialTag })
  TEST.canArchiveCampaign({ as: 'superuser' })

  TEST.canUpdateFeaturedLabels({ as: 'creator', tag: essentialTag })
  TEST.canUpdateFeaturedLabels({ as: 'staff' })
  TEST.canUpdateFeaturedLabels({ as: 'superuser' })

})
