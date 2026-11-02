import { Locator, Page } from '@playwright/test';
import { campaign, type Label } from '../mock/types';
import { CampaignListPage } from './campaign-list';
import type { Params } from '../types';

export class CampaignDetailPage {

    get informationTab(): Locator {
        return this.page.getByRole('button', { name: 'Information' });
    }

    get archiveButton(): Locator {
        return this.page.getByRole('button', { name: 'Archive' });
    }

    constructor(private page: Page,
                private list = new CampaignListPage(page),
                public labelModal = new LabelModal(page)) {
    }

    async go({ as }: Pick<Params, 'as'>) {
        await this.list.go({ as })
        await this.list.card.click();
        await this.informationTab.click()
    }
}

class LabelModal {

    get name(): string {
        return `${ campaign.name } labels`
    }

    get button(): Locator {
        return this.page.getByRole('button', { name: 'Labels', exact: true });
    }

    get modal(): Locator {
        return this.page.getByRole('dialog', { name: this.name });
    }

    get enableUpdateButton(): Locator {
        return this.modal.getByRole('button', { name: 'Enable update' });
    }

    get disableUpdateButton(): Locator {
        return this.modal.getByRole('button', { name: 'Disable update' });
    }

    get closeButton(): Locator {
        return this.modal.getByTestId('close-modal');
    }

    constructor(private page: Page) {
    }

    getLabelCheckbox(label: Label): Locator {
        return this.modal.getByRole('row', { name: label.displayName }).getByRole('checkbox')
    }

    async hasAcousticFeatures(label: Label): Promise<boolean> {
        return await this.getLabelCheckbox(label).getAttribute('aria-checked') == 'true'
    }
}
