import { EMPTY_MUTATION, type EmptyMutation, type GqlMockType } from './_types';
import { DATASET_QUERIES, type DatasetMutations } from './dataset';
import { ANALYSIS_QUERIES, type AnalysisMutations } from './spectrogramAnalysis';
import { CAMPAIGN_QUERIES, type CampaignMutations } from './campaign';
import { CHANNEL_CONFIGURATION_QUERIES } from './channelConfiguration';
import { GET_CURRENT_USER_QUERY, USER_QUERIES, type UserType } from './user';

type GqlQueries =
  typeof DATASET_QUERIES
  & typeof CHANNEL_CONFIGURATION_QUERIES
  & typeof ANALYSIS_QUERIES
  & typeof CAMPAIGN_QUERIES
  & typeof USER_QUERIES
type GqlQuery = keyof GqlQueries

const GQL_MOCK_QUERIES: GqlQueries & { getCurrentUser: typeof GET_CURRENT_USER_QUERY } = {
  ...DATASET_QUERIES,
  ...CHANNEL_CONFIGURATION_QUERIES,
  ...ANALYSIS_QUERIES,
  ...CAMPAIGN_QUERIES,
  ...USER_QUERIES,
  getCurrentUser: GET_CURRENT_USER_QUERY,
  // TODO: add queries
}

// TODO: fill Mutation type
type GqlMutation = DatasetMutations
  | AnalysisMutations
  | CampaignMutations
const GQL_MOCK_MUTATIONS: {
  [key in GqlMutation]: EmptyMutation
} = {
  importDataset: EMPTY_MUTATION,
  importSpectrogramAnalysis: EMPTY_MUTATION,
  createAnnotationCampaign: EMPTY_MUTATION,
  archiveAnnotationCampaign: EMPTY_MUTATION,
  updateAnnotationCampaignFeaturedLabels: EMPTY_MUTATION,
  // TODO: add missing mutations
}

export const GQL_MOCK = {
  ...GQL_MOCK_QUERIES,
  ...GQL_MOCK_MUTATIONS,
}

export type GqlOperationName = GqlQuery | GqlMutation | 'getCurrentUser'
export type GqlOperations = { [key in GqlQuery | GqlMutation]?: GqlMockType; } & { getCurrentUser: UserType | 'empty' }
