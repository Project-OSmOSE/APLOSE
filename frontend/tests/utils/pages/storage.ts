import { expect, type Locator, Page } from '@playwright/test';
import type { Params } from '../types';
import { Navbar } from './navbar';

export class StoragePage {

  get title(): Locator {
    return this.page.getByRole('heading', { name: 'Storage', exact: true })
  }

  constructor(public page: Page,
              private navbar = new Navbar(page),
              public searchStorage = new SearchStorage(page)) {
  }

  async go({ as }: Pick<Params, 'as'>) {
    await this.navbar.go({ as })
    await this.navbar.storageButton.click()
    await expect(this.title).toBeVisible()
  }

}

class SearchStorage {

  get button(): Locator {
    return this.page.getByRole('button', { name: 'Search path' });
  }

  get modal(): Locator {
    return this.page.getByRole('dialog').first()
  }

  constructor(private page: Page) {
  }

  async search(path: string) {
    await this.modal.getByRole('searchbox').fill(path)
    await this.page.keyboard.press('Enter')
  }
}
