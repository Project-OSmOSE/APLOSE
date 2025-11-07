import { Locator, Page } from '@playwright/test';
import { UI } from '../services';
import { CampaignListPage } from './campaign-list';
import type { Params } from '../types';

export class PhaseDetailPage {

  get importAnnotationsButton(): Locator {
    return this.page.locator('button[aria-label=Import]');
  }

  get resumeButton(): Locator {
    return this.page.locator('button[aria-label=Resume]');
  }

  get manageButton(): Locator {
    return this.page.locator('button[aria-label=Manage]');
  }

  constructor(private page: Page,
              private list = new CampaignListPage(page),
              public progressModal = new ProgressModal(page),
              private ui = new UI(page)) {
  }

  async go({ as }: Pick<Params, 'as'>) {
    await this.list.go({ as })
    await this.list.card.click();
  }

  async searchFile(text: string) {
    await this.page.getByRole('search').locator('input').fill(text)
    await this.page.keyboard.press('Enter')
  }

  async clearSearch() {
    await this.page.getByRole('search').locator('input').clear()
    await this.page.keyboard.press('Enter')
  }
}

class ProgressModal {

  get button(): Locator {
    return this.page.getByTestId('progress')
  }

  get modal(): Locator {
    return this.page.getByRole('dialog').first();
  }

  get statusDownloadLink(): Locator {
    return this.modal.getByRole('link', { name: 'Status' })
  }

  get resultsDownloadLink(): Locator {
    return this.modal.getByRole('link', { name: 'Results' })
  }

  get closeButton(): Locator {
    return this.modal.getByTestId('close-modal');
  }

  constructor(private page: Page) {
  }

}
