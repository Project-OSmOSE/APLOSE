import { type Locator, type Page } from '@playwright/test';
import type { Params } from '../types';
import { Navbar } from './navbar';

export class CampaignListPage {

  get title(): Locator {
    return this.page.getByRole('heading', { name: 'Annotation campaigns' })
  }

  get card(): Locator {
    return this.page.getByTestId('campaign-card').first();
  }

  get createCampaignButton(): Locator {
    return this.page.getByRole('button', { name: 'New annotation campaign' })
  }

  constructor(private page: Page,
              private navbar = new Navbar(page)) {
  }

  async go({ as }: Pick<Params, 'as'>) {
    await this.navbar.go({ as })
  }

  async search(text: string) {
    await this.page.getByRole('search').locator('input').fill(text)
    await this.page.keyboard.press('Enter')
  }

  async clearSearch(text: string) {
    await this.page.getByRole('search').locator('input').clear()
    await this.page.keyboard.press('Enter')
  }

}