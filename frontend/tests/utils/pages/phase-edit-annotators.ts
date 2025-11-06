import { type Locator, Page, test } from '@playwright/test';
import { type FileRange } from '../mock/types';
import { PhaseDetailPage } from './phase-detail';
import type { Params } from '../types';

export class PhaseEditAnnotatorsPage {


  constructor(private page: Page,
              private detail = new PhaseDetailPage(page)) {
  }

  async go({ as }: Pick<Params, 'as'>) {
    await test.step('Navigate to Campaign detail', async () => {
      await this.detail.go({ as })
      await this.detail.manageButton.click();
    });
  }

  getfirstIndexInput(range: Pick<FileRange, 'id'>): Locator {
    return this.page.getByTestId(`firstFileIndex-${ range.id }`)
  }

  getlastIndexInput(range: Pick<FileRange, 'id'>): Locator {
    return this.page.getByTestId(`lastFileIndex-${ range.id }`)
  }

  getUnlockButton(range: Pick<FileRange, 'id'>): Locator {
    return this.page.getByTestId(`unlock-${ range.id }`)
  }

  getRemoveButton(range: Pick<FileRange, 'id'>): Locator {
    return this.page.getByTestId(`remove-${ range.id }`)
  }
}