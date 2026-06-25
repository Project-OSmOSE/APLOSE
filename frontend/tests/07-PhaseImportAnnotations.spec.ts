import { essentialTag, expect, test } from './utils';
import { interceptRequests } from './utils/mock';
import type { Params } from './utils/types';
import { detectorConfiguration, type UserType } from './utils/mock/types';
import { AnnotationPhaseType } from '../src/api/types.gql-generated';
import { REST_MOCK } from './utils/mock/_rest';

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

            await test.step(`Enter configuration for detectors`, async () => {
                await page.getByRole('row', { name: 'detector1' }).getByRole('textbox').fill(detectorConfiguration.configuration)
                await page.getByRole('row', { name: 'detector2' }).getByRole('textbox').fill(detectorConfiguration.configuration)
                await page.getByRole('row', { name: 'detector3' }).getByRole('textbox').fill(detectorConfiguration.configuration)
            })

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

            await page.phaseImport.unselectDetectorStep('detector2')
            await page.phaseImport.unselectDetectorStep('detector3')

            await test.step(`Enter configuration for detectors`, async () => {
                await page.getByRole('row', { name: 'detector1' }).getByRole('textbox').fill(detectorConfiguration.configuration)
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
                await expect(page.getByRole('row', { name: 'detector1' }).getByRole('combobox', { name: 'Create detector' })).toHaveValue('detector1')
            })

            await test.step('Select Detector configurations', async () => {
                await page.phaseImport.getConfigurationSelect('detector1').click()
                await expect(page.phaseImport.getConfigurationSelectOptions().getByText(detectorConfiguration.configuration)).toBeVisible()
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

            await test.step(`Enter configuration for detectors`, async () => {
                await page.getByRole('row', { name: 'detector1' }).getByRole('textbox').fill(detectorConfiguration.configuration)
                await page.getByRole('row', { name: 'detector2' }).getByRole('textbox').fill(detectorConfiguration.configuration)
                await page.getByRole('row', { name: 'detector3' }).getByRole('textbox').fill(detectorConfiguration.configuration)
            })

            await test.step('Reset import', async () => {
                await page.phaseImport.resetFileButton.click()
                await expect(page.getByText('Import annotations (csv)')).toBeVisible();
            })
        }),

}

// Tests

test.describe('/annotation-campaign/:campaignID/phase/:phaseType/import-annotations', () => {
    const as: UserType = 'creator'

    TEST.importAll({ as, phase: AnnotationPhaseType.Verification, tag: essentialTag })

    TEST.importFirst({ as, phase: AnnotationPhaseType.Verification, tag: essentialTag })

    TEST.handleExistingDetectors({ as, phase: AnnotationPhaseType.Verification, tag: essentialTag })

    TEST.canResetImport({ as, phase: AnnotationPhaseType.Verification, tag: essentialTag })

})
