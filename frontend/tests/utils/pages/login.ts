import { type Locator, Page, Request, test } from '@playwright/test';
import { UserType } from '../../fixtures';
import { HomePage } from './home';
import { PASSWORD } from '../mock';
import { REST_MOCK } from '../mock/_rest';
import { Params } from '../types'

export class LoginPage {

  get title(): Locator {
    return this.page.getByRole('heading', { name: 'Login', exact: true }).first()
  }

  constructor(private page: Page,
              private home: HomePage = new HomePage(page)) {
  }

  async go() {
    await test.step('Navigate to login', async () => {
      await this.home.go();
      await this.page.getByRole('button', { name: 'Login' }).click();
    });
  }

  async fillForm({ as }: Pick<Params, 'as'>) {
    await test.step('Fill login form', async () => {
      await this.page.getByPlaceholder('username').fill(as)
      await this.page.getByPlaceholder('password').fill(PASSWORD)
    })
  }

  async submit({ method }: Pick<Params, 'method'>): Promise<Request> {
    return await test.step('Submit', async () => {
      const [ request ] = await Promise.all([
        this.page.waitForRequest(REST_MOCK.token.url),
        method === 'mouse' ? this.page.getByRole('button', { name: 'Login' }).click() : this.page.keyboard.press('Enter'),
      ])
      return request;
    })
  }

  async login(as: UserType) {
    await this.go()
    await this.fillForm({ as })
    await this.submit({ method: 'mouse' })
  }
}