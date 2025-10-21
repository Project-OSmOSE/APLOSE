import { Page, test } from '@playwright/test';
import { Modal, UI } from '../services';
import { UserType } from '../../fixtures';
import { DatasetPage } from './dataset';
import { GqlMockType } from '../mock';

export class DatasetDetailPage {

  constructor(public page: Page,
              private datasetList = new DatasetPage(page),
              public ui = new UI(page)) {
  }

  async go(as: UserType) {
    await test.step('Navigate to Dataset detail', async () => {
      await this.datasetList.go(as);
      await this.page.getByText('Test dataset').click()
    });
  }

  async openImportModal(type: GqlMockType = 'filled'): Promise<AnalysisImportModal> {
    return AnalysisImportModal.get(this)
  }

}

export class AnalysisImportModal {

  static async get(page: DatasetDetailPage): Promise<AnalysisImportModal> {
    return new AnalysisImportModal(await page.ui.openModal({ name: 'Import analysis' }))
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

  public async importAnalysis() {
    await this.modal.locator('.download-analysis').first().click()
  }
}