import * as Types from '../../../gql/types.generated';

import { gqlAPI } from '@/features/gql/baseApi.ts';
export type GetAvailableDatasetsForImportQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAvailableDatasetsForImportQuery = { __typename?: 'Query', allDatasetsAvailableForImport?: Array<{ __typename?: 'ImportDatasetType', name: string, path: string, legacy?: boolean | null, analysis?: Array<{ __typename?: 'ImportSpectrogramAnalysisType', name: string, path: string } | null> | null } | null> | null };

export type PostDatasetForImportMutationVariables = Types.Exact<{
  name: Types.Scalars['String']['input'];
  path: Types.Scalars['String']['input'];
  legacy?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
}>;


export type PostDatasetForImportMutation = { __typename?: 'Mutation', importDataset?: { __typename?: 'ImportDatasetMutation', ok: boolean } | null };

export type GetAvailableSpectrogramAnalysisForImportQueryVariables = Types.Exact<{
  datasetID: Types.Scalars['PK']['input'];
}>;


export type GetAvailableSpectrogramAnalysisForImportQuery = { __typename?: 'Query', allSpectrogramAnalysisForImport?: Array<{ __typename?: 'ImportSpectrogramAnalysisType', name: string, path: string } | null> | null, datasetByPk?: { __typename?: 'DatasetNode', name: string, path: string } | null };

export type PostAnalysisForImportMutationVariables = Types.Exact<{
  datasetName: Types.Scalars['String']['input'];
  datasetPath: Types.Scalars['String']['input'];
  legacy?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
  name: Types.Scalars['String']['input'];
  path: Types.Scalars['String']['input'];
}>;


export type PostAnalysisForImportMutation = { __typename?: 'Mutation', importSpectrogramAnalysis?: { __typename?: 'ImportSpectrogramAnalysisMutation', ok?: boolean | null } | null };


export const GetAvailableDatasetsForImportDocument = `
    query getAvailableDatasetsForImport {
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
export const PostDatasetForImportDocument = `
    mutation postDatasetForImport($name: String!, $path: String!, $legacy: Boolean) {
  importDataset(name: $name, path: $path, legacy: $legacy) {
    ok
  }
}
    `;
export const GetAvailableSpectrogramAnalysisForImportDocument = `
    query getAvailableSpectrogramAnalysisForImport($datasetID: PK!) {
  allSpectrogramAnalysisForImport(datasetId: $datasetID) {
    name
    path
  }
  datasetByPk(pk: $datasetID) {
    name
    path
  }
}
    `;
export const PostAnalysisForImportDocument = `
    mutation postAnalysisForImport($datasetName: String!, $datasetPath: String!, $legacy: Boolean, $name: String!, $path: String!) {
  importSpectrogramAnalysis(
    datasetName: $datasetName
    datasetPath: $datasetPath
    legacy: $legacy
    name: $name
    path: $path
  ) {
    ok
  }
}
    `;

const injectedRtkApi = gqlAPI.injectEndpoints({
  endpoints: (build) => ({
    getAvailableDatasetsForImport: build.query<GetAvailableDatasetsForImportQuery, GetAvailableDatasetsForImportQueryVariables | void>({
      query: (variables) => ({ document: GetAvailableDatasetsForImportDocument, variables })
    }),
    postDatasetForImport: build.mutation<PostDatasetForImportMutation, PostDatasetForImportMutationVariables>({
      query: (variables) => ({ document: PostDatasetForImportDocument, variables })
    }),
    getAvailableSpectrogramAnalysisForImport: build.query<GetAvailableSpectrogramAnalysisForImportQuery, GetAvailableSpectrogramAnalysisForImportQueryVariables>({
      query: (variables) => ({ document: GetAvailableSpectrogramAnalysisForImportDocument, variables })
    }),
    postAnalysisForImport: build.mutation<PostAnalysisForImportMutation, PostAnalysisForImportMutationVariables>({
      query: (variables) => ({ document: PostAnalysisForImportDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


