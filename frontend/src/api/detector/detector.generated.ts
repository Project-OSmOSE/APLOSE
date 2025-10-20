import * as Types from '../types.gql-generated';

import { gqlAPI } from '@/api/baseGqlApi';
export type ListDetectorsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ListDetectorsQuery = { __typename?: 'Query', allDetectors?: { __typename?: 'DetectorNodeNodeConnection', results: Array<{ __typename?: 'DetectorNode', id: string, name: string, configurations?: Array<{ __typename?: 'DetectorConfigurationNode', id: string, configuration: string } | null> | null } | null> } | null };


export const ListDetectorsDocument = `
    query listDetectors {
  allDetectors {
    results {
      id
      name
      configurations {
        id
        configuration
      }
    }
  }
}
    `;

const injectedRtkApi = gqlAPI.injectEndpoints({
  endpoints: (build) => ({
    listDetectors: build.query<ListDetectorsQuery, ListDetectorsQueryVariables | void>({
      query: (variables) => ({ document: ListDetectorsDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


