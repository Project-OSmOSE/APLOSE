import { Page, test } from '@playwright/test';
import { MockType, Modal, UI } from '../services';
import { UserType } from '../../fixtures';
import { DatasetPage } from "./dataset";
import { interceptGQL } from "../functions";

export class DatasetDetailPage {

  constructor(public page: Page,
              private datasetList = new DatasetPage(page),
              public ui = new UI(page)) {
  }

  async go(as: UserType, type: MockType = 'filled') {
    await test.step('Navigate to Dataset detail', async () => {
      await this.datasetList.go(as, 'filled');
      await interceptGQL(this.page, {
        getDatasetByID: 'filled',
        getSpectrogramAnalysis: type,
        getDatasetChannelConfigurationsByID: type,
      })
      await this.page.getByText('Test dataset').click()
    });
  }

  async openImportModal(type: MockType = 'filled'): Promise<AnalysisImportModal> {
    await interceptGQL(this.page, { getAvailableSpectrogramAnalysisForImport: type })
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
    await interceptGQL(this.modal.page(), { postAnalysisForImport: 'empty' })
    await this.modal.locator('.download-analysis').first().click()
  }
}