import { essential, expect, expectNoRequestsOnAction, type Page, test } from './utils';
import { gqlURL, interceptRequests, mockError } from './utils/mock';
import type { GqlMutation } from './utils/mock/_gql';
import { campaign, dataset, spectrogramAnalysis } from './utils/mock/types';
import type { CreateCampaignMutationVariables } from '../src/api/annotation-campaign/annotation-campaign.generated';
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
      await page.campaignCreate.selectDataset(dataset)
    }),

  fillColormapInformation: (page: Page) =>
    test.step('Fill colormap information', async () => {
      await page.campaignCreate.brightnessContrastCheckBox.click()
      await page.campaignCreate.colormapCheckBox.click()
      await page.campaignCreate.selectColormap('hsv')
      await page.campaignCreate.invertColormapCheckBox.click()
    }),
}

const TEST = {

  canSubmitOnlyRequiredFields: ({ as }: Pick<Params, 'as'>) =>
    test(`Can submit only required fields as ${ as }`, { tag: essential }, async ({ page }) => {
      await interceptRequests(page, { getCurrentUser: as })
      await STEP.navigate(page, { as })

      await STEP.fillRequiredGlobalInformation(page)
      await STEP.fillDataInformation(page)

      await test.step('Submit', async () => {
        const [ request ] = await Promise.all([
          page.waitForRequest(gqlURL),
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
          deadline: '',
          allowImageTuning: false,
          allowColormapTuning: false,
          colormapDefault: null,
          colormapInvertedDefault: null,
        } as CreateCampaignMutationVariables)
      })
    }),

  canSubmitAllFields: ({ as }: Pick<Params, 'as'>) =>
    test(`Can submit all fields as ${ as }`, { tag: essential }, async ({ page }) => {
      await interceptRequests(page, { getCurrentUser: as })
      await STEP.navigate(page, { as })

      await STEP.fillAllGlobalInformation(page)
      await STEP.fillDataInformation(page)
      await STEP.fillColormapInformation(page)

      await test.step('Submit', async () => {
        const [ request ] = await Promise.all([
          page.waitForRequest(gqlURL),
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
        } as CreateCampaignMutationVariables)
      })
    }),

  handleSubmissionErrors: ({ as }: Pick<Params, 'as'>) =>
    test(`Handle submission errors as ${ as }`, { tag: essential }, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: as,
        createCampaign: 'failed',
      })
      await STEP.navigate(page, { as })

      await STEP.fillAllGlobalInformation(page)
      await STEP.fillDataInformation(page)
      await STEP.fillColormapInformation(page)

      await test.step('Submit', () => Promise.all([
        page.waitForRequest(gqlURL),
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

  handleEmptyState: ({ as }: Pick<Params, 'as'>) =>
    test(`Handle empty state as ${ as }`, { tag: essential }, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: as,
        listDatasetsAndAnalysis: 'empty',
      })
      await STEP.navigate(page, { as })

      await test.step('Cannot select a dataset if none is imported', async () => {
        await expect(page.getByText('No datasets')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Import dataset' })).toBeEnabled();
      })

      await test.step('Cannot submit empty form', async () => {
        await expectNoRequestsOnAction(
          page,
          () => page.campaignCreate.createButton.click(),
          gqlURL,
        )
      })
    }),
}

// Tests
test.describe('[Campaign create]', () => {

  TEST.handleEmptyState({ as: 'annotator' })

  TEST.canSubmitOnlyRequiredFields({ as: 'annotator' })

  TEST.canSubmitAllFields({ as: 'annotator' })

  TEST.handleSubmissionErrors({ as: 'annotator' })

})
