import { Locator, Page } from '@playwright/test';
import { CampaignListPage } from './campaign-list';
import type { Params } from '../types';
import { AnnotationPhaseType } from '../../../src/api/types.gql-generated';

export class PhaseDetailPage {

  get importAnnotationsButton(): Locator {
    return this.page.getByTestId('import');
  }

  get resumeButton(): Locator {
    return this.page.getByTestId('resume').getByRole('button');
  }

  get manageButton(): Locator {
    return this.page.getByTestId('manage');
  }

  get verificationTab(): Locator {
    return this.page.getByRole('button', { name: 'Verification' });
  }

  constructor(private page: Page,
              private list = new CampaignListPage(page),
              public progressModal = new ProgressModal(page)) {
  }

  async go({ as, phase }: Pick<Params, 'as' | 'phase'>) {
    await this.list.go({ as })
    await this.list.card.click();
    if (phase === AnnotationPhaseType.Verification)
      await this.verificationTab.click()
  }

  async searchFile(text: string) {
    await this.page.getByRole('search').locator('input').fill(text)
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
