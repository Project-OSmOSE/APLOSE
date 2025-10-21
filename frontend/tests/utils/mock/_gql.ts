import { EMPTY_MUTATION, type EmptyMutation } from './_types';
import { DATASET_QUERIES, type DatasetMutations } from './dataset';
import { ANALYSIS_QUERIES, type AnalysisMutations } from './spectrogramAnalysis';
import { CAMPAIGN_QUERIES, type CampaignMutations } from './campaign';
import { CHANNEL_CONFIGURATION_QUERIES } from './channelConfiguration';
import { GET_CURRENT_USER_QUERY, USER_QUERIES, type UserType } from './user';
import { PHASE_QUERIES, type PhaseMutations } from './phase';
import { TASK_QUERIES } from './task';

type GqlQueries =
  typeof DATASET_QUERIES
  & typeof CHANNEL_CONFIGURATION_QUERIES
  & typeof ANALYSIS_QUERIES
  & typeof CAMPAIGN_QUERIES
  & typeof USER_QUERIES
  & typeof PHASE_QUERIES
  & typeof TASK_QUERIES

const GQL_MOCK_QUERIES: GqlQueries & { getCurrentUser: typeof GET_CURRENT_USER_QUERY } = {
  ...DATASET_QUERIES,
  ...CHANNEL_CONFIGURATION_QUERIES,
  ...ANALYSIS_QUERIES,
  ...CAMPAIGN_QUERIES,
  ...USER_QUERIES,
  ...PHASE_QUERIES,
  ...TASK_QUERIES,
  getCurrentUser: GET_CURRENT_USER_QUERY,
  // TODO: add queries
}

// TODO: fill Mutation type
export type GqlMutation = DatasetMutations
  | AnalysisMutations
  | CampaignMutations
  | PhaseMutations
const GQL_MOCK_MUTATIONS: {
  [key in GqlMutation]: EmptyMutation
} = {
  importDataset: EMPTY_MUTATION,
  importSpectrogramAnalysis: EMPTY_MUTATION,
  createAnnotationCampaign: EMPTY_MUTATION,
  archiveAnnotationCampaign: EMPTY_MUTATION,
  updateAnnotationCampaignFeaturedLabels: EMPTY_MUTATION,
  createAnnotationPhase: EMPTY_MUTATION,
  createVerificationPhase: EMPTY_MUTATION,
  endPhase: EMPTY_MUTATION,
  // TODO: add missing mutations
}
type GqlMutations = typeof GQL_MOCK_MUTATIONS

export const GQL_MOCK = {
  ...GQL_MOCK_QUERIES,
  ...GQL_MOCK_MUTATIONS,
}

export type GqlOperations = { [key in keyof GqlQueries]?: keyof GqlQueries[key] }
  & { [key in keyof GqlMutations]?: keyof GqlMutations[key] }
  & { getCurrentUser: UserType | 'empty' }
