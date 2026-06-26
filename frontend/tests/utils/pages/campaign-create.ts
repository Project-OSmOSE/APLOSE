import { expect, Locator, Page } from '@playwright/test';
import { CampaignListPage } from './campaign-list';
import { type Dataset } from '../mock/types';
import type { Params } from '../types';
import type { Colormap } from '../../../src/features/Colormap';


export class CampaignCreatePage {

    get createButton(): Locator {
        return this.page.getByRole('button', { name: 'Create' })
    }

    get nameInput(): Locator {
        return this.page.getByLabel('Name')
    }

    get descriptionInput(): Locator {
        return this.page.getByLabel('Description')
    }

    get instructionsUrlInput(): Locator {
        return this.page.getByLabel('Instruction URL')
    }

    get deadlineInput(): Locator {
        return this.page.getByLabel('Deadline')
    }

    get brightnessContrastCheckBox(): Locator {
        return this.page.getByRole('checkbox', { name: 'Allow brightness / contrast modification' })
    }

    get colormapCheckBox(): Locator {
        return this.page.getByRole('checkbox', { name: 'Allow colormap modification' })
    }

    get invertColormapCheckBox(): Locator {
        return this.page.getByRole('checkbox', { name: 'Invert default colormap' })
    }

    constructor(private page: Page,
                private list = new CampaignListPage(page)) {
    }

    async go({ as }: Pick<Params, 'as'>): Promise<void> {
        await this.list.go({ as })
        await this.list.createCampaignButton.click()
        await expect(this.page.getByRole('heading', { name: 'Create Annotation Campaign', exact: true })).toBeVisible()
    }

    async selectDataset(dataset: Dataset) {
        await this.page.getByRole('combobox', { name: 'Dataset' }).fill(dataset.name);
        const popup = this.page.getByTestId('dataset-select-popup')
        await popup.getByText(dataset.name).click();
    }

    async selectColormap(colormap: Colormap) {
        await this.page.getByRole('combobox', { name: 'Default colormap' }).click();
        const popup = this.page.getByTestId('colormap-select-popup')
        await popup.getByText(colormap).click();
    }

}