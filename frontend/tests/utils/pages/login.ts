import { type Locator, Page, Request } from '@playwright/test';
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

  async go(opts?: Pick<Params, 'as'>) {
    await this.home.go();
    await this.home.loginButton.click();
    if (opts) {
      await this.fillForm({ as: opts.as })
      await this.submit({ method: 'mouse' })
    }
  }

  async fillForm({ as }: Pick<Params, 'as'>) {
    await this.page.getByPlaceholder('username').fill(as)
    await this.page.getByPlaceholder('password').fill(PASSWORD)
  }

  async submit({ method }: Pick<Params, 'method'>): Promise<Request> {
    const [ request ] = await Promise.all([
      this.page.waitForRequest(REST_MOCK.token.url),
      method === 'mouse' ? this.page.getByRole('button', { name: 'Login' }).click() : this.page.keyboard.press('Enter'),
    ])
    return request;
  }
}