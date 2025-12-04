import * as Types from '../types.gql-generated';

import { gqlAPI } from '@/api/baseGqlApi';
export type ListConfidenceSetsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ListConfidenceSetsQuery = { __typename?: 'Query', allConfidenceSets?: { __typename?: 'ConfidenceSetNodeNodeConnection', results: Array<{ __typename?: 'ConfidenceSetNode', id: string, name: string, desc?: string | null, confidenceIndicators?: Array<{ __typename?: 'ConfidenceNode', label: string, level: number } | null> | null } | null> } | null };


export const ListConfidenceSetsDocument = `
    query listConfidenceSets {
  allConfidenceSets {
    results {
      id
      name
      desc
      confidenceIndicators {
        label
        level
      }
    }
  }
}
    `;

const injectedRtkApi = gqlAPI.injectEndpoints({
  endpoints: (build) => ({
    listConfidenceSets: build.query<ListConfidenceSetsQuery, ListConfidenceSetsQueryVariables | void>({
      query: (variables) => ({ document: ListConfidenceSetsDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


