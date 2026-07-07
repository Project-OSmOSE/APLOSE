import { type Locator, Page } from '@playwright/test';
import { Params } from '../types'
import { LoginPage } from './login';
import { test } from '../fixture';

export class Navbar {

    get adminLink(): Locator {
        return this.page.getByRole('link', { name: 'Admin', exact: true }).first()
    }

    get campaignButton(): Locator {
        return this.page.getByRole('button', { name: 'Annotation campaigns' })
    }

    get accountManagementButton(): Locator {
        return this.page.getByRole('button', { name: 'Account' })
    }

    get datasetsButton(): Locator {
        return this.page.getByRole('button', { name: 'Datasets' })
    }

    get storageButton(): Locator {
        return this.page.getByRole('button', { name: 'Storage', exact: true })
    }

    get logoutButton(): Locator {
        return this.page.getByRole('button', { name: 'Logout' })
    }

    constructor(private page: Page,
                private login = new LoginPage(page)) {
    }

    async go({ as }: Pick<Params, 'as'>) {
        await this.login.go({ as });
    }

    async openUserPopover(as: Params['as']) {
        return test.step('Open account popover', () =>
            this.page.getByText(`${ as[0].toUpperCase() }T`, { exact: true }).hover(),
        )
    }
}