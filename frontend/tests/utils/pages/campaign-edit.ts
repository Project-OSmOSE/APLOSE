import { Page, test } from '@playwright/test';
import { dataset, UserType } from '../mock/types';
import { PhaseDetailPage } from './phase-detail';

export class CampaignEditPage {

  get firstIndexInputs() {
    return this.page.getByPlaceholder('1')
  }


  get lastIndexInputs() {
    return this.page.getByPlaceholder((dataset.spectrogramCount).toString())
  }

  constructor(private page: Page,
              private detail = new PhaseDetailPage(page)) {
  }

  async go(as: UserType) {
    await test.step('Navigate to Campaign detail', async () => {
      await this.detail.go({ as })
      await this.detail.manageButton.click();
    });
  }
}