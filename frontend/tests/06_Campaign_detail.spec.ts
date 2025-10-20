import { API_URL, ESSENTIAL, expect, Page, Request, test } from './utils';
import { CAMPAIGN, CAMPAIGN_PHASE, CONFIDENCE, LABEL, USERS } from './fixtures';
import { LabelModal } from './utils/pages';

import { dateToString } from "../src/service/function";
import { ID, Optionable } from "../src/service/type";
import { AnnotationCampaign } from "../src/service/types";

type PatchAnnotationCampaign = Optionable<Pick<AnnotationCampaign,
  'labels_with_acoustic_features' | 'label_set' | 'confidence_set' | 'allow_point_annotation'
>> & { id: ID }


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
    await page.campaign.detail.go('annotator');
    await page.getByRole('button', { name: 'Information' }).click();
    await expect(page.getByRole('heading', { name: CAMPAIGN.name })).toBeVisible();
    await expect(page.getByText(`Created on ${ dateToString(CAMPAIGN.created_at) } by ${ CAMPAIGN.owner.display_name }`)).toBeVisible();
    await expect(page.getByText(CAMPAIGN.desc)).toBeVisible();
    await expect(page.getByText(dateToString(CAMPAIGN.deadline))).toBeVisible();
    await expect(page.getByRole('button', { name: CAMPAIGN_PHASE.phase, exact: true })).toBeVisible();

    await test.step('Can copy owner email', async () => {
      await page.locator('p').filter({ hasText: 'Created on ' }).getByRole('button').click()
      await expect(page.getByText(`${ USERS.creator.display_name } email address`)).toBeVisible();
    })

    await test.step('Cannot archive', async () => {
      await expect(page.campaign.detail.archiveButton).not.toBeVisible();
    })

    await test.step('Cannot import annotations', async () => {
      await expect(page.campaign.detail.importAnnotationsButton).not.toBeVisible();
    })
  })

  test('Label & Confidence', async ({ page }) => {
    await page.campaign.detail.go('annotator');
    await page.getByRole('button', { name: 'Information' }).click();
    await test.step('See set names', async () => {
      await expect(page.getByText(LABEL.set.name)).toBeVisible();
      await expect(page.getByText(CONFIDENCE.set.name)).toBeVisible();
    })

    const modal = await page.campaign.detail.openLabelModal();
    await STEP.checkLabelState(modal, LABEL.classic, false);
    await STEP.checkLabelState(modal, LABEL.withFeatures, true);

    await test.step('Cannot update', async () => {
      await expect(modal.updateButton).not.toBeVisible();
    })
  })

  test('Data', async ({ page }) => {
    await page.campaign.detail.go('annotator');
    await page.getByRole('button', { name: 'Information' }).click();
    await expect(page.getByText("Test analysis")).toBeVisible()
    await page.getByRole("button", { name: "Test dataset" }).click()
    await page.waitForURL(`/app/dataset/1/`)
  })

  test('Empty', ESSENTIAL, async ({ page }) => {
    await page.campaign.detail.go('annotator', { empty: true });
    await page.getByRole('button', { name: 'Information' }).click();
    await expect(page.getByText('No spectrogram analysis')).toBeVisible();
  })
})

test.describe('Campaign creator', () => {

  test('Can archive', async ({ page }) => {
    await page.campaign.detail.go('creator');
    await page.getByRole('button', { name: 'Information' }).click();
    await page.campaign.detail.archiveButton.click();
    const alert = page.getByRole('dialog').first()
    await expect(alert).toBeVisible();
    await Promise.all([
      page.waitForRequest(API_URL.campaign.archive),
      alert.getByRole('button', { name: 'Archive' }).click(),
    ])
  })

  test('Can update labels with features', async ({ page }) => {
    await page.campaign.detail.go('creator');
    await page.getByRole('button', { name: 'Information' }).click();
    const modal = await page.campaign.detail.openLabelModal()

    await test.step('Check current state', async () => {
      await STEP.checkLabelState(modal, LABEL.classic, false);
      await STEP.checkLabelState(modal, LABEL.withFeatures, true);
    })

    await test.step('Update state', async () => {
      await test.step('Enable update', async () => {
        const button = modal.getByRole('button', { name: 'Update' })
        await expect(button).toBeVisible();
        await button.click();
      })

      await modal.getCheckbox(LABEL.classic).click()
      await modal.getCheckbox(LABEL.withFeatures).click()

      const request: Request = await test.step('Confirm update', async () => {
        const button = modal.getByRole('button', { name: 'Save' })
        await expect(button).toBeVisible();
        const [ request ] = await Promise.all([
          page.waitForRequest(/\/api\/annotation-campaign\/-?\d\/?/g),
          button.click(),
        ])
        return request;
      })

      await test.step('Check request', async () => {
        const data = await request.postDataJSON();
        const expected: Partial<PatchAnnotationCampaign> = {
          labels_with_acoustic_features: [ LABEL.classic ]
        }
        expect(data).toEqual(expected);
      })
    })
  })

  test('Empty', ESSENTIAL, async ({ page }) => {
    await page.campaign.detail.go('creator', { empty: true });
    await page.getByRole('button', { name: 'Information' }).click();
    await expect(page.getByText('No spectrogram analysis')).toBeVisible();
  })
})

test('Staff', async ({ page }) => {
  await page.campaign.detail.go('staff', { phase: 'Verification' });
  await page.getByRole('button', { name: 'Information' }).click();

  await STEP.accessArchive(page)
  await STEP.accessLabelUpdate(page)
})

test('Superuser', ESSENTIAL, async ({ page }) => {
  await page.campaign.detail.go('superuser', { phase: 'Verification' });
  await page.getByRole('button', { name: 'Information' }).click();

  await STEP.accessArchive(page)
  await STEP.accessLabelUpdate(page)
})
