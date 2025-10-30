import { Page, test } from '@playwright/test';
import { UserType } from '../../fixtures';
import { CampaignDetailPage } from './campaign-detail';
import { dataset } from '../mock/dataset';

export class CampaignEditPage {

  get firstIndexInputs() {
    return this.page.getByPlaceholder('1')
  }


  get lastIndexInputs() {
    return this.page.getByPlaceholder((dataset.filesCount).toString())
  }

  constructor(private page: Page,
              private detail = new CampaignDetailPage(page)) {
  }

  async go(as: UserType) {
    await test.step('Navigate to Campaign detail', async () => {
      await this.detail.go(as)
      await this.detail.manageButton.click();
    });
  }
}