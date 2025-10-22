import { COLLABORATOR_QUERIES } from './collaborators';
import { AUTH_QUERIES } from './auth';
import { PHASE_DOWNLOADS } from './phase';

type RestQueries =
  typeof COLLABORATOR_QUERIES
  & typeof PHASE_DOWNLOADS
  & typeof AUTH_QUERIES
type RestQuery = keyof RestQueries

const REST_MOCK_QUERIES: RestQueries = {
  // TODO: add queries
  ...COLLABORATOR_QUERIES,
  ...PHASE_DOWNLOADS,
  ...AUTH_QUERIES,
}

// // TODO: fill Mutation type
// type RestMutation = never
// const REST_MOCK_MUTATIONS: {
//   [key in RestMutation]: EmptyMutation
// } = {
//   // TODO: add missing mutations
// }

export const REST_MOCK = {
  ...REST_MOCK_QUERIES,
  // ...REST_MOCK_MUTATIONS,
}

export type RestOperationName = RestQuery
export type RestOperations = { [key in RestOperationName]?: keyof RestQueries[key]; }
