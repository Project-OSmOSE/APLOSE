import * as Types from '../types.gql-generated';

import { gqlAPI } from '@/api/baseGqlApi';
export type ListDatasetsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ListDatasetsQuery = { __typename?: 'Query', allDatasets?: { __typename?: 'DatasetNodeNodeConnection', results: Array<{ __typename?: 'DatasetNode', id: string, name: string, path: string, description?: string | null, createdAt: any, legacy: boolean, analysisCount: number, spectrogramCount: number, start?: any | null, end?: any | null } | null> } | null };

export type GetDatasetByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type GetDatasetByIdQuery = { __typename?: 'Query', datasetById?: { __typename?: 'DatasetNode', id: string, name: string, path: string, description?: string | null, start?: any | null, end?: any | null, createdAt: any, legacy: boolean, owner: { __typename?: 'UserNode', displayName: string } } | null };

export type ListDatasetsAndAnalysisQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ListDatasetsAndAnalysisQuery = { __typename?: 'Query', allDatasets?: { __typename?: 'DatasetNodeNodeConnection', results: Array<{ __typename?: 'DatasetNode', id: string, name: string, spectrogramAnalysis?: { __typename?: 'SpectrogramAnalysisNodeNodeConnection', results: Array<{ __typename?: 'SpectrogramAnalysisNode', id: string, name: string, colormap: { __typename?: 'ColormapNode', name: string } } | null> } | null } | null> } | null };


export const ListDatasetsDocument = `
    query listDatasets {
  allDatasets(orderBy: "-createdAt") {
    results {
      id
      name
      path
      description
      createdAt
      legacy
      analysisCount
      spectrogramCount
      start
      end
    }
  }
}
    `;
export const GetDatasetByIdDocument = `
    query getDatasetByID($id: ID!) {
  datasetById(id: $id) {
    id
    name
    path
    description
    start
    end
    createdAt
    legacy
    owner {
      displayName
    }
  }
}
    `;
export const ListDatasetsAndAnalysisDocument = `
    query listDatasetsAndAnalysis {
  allDatasets(orderBy: "name") {
    results {
      id
      name
      spectrogramAnalysis(orderBy: "name") {
        results {
          id
          name
          colormap {
            name
          }
        }
      }
    }
  }
}
    `;

const injectedRtkApi = gqlAPI.injectEndpoints({
  endpoints: (build) => ({
    listDatasets: build.query<ListDatasetsQuery, ListDatasetsQueryVariables | void>({
      query: (variables) => ({ document: ListDatasetsDocument, variables })
    }),
    getDatasetByID: build.query<GetDatasetByIdQuery, GetDatasetByIdQueryVariables>({
      query: (variables) => ({ document: GetDatasetByIdDocument, variables })
    }),
    listDatasetsAndAnalysis: build.query<ListDatasetsAndAnalysisQuery, ListDatasetsAndAnalysisQueryVariables | void>({
      query: (variables) => ({ document: ListDatasetsAndAnalysisDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


