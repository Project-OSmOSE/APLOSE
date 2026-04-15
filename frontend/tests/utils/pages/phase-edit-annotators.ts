import { type Locator, Page } from '@playwright/test';
import { type User } from '../mock/types';
import { PhaseDetailPage } from './phase-detail';
import type { Params } from '../types';

export class PhaseEditAnnotatorsPage {

  get title(): Locator {
    return this.page.getByRole('heading', { name: 'Manage annotators' })
  }


  constructor(private page: Page,
              private detail = new PhaseDetailPage(page)) {
  }

  async go({ as, phase }: Pick<Params, 'as' | 'phase'>) {
    await this.detail.go({ as, phase })
    await this.detail.manageButton.click();
  }

  getRows(user: User): Locator {
    return this.page.locator('tr').filter({hasText: `${user.firstName} ${user.lastName}`})
  }
  getRow(user: User): Locator {
    return this.getRows(user).first()
  }

  getfirstIndexInput(user: User): Locator {
    return this.getRow(user).getByTestId('firstFileIndex')
  }

  getlastIndexInput(user: User): Locator {
    return this.getRow(user).getByTestId('lastFileIndex')
  }

  getUnlockButton(user: User): Locator {
    return this.getRow(user).getByTestId('unlock')
  }

  getRemoveButton(user: User): Locator {
    return this.getRow(user).getByTestId('remove')
  }
}