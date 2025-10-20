import { Page, test } from '@playwright/test';
import { Modal, UI } from '../services';
import { UserType } from '../../fixtures';
import { CampaignListPage } from './campaign-list';
import { interceptGQL, MockType } from '../mock';
import { expect } from '../index';

export class DatasetPage {

  constructor(public page: Page,
              private campaignList = new CampaignListPage(page),
              public ui = new UI(page)) {
  }

  async go(as: UserType, type: MockType = 'filled') {
    await test.step('Navigate to Datasets', async () => {
      await interceptGQL(this.page, {
        listDatasets: type,
      })
      await this.campaignList.go(as);
      await Promise.all([
        this.page.waitForResponse('**/graphql'),
        this.page.getByRole('button', { name: 'Datasets' }).click(),
      ])
      await expect(this.page.getByRole('heading', { name: 'Datasets' })).toBeVisible();
    });
  }

  async openImportModal(type: MockType = 'filled'): Promise<DatasetImportModal> {
    await interceptGQL(this.page, {
      listAvailableDatasetsForImport: type,
    })
    return DatasetImportModal.get(this)
  }

}

export class DatasetImportModal {

  static async get(page: DatasetPage): Promise<DatasetImportModal> {
    return new DatasetImportModal(await page.ui.openModal({ name: 'Import dataset' }))
  }

  get locator() {
    return this.modal
  }

  constructor(private modal: Modal) {
  }

  public async search(text: string) {
    await this.modal.getByPlaceholder('Search').fill(text)
  }

  public async close() {
    await this.modal.close();
  }

  public async importDataset() {
    await interceptGQL(this.modal.page(), { importDataset: 'empty' })
    await this.modal.locator('.download-dataset').first().click()
  }

  public async importAnalysis() {
    await interceptGQL(this.modal.page(), { importDataset: 'empty' })
    await this.modal.locator('.download-analysis').first().click()
  }
}