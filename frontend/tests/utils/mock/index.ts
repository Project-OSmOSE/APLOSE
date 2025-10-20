import { DATASET_QUERIES, type DatasetMutations } from './dataset';
import { EMPTY_MUTATION, type EmptyMutation, type MockType } from './types';
import { Page, Route } from 'playwright-core';
import { CAMPAIGN_QUERIES, type CampaignMutations } from './campaign';
import { ANALYSIS_QUERIES, type AnalysisMutations } from './spectrogramAnalysis';
import { CHANNEL_CONFIGURATION_QUERIES } from './channelConfiguration';

export * from './types'

// TODO: fill Queries type
type Queries =
  typeof DATASET_QUERIES
  & typeof CAMPAIGN_QUERIES
  & typeof ANALYSIS_QUERIES
  & typeof CHANNEL_CONFIGURATION_QUERIES
export type Query = keyof Queries

const MOCK_QUERIES: Queries = {
  ...DATASET_QUERIES,
  ...CAMPAIGN_QUERIES,
  ...ANALYSIS_QUERIES,
  ...CHANNEL_CONFIGURATION_QUERIES,
  // TODO: add queries
}

// TODO: fill Mutation type
export type Mutation = DatasetMutations | CampaignMutations | AnalysisMutations
const MOCK_MUTATIONS: {
  [key in Mutation]: EmptyMutation
} = {
  importDataset: EMPTY_MUTATION,
  importSpectrogramAnalysis: EMPTY_MUTATION,
  createAnnotationCampaign: EMPTY_MUTATION,
  archiveAnnotationCampaign: EMPTY_MUTATION,
  updateAnnotationCampaignFeaturedLabels: EMPTY_MUTATION,
  // TODO: add missing mutations
}

export const MOCK = { ...MOCK_QUERIES, ...MOCK_MUTATIONS }

type Operations = { [key in Query | Mutation]?: MockType }

export async function interceptGQL(
  page: Page,
  operations: Operations,
): Promise<Record<string, unknown>[]> {
  // A list of GQL variables which the handler has been called with.
  const reqs: Record<string, unknown>[] = [];

  // Register a new handler which intercepts all GQL requests.
  await page.route('**/graphql', function (route: Route) {
    const req = route.request().postDataJSON();

    if (!Object.keys(operations).includes(req.operationName)) {
      return route.fallback();
    }

    // Store what variables we called the API with.
    reqs.push(req.variables);

    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: MOCK[req.operationName][operations[req.operationName]] }),
    });
  });

  return reqs;
}
