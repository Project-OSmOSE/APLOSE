import { Page, Request, test } from '@playwright/test';
import { UserType } from '../../fixtures';
import { HomePage } from './home';
import { PASSWORD } from '../mock';
import { REST_MOCK } from '../mock/_rest';

export class LoginPage {

  constructor(private page: Page,
              private home: HomePage = new HomePage(page)) {
  }

  async go() {
    await test.step('Navigate to login', async () => {
      await this.home.go();
      await this.page.getByRole('button', { name: 'Login' }).click();
    });
  }

  async fillForm(as: UserType) {
    await test.step('Fill login form', async () => {
      await this.page.getByPlaceholder('username').fill(as)
      await this.page.getByPlaceholder('password').fill(PASSWORD)
    })
  }

  async submit(submitAction: 'button' | 'enterKey'): Promise<Request> {
    return await test.step('Submit', async () => {
      const [ request ] = await Promise.all([
        this.page.waitForRequest(REST_MOCK.token.url),
        submitAction === 'button' ? this.page.getByRole('button', { name: 'Login' }).click() : this.page.keyboard.press('Enter'),
      ])
      return request;
    })
  }

  async login(as: UserType) {
    await this.go()
    await this.fillForm(as)
    await this.submit('button')
  }
}