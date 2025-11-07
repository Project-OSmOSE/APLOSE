import { essentialTag, expect, test } from './utils';
import { interceptRequests } from './utils/mock';
import type { Params } from './utils/types';
import { detectorConfiguration, spectrogramAnalysis, type UserType } from './utils/mock/types';
import { AnnotationPhaseType } from '../src/api/types.gql-generated';
import { REST_MOCK } from './utils/mock/_rest';
import { DETECTOR_CONFIGURATION } from './fixtures';

// Utils

const TEST = {

  importAll: ({ as, phase, tag }: Pick<Params, 'as' | 'phase' | 'tag'>) =>
    test(`Import all as ${ as } for "${ phase }" phase`, { tag }, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: as,
        getAnnotationPhase: `${ as === 'annotator' ? '' : 'manager' }${ phase }`,
        listDetectors: 'empty',
      })
      await test.step(`Navigate`, () => page.phaseImport.go({ as, phase }))

      await page.phaseImport.importFileStep()

      await page.phaseImport.selectDetectorStep('detector1')
      await page.phaseImport.selectDetectorStep('detector2')
      await page.phaseImport.selectDetectorStep('detector3')

      await page.phaseImport.enterDetectorConfigurationStep('detector1', detectorConfiguration.configuration)
      await page.phaseImport.enterDetectorConfigurationStep('detector2', detectorConfiguration.configuration)
      await page.phaseImport.enterDetectorConfigurationStep('detector3', detectorConfiguration.configuration)

      await test.step(`Import`, async () => {
        await expect(page.phaseImport.importButton).toBeEnabled({ timeout: 500 })
        const [
          request,
        ] = await Promise.all([
          page.waitForRequest(new RegExp(REST_MOCK.importAnnotations.url)),
          page.phaseImport.importButton.click(),
        ])
        const expectedLines = request.postDataJSON().data.replaceAll('"', '').split('\n');
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const fileLines = page.phaseImport.fileData.replaceAll('\r', '').split('\n')
        expect(expectedLines.length).toEqual(fileLines.length)
        const header: string[] = (expectedLines.reverse().pop()).split(',')
        const row: string[] = expectedLines.pop().split(',')
        expect(header).toContainEqual('analysis')
        expect(row[header.indexOf('analysis')]).toEqual(spectrogramAnalysis.id)
      })
    }),

  importFirst: ({ as, phase, tag }: Pick<Params, 'as' | 'phase' | 'tag'>) =>
    test(`Import first detector as ${ as } for "${ phase }" phase`, { tag }, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: as,
        getAnnotationPhase: `${ as === 'annotator' ? '' : 'manager' }${ phase }`,
        listDetectors: 'empty',
      })
      await test.step(`Navigate`, () => page.phaseImport.go({ as, phase }))

      await page.phaseImport.importFileStep()

      await page.phaseImport.selectDetectorStep('detector1')

      await page.phaseImport.enterDetectorConfigurationStep('detector1', detectorConfiguration.configuration)
      await test.step('Cannot see not imported detectors', async () => {
        await expect(page.phaseImport.getConfigurationSelect('detector2')).not.toBeVisible()
        await expect(page.phaseImport.getConfigurationSelect('detector3')).not.toBeVisible()
      })

      await test.step(`Import`, async () => {
        await expect(page.phaseImport.importButton).toBeEnabled({ timeout: 500 })
        const [
          request,
        ] = await Promise.all([
          page.waitForRequest(new RegExp(REST_MOCK.importAnnotations.url)),
          page.phaseImport.importButton.click(),
        ])
        const expectedLines: string[] = request.postDataJSON().data.replaceAll('"', '').split('\n');
        expect(expectedLines.length).toEqual(2) // header + 1 line with detector1
        const header: string[] = (expectedLines.reverse().pop()).split(',')
        const row: string[] = expectedLines.pop().split(',')
        expect(header).toContainEqual('analysis')
        expect(row[header.indexOf('analysis')]).toEqual(spectrogramAnalysis.id)
      })
    }),

  handleMultipleAnalysis: ({ as, phase, tag }: Pick<Params, 'as' | 'phase' | 'tag'>) =>
    test(`Import with analysis selection as ${ as } for "${ phase }" phase`, { tag }, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: as,
        getCampaign: 'multipleAnalysis',
        getAnnotationPhase: `${ as === 'annotator' ? '' : 'manager' }${ phase }`,
        listDetectors: 'empty',
      })
      await test.step(`Navigate`, () => page.phaseImport.go({ as, phase }))

      await test.step('Select analysis', async () => {
        await page.phaseImport.getAnalysisSelect().click()
        await page.phaseImport.getAnalysisSelectOptions().getByText(spectrogramAnalysis.name).last().click()
      })

      await page.phaseImport.importFileStep()

      await page.phaseImport.selectDetectorStep('detector1')

      await page.phaseImport.enterDetectorConfigurationStep('detector1', detectorConfiguration.configuration)
      await test.step('Cannot see not imported detectors', async () => {
        await expect(page.phaseImport.getConfigurationSelect('detector2')).not.toBeVisible()
        await expect(page.phaseImport.getConfigurationSelect('detector3')).not.toBeVisible()
      })

      await test.step(`Import`, async () => {
        await expect(page.phaseImport.importButton).toBeEnabled({ timeout: 500 })
        const [
          request,
        ] = await Promise.all([
          page.waitForRequest(new RegExp(REST_MOCK.importAnnotations.url)),
          page.phaseImport.importButton.click(),
        ])
        const expectedLines: string[] = request.postDataJSON().data.replaceAll('"', '').split('\n');
        expect(expectedLines.length).toEqual(2) // header + 1 line with detector1
        const header: string[] = (expectedLines.reverse().pop()).split(',')
        const row: string[] = expectedLines.pop().split(',')
        expect(header).toContainEqual('analysis')
        expect(row[header.indexOf('analysis')]).toEqual('2')
      })
    }),

  handleExistingDetectors: ({ as, phase, tag }: Pick<Params, 'as' | 'phase' | 'tag'>) =>
    test(`Handle existing detectors as ${ as } for "${ phase }" phase`, { tag }, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: as,
        getAnnotationPhase: `${ as === 'annotator' ? '' : 'manager' }${ phase }`,
        listDetectors: 'filled',
      })
      await test.step(`Navigate`, () => page.phaseImport.go({ as, phase }))

      await page.phaseImport.importFileStep()

      await test.step('Display detector as known', async () => {
        await expect(page.getByText('detector1Already in database').first()).toBeVisible()
      })

      await test.step('Select Detectors configurations', async () => {
        await page.phaseImport.getConfigurationSelect('detector1').click()
        await expect(page.phaseImport.getConfigurationSelectOptions('detector1').getByText(DETECTOR_CONFIGURATION)).toBeVisible()
      })
    }),

  canResetImport: ({ as, phase, tag }: Pick<Params, 'as' | 'phase' | 'tag'>) =>
    test(`Can reset import as ${ as } for "${ phase }" phase`, { tag }, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: as,
        getAnnotationPhase: `${ as === 'annotator' ? '' : 'manager' }${ phase }`,
        listDetectors: 'empty',
      })
      await test.step(`Navigate`, () => page.phaseImport.go({ as, phase }))

      await page.phaseImport.importFileStep()

      await page.phaseImport.selectDetectorStep('detector1')
      await page.phaseImport.selectDetectorStep('detector2')
      await page.phaseImport.selectDetectorStep('detector3')

      await page.phaseImport.enterDetectorConfigurationStep('detector1', detectorConfiguration.configuration)
      await page.phaseImport.enterDetectorConfigurationStep('detector2', detectorConfiguration.configuration)
      await page.phaseImport.enterDetectorConfigurationStep('detector3', detectorConfiguration.configuration)

      await test.step('Reset import', async () => {
        await page.phaseImport.resetFileButton.click()
        await expect(page.getByText('Import annotations (csv)')).toBeVisible();
      })
    }),

}

// Tests

test.describe('[Phase import annotations]', () => {
  const as: UserType = 'creator'

  TEST.importAll({ as, phase: AnnotationPhaseType.Annotation, tag: essentialTag })

  TEST.importFirst({ as, phase: AnnotationPhaseType.Annotation, tag: essentialTag })

  TEST.handleMultipleAnalysis({ as, phase: AnnotationPhaseType.Annotation, tag: essentialTag })

  TEST.handleExistingDetectors({ as, phase: AnnotationPhaseType.Annotation, tag: essentialTag })

  TEST.canResetImport({ as, phase: AnnotationPhaseType.Annotation, tag: essentialTag })

})
