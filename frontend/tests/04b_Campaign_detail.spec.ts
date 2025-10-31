import { AnnotationPhaseType } from '../src/api/types.gql-generated';
import { ESSENTIAL, expect, Page, Request, test } from './utils';
import { LabelModal } from './utils/pages';
import { dateToString } from '../src/service/function';
import { gqlURL, interceptRequests } from './utils/mock';
import { campaign, confidenceSet, dataset, LABELS, labelSet, spectrogramAnalysis, USERS } from './utils/mock/types';
import type { GqlMutation } from './utils/mock/_gql';


// Utils

const STEP = {
  checkLabelState: (modal: LabelModal, label: string, state: boolean) => test.step(`${ label } is ${ state ? '' : 'un' }checked`, async () => {
    await expect(modal.getByText(label)).toBeVisible()
    await expect(modal.getCheckbox(label)).toHaveAttribute('checked', state ? 'true' : 'false');
  }),
  accessArchive: (page: Page) => test.step('Access archive', () => expect(page.campaign.detail.archiveButton).toBeEnabled()),
  accessLabelUpdate: (page: Page) => test.step('Access label set update', async () => {
    const modal = await page.campaign.detail.openLabelModal();
    await expect(modal.updateButton).toBeEnabled();
    await modal.close()
  }),
}

// Tests

test.describe('Annotator', () => {

  test('Global', async ({ page }) => {
    await interceptRequests(page, {
      getCurrentUser: 'annotator',
    })
    await page.campaign.detail.go('annotator');
    await page.getByRole('button', { name: 'Information' }).click();
    await expect(page.getByRole('heading', { name: campaign.name })).toBeVisible();
    await expect(page.getByText(`Created on ${ dateToString(campaign.createdAt) } by ${ USERS.creator.displayName }`)).toBeVisible();
    await expect(page.getByText(campaign.description)).toBeVisible();
    await expect(page.getByText(dateToString(campaign.deadline))).toBeVisible();
    await expect(page.getByRole('button', { name: AnnotationPhaseType.Annotation, exact: true })).toBeVisible();

    await test.step('Can copy owner email', async () => {
      await page.locator('p').filter({ hasText: 'Created on ' }).getByRole('button').click()
      await expect(page.getByText(`${ USERS.creator.displayName } email address`)).toBeVisible();
    })

    await test.step('Cannot archive', async () => {
      await expect(page.campaign.detail.archiveButton).not.toBeVisible();
    })

    await test.step('Cannot import annotations', async () => {
      await expect(page.campaign.detail.importAnnotationsButton).not.toBeVisible();
    })
  })

  test('Label & Confidence', async ({ page }) => {
    await interceptRequests(page, {
      getCurrentUser: 'annotator',
    })
    await page.campaign.detail.go('annotator');
    await page.getByRole('button', { name: 'Information' }).click();
    await test.step('See set names', async () => {
      await expect(page.getByText(confidenceSet.name)).toBeVisible();
    })

    const modal = await page.campaign.detail.openLabelModal();
    await expect(modal.getByText(labelSet.name)).toBeVisible();
    await STEP.checkLabelState(modal, LABELS.classic.name, false);
    await STEP.checkLabelState(modal, LABELS.featured.name, true);

    await test.step('Cannot update', async () => {
      await expect(modal.updateButton).not.toBeVisible();
    })
  })

  test('Data', async ({ page }) => {
    await interceptRequests(page, {
      getCurrentUser: 'annotator',
    })
    await page.campaign.detail.go('annotator');
    await page.getByRole('button', { name: 'Information' }).click();
    await expect(page.getByText(spectrogramAnalysis.name)).toBeVisible()
    await page.getByRole('button', { name: dataset.name }).click()
    await page.waitForURL(`/app/dataset/${ dataset.id }/`)
  })

  test('Empty', ESSENTIAL, async ({ page }) => {
    await interceptRequests(page, {
      getCurrentUser: 'annotator',
      listSpectrogramAnalysis: 'empty',
      getAnnotationPhase: 'empty',
      listAnnotationTask: 'empty',
    })
    await page.campaign.detail.go('annotator');
    await page.getByRole('button', { name: 'Information' }).click();
    await expect(page.getByText('No spectrogram analysis')).toBeVisible();
  })
})

test.describe('Campaign creator', () => {

  test('Can archive', async ({ page }) => {
    await interceptRequests(page, {
      getCurrentUser: 'creator',
      getCampaign: 'manager',
    })
    await page.campaign.detail.go('creator');
    await page.getByRole('button', { name: 'Information' }).click();
    await page.campaign.detail.archiveButton.click();
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

  test('Can update labels with features', async ({ page }) => {
    await interceptRequests(page, {
      getCurrentUser: 'creator',
      getCampaign: 'manager',
    })
    await page.campaign.detail.go('creator');
    await page.getByRole('button', { name: 'Information' }).click();
    const modal = await page.campaign.detail.openLabelModal()

    await test.step('Check current state', async () => {
      await STEP.checkLabelState(modal, LABELS.classic.name, false);
      await STEP.checkLabelState(modal, LABELS.featured.name, true);
    })

    await test.step('Update state', async () => {
      await test.step('Enable update', async () => {
        const button = modal.getByRole('button', { name: 'Update' })
        await expect(button).toBeVisible();
        await button.click();
      })

      await modal.getCheckbox(LABELS.classic.name).click()
      await modal.getCheckbox(LABELS.featured.name).click()

      const request: Request = await test.step('Confirm update', async () => {
        const button = modal.getByRole('button', { name: 'Save' })
        await expect(button).toBeVisible();
        const [ request ] = await Promise.all([
          page.waitForRequest(gqlURL),
          button.click(),
        ])
        return request;
      })

      await test.step('Check request', async () => {
        const data = await request.postDataJSON();
        expect(data.operationName).toEqual('updateCampaignFeaturedLabels' as GqlMutation);
        expect(data.variables.id).toEqual(campaign.id)
        expect(data.variables.labelsWithAcousticFeatures).toEqual([ LABELS.classic.id ])
      })
    })
  })

  test('Empty', ESSENTIAL, async ({ page }) => {
    await interceptRequests(page, {
      getCurrentUser: 'creator',
      listSpectrogramAnalysis: 'empty',
      getAnnotationPhase: 'empty',
      listAnnotationTask: 'empty',
    })
    await page.campaign.detail.go('creator');
    await page.getByRole('button', { name: 'Information' }).click();
    await expect(page.getByText('No spectrogram analysis')).toBeVisible();
  })
})

test('Staff', async ({ page }) => {
  await interceptRequests(page, {
    getCurrentUser: 'staff',
    getAnnotationPhase: AnnotationPhaseType.Verification,
    getCampaign: 'manager',
  })
  await page.campaign.detail.go('staff');
  await page.getByRole('button', { name: 'Information' }).click();

  await STEP.accessArchive(page)
  await STEP.accessLabelUpdate(page)
})

test('Superuser', ESSENTIAL, async ({ page }) => {
  await interceptRequests(page, {
    getCurrentUser: 'superuser',
    getAnnotationPhase: AnnotationPhaseType.Verification,
    getCampaign: 'manager',
  })
  await page.campaign.detail.go('superuser');
  await page.getByRole('button', { name: 'Information' }).click();

  await STEP.accessArchive(page)
  await STEP.accessLabelUpdate(page)
})
