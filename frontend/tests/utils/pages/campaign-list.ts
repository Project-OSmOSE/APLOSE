import { Locator, Page, test } from '@playwright/test';
import { UserType } from '../../fixtures';
import { LoginPage } from './login';
import { Mock, MockType } from '../services';
import { interceptGQL } from "../functions";

export class CampaignListPage {

  get card(): Locator {
    return this.page.locator('.campaign-card').first();
  }

  get createButton(): Locator {
    return this.page.getByRole('button', { name: 'New annotation campaign' })
  }

  constructor(private page: Page,
              private login = new LoginPage(page),
              private mock = new Mock(page)) {
  }

  async go(as: UserType, type: MockType = 'filled') {
    await test.step('Navigate to Campaigns', async () => {
      await this.mock.userSelf(as)
      await interceptGQL(this.page, { getAnnotationCampaigns: type }, 2)
      await this.login.login(as)
      await this.page.waitForRequest('**/graphql')
      await this.page.waitForRequest('**/graphql')
    });
  }

  async search(text: string | undefined) {
    if (text) await this.page.getByRole('search').locator('input').fill(text)
    else await this.page.getByRole('search').locator('input').clear()
    await this.page.keyboard.press('Enter')
  }

}