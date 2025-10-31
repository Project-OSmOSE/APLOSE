import { Locator, Page, test } from '@playwright/test';
import { CampaignListPage } from './campaign-list';
import { selectInAlert } from '../functions';
import { campaign, dataset, UserType } from '../mock/types';


export class CampaignCreatePage {

  get createButton(): Locator {
    return this.page.getByRole('button', { name: 'Create campaign' })
  }

  constructor(private page: Page,
              private list = new CampaignListPage(page)) {
  }

  async go(as: UserType): Promise<void> {
    await test.step('Navigate to Campaign create', async () => {
      await this.list.go(as)
      await this.list.createButton.click();
    });
  }

  async fillGlobal(options?: { complete: boolean }) {
    return test.step('Campaign global information', async () => {
      await this.page.getByPlaceholder('Campaign name').fill(campaign.name);
      if (options?.complete) {
        await this.page.getByPlaceholder('Enter your campaign description').fill(campaign.description);
        await this.page.getByPlaceholder('URL').fill(campaign.instructionsUrl);
        const d = new Date(campaign.deadline);
        await this.page.getByPlaceholder('Deadline').fill(d.toISOString().split('T')[0]);
      }
    })
  }

  async fillData() {
    return test.step('Campaign data', async () => {
      await this.page.getByRole('button', { name: 'Select a dataset' }).click();
      await selectInAlert(this.page, dataset.name);
    })
  }

  async fillColormap() {
    return test.step('Campaign colormap', async () => {
      await this.page.getByText('Allow brigthness / contrast modification').click();
      await this.page.getByText('Allow colormap modification').click();
      await this.page.getByRole('button', { name: 'Greys' }).click();
      await this.page.locator('#options').getByText('hsv').click();
      await this.page.getByText('Invert default colormap').click();
    })
  }

}