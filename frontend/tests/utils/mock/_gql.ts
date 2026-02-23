import { DATASET_QUERIES } from './dataset';
import { ANALYSIS_MUTATIONS, ANALYSIS_QUERIES } from './spectrogramAnalysis';
import { CAMPAIGN_MUTATIONS, CAMPAIGN_QUERIES } from './campaign';
import { LABEL_SET_QUERIES } from './labelSet';
import { CHANNEL_CONFIGURATION_QUERIES } from './channelConfiguration';
import { GET_CURRENT_USER_QUERY, USER_QUERIES } from './user';
import { PHASE_MUTATIONS, PHASE_QUERIES } from './phase';
import { TASK_MUTATIONS, TASK_QUERIES } from './task';
import { FILE_RANGE_MUTATIONS, FILE_RANGE_QUERIES } from './fileRange';
import type { UserType } from './types';
import { DETECTOR_QUERIES } from './detector';
import { COLLABORATOR_QUERIES } from './collaborators';
import { STORAGE_MUTATIONS, STORAGE_QUERIES } from './storage';

type GqlQueries =
  typeof DATASET_QUERIES
  & typeof STORAGE_QUERIES
  & typeof CHANNEL_CONFIGURATION_QUERIES
  & typeof ANALYSIS_QUERIES
  & typeof CAMPAIGN_QUERIES
  & typeof LABEL_SET_QUERIES
  & typeof USER_QUERIES
  & typeof PHASE_QUERIES
  & typeof TASK_QUERIES
  & typeof FILE_RANGE_QUERIES
  & typeof DETECTOR_QUERIES
  & typeof COLLABORATOR_QUERIES

const GQL_MOCK_QUERIES: GqlQueries & { getCurrentUser: typeof GET_CURRENT_USER_QUERY } = {
  ...DATASET_QUERIES,
  ...STORAGE_QUERIES,
  ...CHANNEL_CONFIGURATION_QUERIES,
  ...ANALYSIS_QUERIES,
  ...CAMPAIGN_QUERIES,
  ...LABEL_SET_QUERIES,
  ...USER_QUERIES,
  ...PHASE_QUERIES,
  ...TASK_QUERIES,
  ...FILE_RANGE_QUERIES,
  ...DETECTOR_QUERIES,
  ...COLLABORATOR_QUERIES,
  getCurrentUser: GET_CURRENT_USER_QUERY,
  // TODO: add queries
}

type GqlMutations =
  typeof STORAGE_MUTATIONS
  & typeof ANALYSIS_MUTATIONS
  & typeof CAMPAIGN_MUTATIONS
  & typeof TASK_MUTATIONS
  & typeof PHASE_MUTATIONS
  & typeof FILE_RANGE_MUTATIONS
export type GqlMutation = keyof GqlMutations

const GQL_MOCK_MUTATIONS: GqlMutations = {
  ...STORAGE_MUTATIONS,
  ...ANALYSIS_MUTATIONS,
  ...CAMPAIGN_MUTATIONS,
  ...TASK_MUTATIONS,
  ...PHASE_MUTATIONS,
  ...FILE_RANGE_MUTATIONS,
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
