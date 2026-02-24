import { type Locator, Page } from '@playwright/test';
import { dataset } from '../mock/types';
import { DatasetPage } from './dataset';
import type { Params } from '../types';

export class DatasetDetailPage {

  constructor(public page: Page,
              private datasetList = new DatasetPage(page),
              public importAnalysis = new ImportAnalysis(page)) {
  }

  async go({ as }: Pick<Params, 'as'>) {
    await this.datasetList.go({ as });
    await this.page.getByText(dataset.name).click()
  }

}

class ImportAnalysis {

  get button(): Locator {
    return this.page.getByRole('button', { name: 'Import analysis' });
  }

  get modal(): Locator {
    return this.page.getByRole('dialog').first()
  }

  get importButton(): Locator {
    return this.modal.getByRole('button', { name: 'Import' }).first()
  }

  constructor(private page: Page) {
  }

}
