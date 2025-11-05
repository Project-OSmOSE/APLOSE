import { AbstractAplosePage } from '../types';
import type { Locator } from '@playwright/test';

export class HomePage extends AbstractAplosePage {
  
  pageName = 'home'

  get osmoseLink(): Locator {
    return this.page.getByRole('link', { name: 'OSmOSE', exact: true })
  }

  get documentationLink(): Locator {
    return this.page.getByRole('link', { name: 'Documentation', exact: true }).first()
  }

  get loginButton(): Locator {
    return this.page.getByRole('button', { name: 'Login', exact: true })
  }

  async go() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

}