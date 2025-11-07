import { expect, Locator, Page, test } from '@playwright/test';
import { Mock } from '../services';
import { type Annotation, type Confidence, type Label } from '../mock/types';
import { AnnotationType } from '../../../src/api/types.gql-generated';
import { PhaseDetailPage } from './phase-detail';
import type { Params } from '../types';

// export type Label = {
//   addPresence: () => Promise<void>;
//   selectLabel: () => Promise<void>;
//   getLabelState: () => Promise<boolean>;
//   remove: () => Promise<void>;
//   getWeakResult: () => Locator;
//   getNthStrongResult: (nth: number) => Locator;
// }
// export type Confidence = {
//   select: () => Promise<void>;
// }

export type Validation = {
  validate: () => Promise<void>;
  invalidate: () => Promise<void>;
  expectState: (isValid: boolean) => Promise<void>;
}

export class AnnotatorPage {

  get backToCampaignButton(): Locator {
    return this.page.getByRole('button', { name: 'Back to campaign' });
  }

  get commentInput(): Locator {
    return this.page.getByPlaceholder('Enter your comment');
  }

  get taskCommentButton(): Locator {
    return this.page.getByRole('button', { name: 'Task Comment' });
  }

  get annotationsBlock(): Locator {
    return this.page.getByTestId('annotation-bloc');
  }

  get submitButton(): Locator {
    return this.page.getByRole('button', { name: 'Submit & load next recording' })
  }

  private getValidationWithButtons(validateBtn: Locator, invalidateBtn: Locator): Validation {
    return {
      validate: async () => {
        await validateBtn.click()
      },
      invalidate: async () => {
        await invalidateBtn.click()
        await this.page.getByRole('button', { name: 'Remove' }).last().click()
      },
      expectState: async (isValid: boolean) => {
        await expect(validateBtn).toHaveAttribute('color', isValid ? 'success' : 'medium')
        await expect(invalidateBtn).toHaveAttribute('color', isValid ? 'medium' : 'danger')
      },
    }
  }

  get presenceValidation(): Validation {
    return this.getValidationWithButtons(
      this.page.locator('ion-button.validate').first(),
      this.page.locator('ion-button.invalidate').first(),
    )
  }

  get boxValidation(): Validation {
    return this.getValidationWithButtons(
      this.page.locator('ion-button.validate').nth(1),
      this.page.locator('ion-button.invalidate').nth(1),
    )
  }

  constructor(private page: Page,
              private mock = new Mock(page),
              private phaseDetailPage = new PhaseDetailPage(page)) {
  }

  async go({ as, phase }: Pick<Params, 'as' | 'phase'>, options?: {
    empty?: boolean,
  }) {
    await this.phaseDetailPage.go({ as, phase })
    await this.phaseDetailPage.resumeButton.click()

    // await test.step('Navigate to Annotator', async () => {
    // await this.mock.annotator(options.phase ?? 'Annotation', options.empty)
    // await this.campaignDetail.resumeButton.click()
    // await this.mock.annotator(options.phase ?? 'Annotation', options.empty)
    // await Promise.all([
    //   this.page.waitForURL(`**/annotation-campaign/${ campaign.id }/phase/${ AnnotationPhaseType.Annotation }/spectrogram/${ spectrogram.id }`),
    //   this.page.waitForRequest(gqlURL),
    //   this.phaseDetailPage.resumeButton.click(),
    // ])
    // });
  }

  getLabelChip(label: Label) {
    return this.page.getByTestId('label-chip').filter({ hasText: label.name })
  }

  getConfidenceChip(confidence: Confidence) {
    return this.page.getByTestId('confidence-chip').getByText(confidence.label, { exact: true })
  }

  getAnnotationForLabel(label: Label, which: 'weak' | 'strong' = 'weak'): Locator {
    return this.annotationsBlock.getByText(label.name).nth(which === 'weak' ? 0 : 1)
  }

  async isLabelUsed(label: Label): Promise<boolean> {
    const outline = await this.getLabelChip(label).getAttribute('outline');
    return outline !== 'true';
  }

  async addWeak(label: Label, method: 'mouse' | 'shortcut' = 'mouse') {
    switch (method) {
      case 'mouse':
        await this.getLabelChip(label).click()
        break;
      case 'shortcut':
        await this.page.keyboard.press(label.id, { delay: 1_000 })
        break;
    }
  }

  async removeWeak(label: Label, method: 'mouse' | 'shortcut' = 'mouse') {
    switch (method) {
      case 'mouse':
        await this.getLabelChip(label).getByTestId('remove-label').click()
        break;
      case 'shortcut':
        await this.getAnnotationForLabel(label).click() // Set focus
        await this.page.keyboard.press('Delete')
        break;
    }
  }

  async confirmeRemoveWeak(label: Label, method: 'mouse' | 'shortcut' = 'mouse') {
    switch (method) {
      case 'mouse':
        await this.page.getByRole('dialog').getByRole('button', { name: `Remove "${ label.name }" annotations` }).click()
        break;
      case 'shortcut':
        await this.page.keyboard.press('Enter')
        break;
    }
  }

  async submit(method: 'mouse' | 'shortcut' = 'mouse') {
    switch (method) {
      case 'mouse':
        await this.submitButton.click()
        break;
      case 'shortcut':
        await this.page.keyboard.press('Enter')
        break;
    }
  }

  async removeStrong(label: Label, method: 'mouse' | 'shortcut' = 'mouse'): Promise<void> {
    // Focus
    await this.getAnnotationForLabel(label, 'strong').click()
    switch (method) {
      case 'mouse':
        await this.page.getByTestId('remove-box').click()
        break;
      case 'shortcut':
        await this.page.keyboard.press('Delete')
        break;
    }
  }

  getLabel(label: string): Label {
    return {
      addPresence: async () => {
        await this.page.getByTestId('label-chip').filter({ hasText: label }).click()
      },
      remove: async () => {
        await this.page.getByTestId('label-chip').filter({ hasText: label }).locator('svg').last().click()
        const alert = this.page.getByRole('dialog')
        await alert.getByRole('button', { name: `Remove "${ label }" annotations` }).click()
      },
      selectLabel: async () => {
        await this.page.getByTestId('label-chip').filter({ hasText: label }).click()
      },
      getLabelState: async () => {
        const outline = await this.page.getByTestId('label-chip').filter({ hasText: label }).getAttribute('outline');
        return outline !== 'true';
      },
      getWeakResult: () => {
        return this.annotationsBlock.getByText(label).first()
      },
      getNthStrongResult: (nth: number) => {
        return this.annotationsBlock.getByText(label).nth(1 + nth)
      },
    }
  }

  getConfidence(confidence: string): Confidence {
    return {
      focusAnnotation: async () => {
        await this.page.locator('ion-chip').filter({ hasText: confidence }).click()
      },
    }
  }

  private async scrollTop() {
    await this.page.evaluate(() => window.scrollTo({ left: 0, top: 0 }))
  }

  async draw(type: Exclude<AnnotationType, AnnotationType.Weak>): Promise<Pick<Annotation, 'startTime' | 'startFrequency' | 'endTime' | 'endFrequency'>> {
    return test.step(`Draw ${ type }`, async () => {
      await this.scrollTop();
      const canvas = this.page.getByTestId('drawable-canvas').first()
      await expect(canvas).toBeVisible()
      await this.page.mouse.move(380, 410)
      await this.page.mouse.down({ button: 'left' })
      if (type === 'Box') await this.page.mouse.move(610, 480)
      await this.page.mouse.up({ button: 'left' })
      return {
        startTime: type === 'Box' ? 2.704 : 4.607,
        endTime: type === 'Box' ? 4.607 : null,
        startFrequency: type === 'Box' ? 0.000 : 59.000,
        endFrequency: type === 'Box' ? 59.000 : null,
      } as Pick<Annotation, 'startTime' | 'startFrequency' | 'endTime' | 'endFrequency'>
    })
  }

}