import * as Types from '../types.gql-generated';

import { gqlAPI } from '@/api/baseGqlApi';

export type BrowseStorageQueryVariables = Types.Exact<{
    path?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type BrowseStorageQuery = {
    __typename?: 'Query',
    browse?: Array<{ __typename: 'AnalysisStorageNode', name: string, path: string, importStatus: Types.Status } | {
        __typename: 'DatasetStorageNode',
        name: string,
        path: string,
        importStatus: Types.Status
    } | { __typename: 'FolderNode', name: string, path: string } | null> | null
};

export type ImportDatasetFromStorageMutationVariables = Types.Exact<{
    path: Types.Scalars['String']['input'];
}>;


export type ImportDatasetFromStorageMutation = {
    __typename?: 'Mutation',
    importDataset?: { __typename?: 'ImportDatasetMutation', ok?: boolean | null } | null
};

export type ImportAnalysisFromStorageMutationVariables = Types.Exact<{
    name: Types.Scalars['String']['input'];
    datasetPath: Types.Scalars['String']['input'];
}>;


export type ImportAnalysisFromStorageMutation = {
    __typename?: 'Mutation',
    importAnalysis?: { __typename?: 'ImportAnalysisMutation', ok?: boolean | null } | null
};


export const BrowseStorageDocument = `
    query browseStorage($path: String) {
  browse(path: $path) {
    ... on FolderNode {
      __typename
      name
      path
    }
    ... on DatasetStorageNode {
      __typename
      name
      path
      importStatus
    }
    ... on AnalysisStorageNode {
      __typename
      name
      path
      importStatus
    }
  }
}
    `;
export const ImportDatasetFromStorageDocument = `
    mutation importDatasetFromStorage($path: String!) {
  importDataset(path: $path) {
    ok
  }
}
    `;
export const ImportAnalysisFromStorageDocument = `
    mutation importAnalysisFromStorage($name: String!, $datasetPath: String!) {
  importAnalysis(name: $name, datasetPath: $datasetPath) {
    ok
  }
}
    `;

const injectedRtkApi = gqlAPI.injectEndpoints({
    endpoints: (build) => ({
        browseStorage: build.query<BrowseStorageQuery, BrowseStorageQueryVariables | void>({
            query: (variables) => ({ document: BrowseStorageDocument, variables }),
        }),
        importDatasetFromStorage: build.mutation<ImportDatasetFromStorageMutation, ImportDatasetFromStorageMutationVariables>({
            query: (variables) => ({ document: ImportDatasetFromStorageDocument, variables }),
        }),
        importAnalysisFromStorage: build.mutation<ImportAnalysisFromStorageMutation, ImportAnalysisFromStorageMutationVariables>({
            query: (variables) => ({ document: ImportAnalysisFromStorageDocument, variables }),
        }),
    }),
});

export { injectedRtkApi as api };


