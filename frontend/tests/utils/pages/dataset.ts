import { Page, test } from '@playwright/test';
import { Mock, Modal, UI } from '../services';
import { UserType } from '../../fixtures';
import { CampaignListPage } from './campaign-list';

export class DatasetPage {

  constructor(public page: Page,
              private campaignList = new CampaignListPage(page),
              private mock = new Mock(page),
              public ui = new UI(page)) {
  }

  async go(as: UserType) {
    await test.step('Navigate to Datasets', async () => {
      await this.campaignList.go(as);
      await this.page.getByRole('button', { name: 'Datasets' }).click()
    });
  }

  async openImportModal(): Promise<DatasetImportModal> {
    return DatasetImportModal.get(this)
  }

}

export class DatasetImportModal {

  static async get(page: DatasetPage): Promise<DatasetImportModal> {
    return new DatasetImportModal(
      page.page,
      page.ui,
      await page.ui.openModal({ name: 'Import dataset' })
    )
  }

  get locator() {
    return this.modal
  }

  constructor(private page: Page,
              private ui: UI,
              private modal: Modal) {
  }

  public async search(text: string) {
    await this.modal.getByPlaceholder('Search').fill(text)
  }

  public async close() {
    await this.modal.close();
  }
}