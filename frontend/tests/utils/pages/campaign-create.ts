import { expect, Locator, Page } from '@playwright/test';
import { CampaignListPage } from './campaign-list';
import { selectInAlert } from '../functions';
import { type Dataset } from '../mock/types';
import type { Params } from '../types';
import type { Colormap } from '../../../src/features/Colormap';


export class CampaignCreatePage {

  get createButton(): Locator {
    return this.page.getByRole('button', { name: 'Create campaign' })
  }

  get nameInput(): Locator {
    return this.page.getByPlaceholder('Campaign name')
  }

  get descriptionInput(): Locator {
    return this.page.getByPlaceholder('Enter your campaign description')
  }

  get instructionsUrlInput(): Locator {
    return this.page.getByPlaceholder('URL')
  }

  get deadlineInput(): Locator {
    return this.page.getByPlaceholder('Deadline')
  }

  get brightnessContrastCheckBox(): Locator {
    return this.page.getByText('Allow brigthness / contrast modification')
  }

  get colormapCheckBox(): Locator {
    return this.page.getByText('Allow colormap modification')
  }

  get invertColormapCheckBox(): Locator {
    return this.page.getByText('Invert default colormap')
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
    await this.page.getByRole('button', { name: 'Select a dataset' }).click();
    await selectInAlert(this.page, dataset.name);
  }

  async selectColormap(colormap: Colormap) {
    await this.page.getByRole('button', { name: 'Greys' }).click();
    await this.page.locator('#options').getByText(colormap).click();
  }

}