import { Locator, Page, test } from '@playwright/test';
import { Modal, UI } from '../services';
import { labelSet, UserType } from '../mock/types';
import { CampaignListPage } from './campaign-list';

type LabelModalExtend = {
  getCheckbox: (text: string) => Locator;
  get updateButton(): Locator;
}

type ProgressModalExtend = {
  get downloadResultsButton(): Locator;
  get downloadStatusButton(): Locator;
}

export type LabelModal = Modal & LabelModalExtend
export type ProgressModal = Modal & ProgressModalExtend

export class CampaignDetailPage {

  get archiveButton(): Locator {
    return this.page.getByRole('button', { name: 'Archive' });
  }

  get importAnnotationsButton(): Locator {
    return this.page.locator('button[aria-label=Import]');
  }

  get resumeButton(): Locator {
    return this.page.locator('button[aria-label=Resume]');
  }

  get manageButton(): Locator {
    return this.page.locator('button[aria-label=Manage]');
  }

  constructor(private page: Page,
              private list = new CampaignListPage(page),
              private ui = new UI(page)) {
  }

  async go(as: UserType) {
    await test.step('Navigate to Campaign detail', async () => {
      await this.list.go(as)
      await this.list.card.click();
    });
  }

  async searchFile(text: string | undefined) {
    if (text) await this.page.getByRole('search').locator('input').fill(text)
    else await this.page.getByRole('search').locator('input').clear()
    await this.page.keyboard.press('Enter')
  }

  async openLabelModal(): Promise<LabelModal> {
    const modal = await this.ui.openModal({ name: labelSet.name })
    const ui = this.ui;
    return Object.assign(modal, {
      getCheckbox(label: string) {
        return ui.getFeatureCheckboxForLabel(label, modal)
      },
      get updateButton(): Locator {
        return modal.getByRole('button', { name: 'Update' });
      },
    } as LabelModalExtend);
  }

  async openProgressModal(): Promise<ProgressModal> {
    const modal = await this.ui.openModal({ ariaLabel: 'Progress' })
    return Object.assign(modal, {
      get downloadResultsButton(): Locator {
        return modal.getByRole('button', { name: 'Results' })
      },
      get downloadStatusButton(): Locator {
        return modal.getByRole('button', { name: 'Status' })
      },
    } as ProgressModalExtend);
  }


}