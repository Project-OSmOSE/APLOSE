import * as Types from '../types.gql-generated';

import { gqlAPI } from '@/api/baseGqlApi';
export type ListLabelSetsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ListLabelSetsQuery = { __typename?: 'Query', allLabelSets?: { __typename?: 'LabelSetNodeNodeConnection', results: Array<{ __typename?: 'LabelSetNode', id: string, name: string, description?: string | null, labels: Array<{ __typename?: 'AnnotationLabelNode', id: string, name: string } | null> } | null> } | null };


export const ListLabelSetsDocument = `
    query listLabelSets {
  allLabelSets {
    results {
      id
      name
      description
      labels {
        id
        name
      }
    }
  }
}
    `;

const injectedRtkApi = gqlAPI.injectEndpoints({
  endpoints: (build) => ({
    listLabelSets: build.query<ListLabelSetsQuery, ListLabelSetsQueryVariables | void>({
      query: (variables) => ({ document: ListLabelSetsDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


