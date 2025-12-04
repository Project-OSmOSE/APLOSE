import { Locator, Page, test } from '@playwright/test';
import { fileURLToPath } from 'url';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import path from 'path';
import * as fs from 'node:fs';
import { PhaseDetailPage } from './phase-detail';
import type { Params } from '../types';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename).split(/[/\\]/g); // get the name of the directory
__dirname.pop();
__dirname.pop();
const __file = path.join(__dirname.join('/'), 'fixtures', 'annotation_results.csv')

export class PhaseImportAnnotationsPage {

  get title(): Locator {
    return this.page.getByRole('heading', { name: 'Import annotations' })
  }

  get importButton(): Locator {
    return this.page.getByRole('button', { name: 'Import' })
  }

  get resetFileButton(): Locator {
    return this.page.getByRole('button', { name: 'Reset' })
  }

  get fileData(): string {
    return fs.readFileSync(__file, 'utf8');
  }

  constructor(private page: Page,
              private detail = new PhaseDetailPage(page)) {
  }

  async go({ as, phase }: Pick<Params, 'as' | 'phase'>): Promise<void> {
    await this.detail.go({ as, phase })
    await this.detail.importAnnotationsButton.click();
  }

  getAnalysisSelect(): Locator {
    return this.page.getByTestId(`select-analysis`)
  }

  getAnalysisSelectOptions(): Locator {
    return this.page.getByTestId(`select-analysis-options`)
  }

  async importFileStep() {
    return test.step('Import file', async () => {
      const [ fileChooser ] = await Promise.all([
        this.page.waitForEvent('filechooser'),
        this.page.getByText('Import annotations (csv)').click(),
      ])
      await fileChooser.setFiles(__file);
    })
  }

  async selectDetectorStep(name: string) {
    return test.step(`Select detector ${ name }`, async () => {
      await this.page.getByTestId(`select-${ name }`).click()
      await this.page.getByTestId(`select-${ name }-options`).getByText('Create').click()
    })
  }

  getConfigurationSelect(detector: string): Locator {
    return this.page.getByTestId(`select-${ detector }-configuration`)
  }

  getConfigurationSelectOptions(detector: string): Locator {
    return this.page.getByTestId(`select-${ detector }-configuration-options`)
  }

  async enterDetectorConfigurationStep(name: string, configuration: string) {
    return test.step(`Enter configuration for detector ${ name }`, async () => {
      await this.getConfigurationSelect(name).click()
      await this.getConfigurationSelectOptions(name).getByText('Create new').click()
      await this.page.getByTestId(`input-${ name }-configuration`).fill(configuration)
    })
  }
}