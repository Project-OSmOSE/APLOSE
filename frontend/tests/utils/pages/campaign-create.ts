import { Locator, Page, test } from '@playwright/test';
import { Mock } from '../services';
import { CAMPAIGN, DATASET, UserType } from '../../fixtures';
import { CampaignListPage } from './campaign-list';
import { interceptGQL, selectInAlert } from '../functions';


export class CampaignCreatePage {

  get createButton(): Locator {
    return this.page.getByRole('button', { name: 'Create campaign' })
  }

  constructor(private page: Page,
              private list = new CampaignListPage(page),
              private mock = new Mock(page)) {
  }

  async go(as: UserType, options?: { empty?: boolean, withErrors?: boolean, loadDetectors?: boolean }): Promise<void> {
    await test.step('Navigate to Campaign create', async () => {
      await this.list.go(as)
      await this.list.createButton.click();
      await interceptGQL(this.page, { getDatasetsAndAnalysis: options?.empty ? 'empty' : 'filled' })
      await this.mock.campaignCreate(options?.withErrors);
      await this.mock.campaignDetail(options?.empty);
    });
  }

  async fillGlobal(options?: { complete: boolean }) {
    return test.step('Campaign global information', async () => {
      await this.page.getByPlaceholder('Campaign name').fill(CAMPAIGN.name);
      if (options?.complete) {
        await this.page.getByPlaceholder('Enter your campaign description').fill(CAMPAIGN.desc);
        await this.page.getByPlaceholder('URL').fill(CAMPAIGN.instructions_url);
        const d = new Date(CAMPAIGN.deadline);
        await this.page.getByPlaceholder('Deadline').fill(d.toISOString().split('T')[0]);
      }
    })
  }

  async fillData() {
    return test.step('Campaign data', async () => {
      await this.page.getByRole('button', { name: 'Select a dataset' }).click();
      await selectInAlert(this.page, DATASET.name);
    })
  }

}