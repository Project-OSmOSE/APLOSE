import { essentialTag, expect, type Page, test } from './utils';
import { interceptRequests, mockError } from './utils/mock';
import type { GqlMutation } from './utils/mock/_gql';
import { campaign, dataset, spectrogramAnalysis, type UserType } from './utils/mock/types';
import type { CreateCampaignMutationVariables } from '../src/features/AnnotationCampaign';
import type { Params } from './utils/types';

// Utils
const STEP = {

    navigate: (page: Page, { as }: Pick<Params, 'as'>) =>
        test.step(`Navigate`, () => page.campaignCreate.go({ as })),

    fillRequiredGlobalInformation: (page: Page) =>
        test.step('Fill required global information', async () => {
            await page.campaignCreate.nameInput.fill(campaign.name)
        }),

    fillAllGlobalInformation: (page: Page) =>
        test.step('Fill all global information', async () => {
            await page.campaignCreate.nameInput.fill(campaign.name)
            await page.campaignCreate.descriptionInput.fill(campaign.description)
            await page.campaignCreate.instructionsUrlInput.fill(campaign.instructionsUrl)
            await page.campaignCreate.deadlineInput.fill(new Date(campaign.deadline).toISOString().split('T')[0])
        }),

    fillDataInformation: (page: Page) =>
        test.step('Fill data information', async () => {
            await Promise.all([
                page.waitForGqlRequest('allSpectrogramAnalysisForDataset'),
                page.campaignCreate.selectDataset(dataset),
            ])
        }),

    fillSpectrogramInformation: (page: Page) =>
        test.step('Fill spectrogram information', async () => {
            await page.campaignCreate.digitalZoomCheckBox.click()
            await page.campaignCreate.brightnessContrastCheckBox.click()
            await page.campaignCreate.colormapCheckBox.click()
            await page.campaignCreate.selectColormap('hsv')
            await page.campaignCreate.invertColormapCheckBox.click()
        }),
}

const TEST = {

    canSubmitOnlyRequiredFields: ({ as, tag }: Pick<Params, 'as' | 'tag'>) =>
        test(`Can submit only required fields as ${ as }`, { tag }, async ({ page }: { page: Page }) => {
            await interceptRequests(page, { getCurrentUser: as })
            await STEP.navigate(page, { as })

            await STEP.fillRequiredGlobalInformation(page)
            await STEP.fillDataInformation(page)

            await test.step('Submit', async () => {
                const [ request ] = await Promise.all([
                    page.waitForGqlRequest('createCampaign'),
                    page.campaignCreate.createButton.click(),
                ]);

                const data = await request.postDataJSON();
                expect(data.operationName).toEqual('createCampaign' as GqlMutation);
                const variables: CreateCampaignMutationVariables = data.variables;
                expect(variables).toEqual({
                    name: campaign.name,
                    datasetID: dataset.id,
                    analysisIDs: [ spectrogramAnalysis.id ],
                    instructionsUrl: '',
                    description: '',
                    allowImageTuning: false,
                    allowColormapTuning: false,
                    colormapDefault: null,
                    colormapInvertedDefault: false,
                    allowDigitalZoom: false,
                } as CreateCampaignMutationVariables)
            })
        }),

    canSubmitAllFields: ({ as, tag }: Pick<Params, 'as' | 'tag'>) =>
        test(`Can submit all fields as ${ as }`, { tag }, async ({ page }) => {
            await interceptRequests(page, { getCurrentUser: as })
            await STEP.navigate(page, { as })

            await STEP.fillAllGlobalInformation(page)
            await STEP.fillDataInformation(page)
            await STEP.fillSpectrogramInformation(page)

            await test.step('Submit', async () => {
                const [ request ] = await Promise.all([
                    page.waitForGqlRequest('createCampaign'),
                    page.campaignCreate.createButton.click(),
                ]);

                const data = await request.postDataJSON();
                expect(data.operationName).toEqual('createCampaign' as GqlMutation);
                const variables: CreateCampaignMutationVariables = data.variables;
                expect(variables).toEqual({
                    name: campaign.name,
                    datasetID: dataset.id,
                    analysisIDs: [ spectrogramAnalysis.id ],
                    instructionsUrl: campaign.instructionsUrl,
                    description: campaign.description,
                    deadline: campaign.deadline,
                    allowImageTuning: true,
                    allowColormapTuning: true,
                    colormapDefault: 'hsv',
                    colormapInvertedDefault: true,
                    allowDigitalZoom: true,
                } as CreateCampaignMutationVariables)
            })
        }),

    handleSubmissionErrors: ({ as, tag }: Pick<Params, 'as' | 'tag'>) =>
        test(`Handle submission errors as ${ as }`, { tag }, async ({ page }) => {
            await interceptRequests(page, {
                getCurrentUser: as,
                createCampaign: 'failed',
            })
            await STEP.navigate(page, { as })

            await STEP.fillAllGlobalInformation(page)
            await STEP.fillDataInformation(page)
            await STEP.fillSpectrogramInformation(page)

            await test.step('Submit', () => Promise.all([
                page.waitForGqlRequest('createCampaign'),
                page.campaignCreate.createButton.click(),
            ]))

            await test.step('Display errors', async () => {
                await expect(page.getByText(mockError('name'), { exact: true })).toBeVisible()
                await expect(page.getByText(mockError('description'), { exact: true })).toBeVisible()
                await expect(page.getByText(mockError('instructionsUrl'), { exact: true })).toBeVisible()
                await expect(page.getByText(mockError('deadline'), { exact: true })).toBeVisible()
                await expect(page.getByText(mockError('datasetID'), { exact: true })).toBeVisible()
                await expect(page.getByText(mockError('analysisIDs'), { exact: true })).toBeVisible()
                await expect(page.getByText(mockError('colormapDefault'), { exact: true })).toBeVisible()
            })
        }),

}

// Tests
test.describe('/annotation-campaign/new', () => {
    const as: UserType = 'staff'

    TEST.canSubmitOnlyRequiredFields({ as, tag: essentialTag })

    TEST.canSubmitAllFields({ as, tag: essentialTag })

    TEST.handleSubmissionErrors({ as, tag: essentialTag })

})
