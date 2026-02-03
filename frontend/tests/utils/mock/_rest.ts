import { AUTH_QUERIES } from './auth';
import { PHASE_DOWNLOADS } from './phase';
import { ANNOTATION_MUTATIONS } from './annotations';

type RestQueries =
  typeof PHASE_DOWNLOADS
  & typeof AUTH_QUERIES
type RestQuery = keyof RestQueries

const REST_MOCK_QUERIES: RestQueries = {
  // TODO: add queries
  ...PHASE_DOWNLOADS,
  ...AUTH_QUERIES,
}


type RestMutations =
  typeof ANNOTATION_MUTATIONS
type RestMutation = keyof RestMutations

const REST_MOCK_MUTATIONS: RestMutations = {
  // TODO: add mutations
  ...ANNOTATION_MUTATIONS,
}

export const REST_MOCK = {
  ...REST_MOCK_QUERIES,
  ...REST_MOCK_MUTATIONS,
}

export type RestOperations = {
  [key in RestQuery]?: keyof RestQueries[key];
} | {
  [key in RestMutation]?: keyof RestMutations[key];
}

