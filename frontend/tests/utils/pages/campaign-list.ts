import { expect, type Locator, type Page, test } from '@playwright/test';
import { LoginPage } from './login';
import type { UserType } from '../mock/types';

export class CampaignListPage {

  get card(): Locator {
    return this.page.locator('.campaign-card').first();
  }

  get createButton(): Locator {
    return this.page.getByRole('button', { name: 'New annotation campaign' })
  }

  constructor(private page: Page,
              private login = new LoginPage(page)) {
  }

  async go(as: UserType) {
    await test.step('Navigate to Campaigns', async () => {
      await this.login.login(as)
      await expect(this.page.getByRole('heading', { name: 'Annotation campaigns' })).toBeVisible()
    });
  }

  async search(text: string | undefined) {
    if (text) await this.page.getByRole('search').locator('input').fill(text)
    else await this.page.getByRole('search').locator('input').clear()
    await this.page.keyboard.press('Enter')
  }

}