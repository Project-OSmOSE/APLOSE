import * as Types from '../types.gql-generated';

import { gqlAPI } from '@/api/baseGqlApi';
export type ListDatasetsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ListDatasetsQuery = { __typename?: 'Query', allDatasets?: { __typename?: 'DatasetNodeNodeConnection', results: Array<{ __typename?: 'DatasetNode', id: string, name: string, description?: string | null, createdAt: any, legacy: boolean, analysisCount?: number | null, filesCount?: number | null, start?: any | null, end?: any | null } | null> } | null };

export type GetDatasetByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type GetDatasetByIdQuery = { __typename?: 'Query', datasetById?: { __typename?: 'DatasetNode', id: string, name: string, path: string, description?: string | null, start?: any | null, end?: any | null, createdAt: any, legacy: boolean, owner: { __typename?: 'UserNode', displayName: string } } | null };

export type ListAvailableDatasetsForImportQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ListAvailableDatasetsForImportQuery = { __typename?: 'Query', allDatasetsAvailableForImport?: Array<{ __typename?: 'ImportDatasetType', name: string, path: string, legacy?: boolean | null, analysis?: Array<{ __typename?: 'ImportSpectrogramAnalysisType', name: string, path: string } | null> | null } | null> | null };

export type ImportDatasetMutationVariables = Types.Exact<{
  name: Types.Scalars['String']['input'];
  path: Types.Scalars['String']['input'];
  legacy?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
}>;


export type ImportDatasetMutation = { __typename?: 'Mutation', importDataset?: { __typename?: 'ImportDatasetMutation', ok: boolean } | null };

export type ListDatasetsAndAnalysisQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ListDatasetsAndAnalysisQuery = { __typename?: 'Query', allDatasets?: { __typename?: 'DatasetNodeNodeConnection', results: Array<{ __typename?: 'DatasetNode', id: string, name: string, spectrogramAnalysis: { __typename?: 'SpectrogramAnalysisNodeConnection', edges: Array<{ __typename?: 'SpectrogramAnalysisNodeEdge', node?: { __typename?: 'SpectrogramAnalysisNode', id: string, name: string, colormap: { __typename?: 'ColormapNode', name: string } } | null } | null> } } | null> } | null };


export const ListDatasetsDocument = `
    query listDatasets {
  allDatasets(orderBy: "-createdAt") {
    results {
      id
      name
      description
      createdAt
      legacy
      analysisCount
      filesCount
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
export const ListAvailableDatasetsForImportDocument = `
    query listAvailableDatasetsForImport {
  allDatasetsAvailableForImport {
    name
    path
    legacy
    analysis {
      name
      path
    }
  }
}
    `;
export const ImportDatasetDocument = `
    mutation importDataset($name: String!, $path: String!, $legacy: Boolean) {
  importDataset(name: $name, path: $path, legacy: $legacy) {
    ok
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
        edges {
          node {
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
    listAvailableDatasetsForImport: build.query<ListAvailableDatasetsForImportQuery, ListAvailableDatasetsForImportQueryVariables | void>({
      query: (variables) => ({ document: ListAvailableDatasetsForImportDocument, variables })
    }),
    importDataset: build.mutation<ImportDatasetMutation, ImportDatasetMutationVariables>({
      query: (variables) => ({ document: ImportDatasetDocument, variables })
    }),
    listDatasetsAndAnalysis: build.query<ListDatasetsAndAnalysisQuery, ListDatasetsAndAnalysisQueryVariables | void>({
      query: (variables) => ({ document: ListDatasetsAndAnalysisDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


