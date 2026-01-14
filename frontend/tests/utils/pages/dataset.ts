import { expect, type Locator, Page } from '@playwright/test';
import type { Params } from '../types';
import { Navbar } from './navbar';

export class DatasetPage {

  get title(): Locator {
    return this.page.getByRole('heading', { name: 'Datasets', exact: true })
  }

  constructor(public page: Page,
              private navbar = new Navbar(page),
              public importDataset = new ImportDataset(page)) {
  }

  async go({ as }: Pick<Params, 'as'>) {
    await this.navbar.go({ as })
    await this.navbar.datasetsButton.click()
    await expect(this.page.getByRole('heading', { name: 'Datasets', exact: true })).toBeVisible()
  }

}

class ImportDataset {

  get button(): Locator {
    return this.page.getByRole('button', { name: 'Import dataset' });
  }

  get modal(): Locator {
    return this.page.getByRole('dialog').first()
  }

  get importDatasetButton(): Locator {
    return this.modal.getByTestId('download-dataset').first()
  }

  get importAnalysisButton(): Locator {
    return this.modal.getByTestId('download-analysis').first()
  }

  constructor(private page: Page) {
  }

  public async search(text: string) {
    await this.modal.getByPlaceholder('Search').fill(text)
  }

}
