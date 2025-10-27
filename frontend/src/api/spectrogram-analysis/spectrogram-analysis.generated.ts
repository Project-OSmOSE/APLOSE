import * as Types from '../types.gql-generated';

import { gqlAPI } from '@/api/baseGqlApi';
export type ListSpectrogramAnalysisQueryVariables = Types.Exact<{
  datasetID?: Types.InputMaybe<Types.Scalars['ID']['input']>;
  annotationCampaignID?: Types.InputMaybe<Types.Scalars['ID']['input']>;
}>;


export type ListSpectrogramAnalysisQuery = { __typename?: 'Query', allSpectrogramAnalysis?: { __typename?: 'SpectrogramAnalysisNodeNodeConnection', results: Array<{ __typename?: 'SpectrogramAnalysisNode', id: string, name: string, description?: string | null, createdAt: any, legacy: boolean, dataDuration?: number | null, fft: { __typename?: 'FFTNode', samplingFrequency: number, nfft: number, windowSize: number, overlap: any }, spectrograms?: { __typename?: 'SpectrogramNodeNodeConnection', totalCount?: number | null, start?: any | null, end?: any | null } | null } | null> } | null };

export type ListAvailableSpectrogramAnalysisForImportQueryVariables = Types.Exact<{
  datasetID: Types.Scalars['ID']['input'];
}>;


export type ListAvailableSpectrogramAnalysisForImportQuery = { __typename?: 'Query', allAnalysisForImport?: Array<{ __typename?: 'ImportAnalysisNode', name: string, path: string } | null> | null, datasetById?: { __typename?: 'DatasetNode', name: string, path: string } | null };

export type ImportSpectrogramAnalysisMutationVariables = Types.Exact<{
  datasetName: Types.Scalars['String']['input'];
  datasetPath: Types.Scalars['String']['input'];
  legacy?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
  name: Types.Scalars['String']['input'];
  path: Types.Scalars['String']['input'];
}>;


export type ImportSpectrogramAnalysisMutation = { __typename?: 'Mutation', importSpectrogramAnalysis?: { __typename?: 'ImportAnalysisMutation', ok?: boolean | null } | null };


export const ListSpectrogramAnalysisDocument = `
    query listSpectrogramAnalysis($datasetID: ID, $annotationCampaignID: ID) {
  allSpectrogramAnalysis(
    orderBy: "-createdAt"
    dataset: $datasetID
    annotationCampaigns_Id: $annotationCampaignID
  ) {
    results {
      id
      name
      description
      createdAt
      legacy
      dataDuration
      fft {
        samplingFrequency
        nfft
        windowSize
        overlap
      }
      spectrograms {
        totalCount
        start
        end
      }
    }
  }
}
    `;
export const ListAvailableSpectrogramAnalysisForImportDocument = `
    query listAvailableSpectrogramAnalysisForImport($datasetID: ID!) {
  allAnalysisForImport(datasetId: $datasetID) {
    name
    path
  }
  datasetById(id: $datasetID) {
    name
    path
  }
}
    `;
export const ImportSpectrogramAnalysisDocument = `
    mutation importSpectrogramAnalysis($datasetName: String!, $datasetPath: String!, $legacy: Boolean, $name: String!, $path: String!) {
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
    listSpectrogramAnalysis: build.query<ListSpectrogramAnalysisQuery, ListSpectrogramAnalysisQueryVariables | void>({
      query: (variables) => ({ document: ListSpectrogramAnalysisDocument, variables })
    }),
    listAvailableSpectrogramAnalysisForImport: build.query<ListAvailableSpectrogramAnalysisForImportQuery, ListAvailableSpectrogramAnalysisForImportQueryVariables>({
      query: (variables) => ({ document: ListAvailableSpectrogramAnalysisForImportDocument, variables })
    }),
    importSpectrogramAnalysis: build.mutation<ImportSpectrogramAnalysisMutation, ImportSpectrogramAnalysisMutationVariables>({
      query: (variables) => ({ document: ImportSpectrogramAnalysisDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


