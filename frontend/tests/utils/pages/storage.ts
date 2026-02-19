import { expect, type Locator, Page } from '@playwright/test';
import type { Params } from '../types';
import { Navbar } from './navbar';

export class StoragePage {

  get title(): Locator {
    return this.page.getByRole('heading', { name: 'Storage', exact: true })
  }

  constructor(public page: Page,
              private navbar = new Navbar(page)) {
  }

  async go({ as }: Pick<Params, 'as'>) {
    await this.navbar.go({ as })
    await this.navbar.storageButton.click()
    await expect(this.title).toBeVisible()
  }

}

