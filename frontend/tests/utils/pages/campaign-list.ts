import { Locator, Page, test } from '@playwright/test';
import { UserType } from '../../fixtures';
import { LoginPage } from './login';
import { Mock, MockType } from '../services';
import { expect, interceptGQL } from "../index";

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
      await interceptGQL(this.page, {
        listCampaignsAndPhases: type
      })
      await this.login.login(as)
      await interceptGQL(this.page, {
        listCampaignsAndPhases: type
      }, 2)
      await expect(this.page.getByRole('heading', { name: 'Annotation campaigns' })).toBeVisible()
    });
  }

  async search(text: string | undefined) {
    if (text) await this.page.getByRole('search').locator('input').fill(text)
    else await this.page.getByRole('search').locator('input').clear()
    await this.page.keyboard.press('Enter')
  }

}