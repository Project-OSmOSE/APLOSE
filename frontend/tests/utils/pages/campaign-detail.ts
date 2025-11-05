import { Locator, Page } from '@playwright/test';
import { Modal, UI } from '../services';
import { type Label, labelSet } from '../mock/types';
import { CampaignListPage } from './campaign-list';
import type { Params } from '../types';
import { LABEL } from '../../fixtures';

type ProgressModalExtend = {
  get downloadResultsButton(): Locator;
  get downloadStatusButton(): Locator;
}

export type ProgressModal = Modal & ProgressModalExtend

export class CampaignDetailPage {

  get informationTab(): Locator {
    return this.page.getByRole('button', { name: 'Information' });
  }

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
              public labelModal = new LabelModal(page),
              private ui = new UI(page)) {
  }

  async go({ as }: Pick<Params, 'as'>) {
    await this.list.go({ as })
    await this.list.card.click();
  }

  async searchFile(text: string | undefined) {
    if (text) await this.page.getByRole('search').locator('input').fill(text)
    else await this.page.getByRole('search').locator('input').clear()
    await this.page.keyboard.press('Enter')
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

class LabelModal {

  get button(): Locator {
    return this.page.getByRole('button', { name: labelSet.name });
  }

  get modal(): Locator {
    return this.page.getByRole('dialog').first();
  }

  get updateButton(): Locator {
    return this.modal.getByRole('button', { name: 'Update' });
  }

  get saveButton(): Locator {
    return this.modal.getByRole('button', { name: 'Save' });
  }

  get closeButton(): Locator {
    return this.modal.getByTestId('close-modal');
  }

  constructor(private page: Page) {
  }

  getLabelCheckbox(label: Label): Locator {
    return this.modal.locator('.table-content')
      .nth((LABEL.set.labels.indexOf(label.name) + 1) * 2 - 1)
      .locator('ion-checkbox')
  }

  async hasAcousticFeatures(label: Label): Promise<boolean> {
    return await this.getLabelCheckbox(label).getAttribute('checked') == 'true'
  }
}
