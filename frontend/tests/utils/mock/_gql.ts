import { DATASET_MUTATIONS, DATASET_QUERIES } from './dataset';
import { ANALYSIS_MUTATIONS, ANALYSIS_QUERIES } from './spectrogramAnalysis';
import { CAMPAIGN_MUTATIONS, CAMPAIGN_QUERIES } from './campaign';
import { CHANNEL_CONFIGURATION_QUERIES } from './channelConfiguration';
import { GET_CURRENT_USER_QUERY, USER_QUERIES, type UserType } from './user';
import { PHASE_MUTATIONS, PHASE_QUERIES } from './phase';
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

type GqlMutations =
  typeof DATASET_MUTATIONS
  & typeof ANALYSIS_MUTATIONS
  & typeof CAMPAIGN_MUTATIONS
  & typeof PHASE_MUTATIONS
export type GqlMutation = keyof GqlMutations

const GQL_MOCK_MUTATIONS: GqlMutations = {
  ...DATASET_MUTATIONS,
  ...ANALYSIS_MUTATIONS,
  ...CAMPAIGN_MUTATIONS,
  ...PHASE_MUTATIONS,
  // TODO: add mutations
}

// TODO: fill Mutation type

export const GQL_MOCK = {
  ...GQL_MOCK_QUERIES,
  ...GQL_MOCK_MUTATIONS,
}

export type GqlOperations = { [key in keyof GqlQueries]?: keyof GqlQueries[key] }
  & { [key in keyof GqlMutations]?: keyof GqlMutations[key] }
  & { getCurrentUser: UserType | 'empty' }
