import { API_URL, ESSENTIAL, expect, expectNoRequestsOnAction, test } from './utils';
import { gqlURL, interceptRequests, mockError } from './utils/mock';
import type { GqlMutation } from './utils/mock/_gql';
import { campaign } from './utils/mock/campaign';
import type {
  CreateAnnotationCampaignMutationVariables,
} from '../src/api/annotation-campaign/annotation-campaign.generated';
import { dataset } from './utils/mock/dataset';
import { spectrogramAnalysis } from './utils/mock/spectrogramAnalysis';

test.describe('Annotator', () => {

  test('Can submit only required fields', ESSENTIAL, async ({ page }) => {
    await interceptRequests(page, {
      getCurrentUser: 'annotator',
    })
    await page.campaign.create.go('annotator');
    await page.campaign.create.fillGlobal()
    await page.campaign.create.fillData()

    const [ request ] = await Promise.all([
      page.waitForRequest(gqlURL),
      page.campaign.create.createButton.click(),
    ]);

    await test.step('Check campaign', async () => {
      const data = await request.postDataJSON();
      expect(data.operationName).toEqual('createAnnotationCampaign' as GqlMutation);
      const variables: CreateAnnotationCampaignMutationVariables = data.variables;
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
      } as CreateAnnotationCampaignMutationVariables)
    })

    await expect(page.getByRole('heading', { name: campaign.name })).toBeVisible()
  })

  test('Can submit complete form', ESSENTIAL, async ({ page }) => {
    await interceptRequests(page, {
      getCurrentUser: 'annotator',
    })
    await page.campaign.create.go('annotator');
    await page.campaign.create.fillGlobal({ complete: true });
    await page.campaign.create.fillData();
    await page.campaign.create.fillColormap();
    const [ request ] = await Promise.all([
      page.waitForRequest(gqlURL),
      page.campaign.create.createButton.click(),
    ]);

    await test.step('Check campaign', async () => {
      const data = await request.postDataJSON();
      expect(data.operationName).toEqual('createAnnotationCampaign' as GqlMutation);
      const variables: CreateAnnotationCampaignMutationVariables = data.variables;
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
      } as CreateAnnotationCampaignMutationVariables)
    })
  })

  test('Handle errors', ESSENTIAL, async ({ page }) => {
    await interceptRequests(page, {
      getCurrentUser: 'annotator',
      createAnnotationCampaign: 'failed',
    })
    await page.campaign.create.go('annotator');
    await page.campaign.create.fillGlobal()
    await page.campaign.create.fillData()
    await page.campaign.create.fillColormap()

    await Promise.all([
      page.waitForRequest(gqlURL),
      await page.campaign.create.createButton.click(),
    ]);

    await test.step('Check errors are shown', async () => {
      await expect(page.getByText(mockError('name'), { exact: true })).toBeVisible()
      await expect(page.getByText(mockError('description'), { exact: true })).toBeVisible()
      await expect(page.getByText(mockError('instructionsUrl'), { exact: true })).toBeVisible()
      await expect(page.getByText(mockError('deadline'), { exact: true })).toBeVisible()
      await expect(page.getByText(mockError('datasetID'), { exact: true })).toBeVisible()
      await expect(page.getByText(mockError('analysisIDs'), { exact: true })).toBeVisible()
      await expect(page.getByText(mockError('colormapDefault'), { exact: true })).toBeVisible()
    });
  });

  test('Empty', async ({ page }) => {
    await interceptRequests(page, {
      getCurrentUser: 'annotator',
      listDatasetsAndAnalysis: 'empty',
    })
    await page.campaign.create.go('annotator');

    await test.step('Cannot select a dataset if none is imported', async () => {
      await expect(page.getByText('No datasets')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Import dataset' })).toBeEnabled();
    })

    await test.step('Cannot submit empty form', async () => {
      await expectNoRequestsOnAction(
        page,
        () => page.campaign.create.createButton.click(),
        API_URL.campaign.create,
      )
    })
  })
})
