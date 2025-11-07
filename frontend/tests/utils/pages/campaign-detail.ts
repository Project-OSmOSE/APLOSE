import { Locator, Page } from '@playwright/test';
import { type Label, labelSet } from '../mock/types';
import { CampaignListPage } from './campaign-list';
import type { Params } from '../types';
import { LABEL } from '../../fixtures';

export class CampaignDetailPage {

  get informationTab(): Locator {
    return this.page.getByRole('button', { name: 'Information' });
  }

  get archiveButton(): Locator {
    return this.page.getByRole('button', { name: 'Archive' });
  }

  constructor(private page: Page,
              private list = new CampaignListPage(page),
              public labelModal = new LabelModal(page)) {
  }

  async go({ as }: Pick<Params, 'as'>) {
    await this.list.go({ as })
    await this.list.card.click();
    await this.informationTab.click()
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
