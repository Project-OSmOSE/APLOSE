import { type Locator, Page, Request } from '@playwright/test';
import { UserType } from '../../fixtures';
import { HomePage } from './home';
import { PASSWORD } from '../mock';
import { REST_MOCK } from '../mock/_rest';
import { AbstractAplosePage, Params } from '../types'

export class LoginPage extends AbstractAplosePage {

  pageName = 'login'

  get title(): Locator {
    return this.page.getByRole('heading', { name: 'Login', exact: true }).first()
  }

  constructor(protected page: Page,
              private home: HomePage = new HomePage(page)) {
    super(page)
  }

  async go() {
    await this.home.go();
    await this.home.loginButton.click();
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

  async login(as: UserType) {
    await this.go()
    await this.fillForm({ as })
    await this.submit({ method: 'mouse' })
  }
}