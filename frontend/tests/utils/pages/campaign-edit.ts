import { Page, test } from '@playwright/test';
import { DATASET_FILES_COUNT, UserType } from '../mock/types';
import { CampaignDetailPage } from './campaign-detail';

export class CampaignEditPage {

  get firstIndexInputs() {
    return this.page.getByPlaceholder('1')
  }


  get lastIndexInputs() {
    return this.page.getByPlaceholder((DATASET_FILES_COUNT).toString())
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