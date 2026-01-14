import { type Locator, Page } from '@playwright/test';
import { Navbar } from './navbar';
import type { Params } from '../types';

export class AccountPage {

  get title(): Locator {
    return this.page.getByRole('heading', { name: 'Account', exact: true })
  }

  constructor(private page: Page,
              private navbar: Navbar = new Navbar(page)) {
  }

  async go({ as }: Pick<Params, 'as'>) {
    await this.navbar.go({ as });
    await this.navbar.accountManagementButton.click();
  }
}