import * as Types from '../../../gql/types.generated';

import { gqlAPI } from '@/features/gql/baseApi.ts';
export type GetSpectrogramAnalysisQueryVariables = Types.Exact<{
  datasetID?: Types.InputMaybe<Types.Scalars['Decimal']['input']>;
  annotationCampaignID?: Types.InputMaybe<Types.Scalars['Decimal']['input']>;
}>;


export type GetSpectrogramAnalysisQuery = { __typename?: 'Query', allSpectrogramAnalysis?: { __typename?: 'SpectrogramAnalysisNodeNodeConnection', results: Array<{ __typename?: 'SpectrogramAnalysisNode', id: string, name: string, description?: string | null, createdAt: any, legacy: boolean, filesCount?: number | null, start?: any | null, end?: any | null, dataDuration?: number | null, fft: { __typename?: 'FFTNode', samplingFrequency: number, nfft: number, windowSize: number, overlap: any } } | null> } | null };

export type GetAvailableSpectrogramAnalysisForImportQueryVariables = Types.Exact<{
  datasetID: Types.Scalars['ID']['input'];
}>;


export type GetAvailableSpectrogramAnalysisForImportQuery = { __typename?: 'Query', allSpectrogramAnalysisForImport?: Array<{ __typename?: 'ImportSpectrogramAnalysisType', name: string, path: string } | null> | null };

export type PostAnalysisForImportMutationVariables = Types.Exact<{
  datasetName: Types.Scalars['String']['input'];
  datasetPath: Types.Scalars['String']['input'];
  legacy?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
  name: Types.Scalars['String']['input'];
  path: Types.Scalars['String']['input'];
}>;


export type PostAnalysisForImportMutation = { __typename?: 'Mutation', importSpectrogramAnalysis?: { __typename?: 'ImportSpectrogramAnalysisMutation', ok?: boolean | null } | null };


export const GetSpectrogramAnalysisDocument = `
    query getSpectrogramAnalysis($datasetID: Decimal, $annotationCampaignID: Decimal) {
  allSpectrogramAnalysis(
    orderBy: "-createdAt"
    datasetId: $datasetID
    annotationCampaigns_Id: $annotationCampaignID
  ) {
    results {
      id
      name
      description
      createdAt
      legacy
      filesCount
      start
      end
      dataDuration
      fft {
        samplingFrequency
        nfft
        windowSize
        overlap
      }
    }
  }
}
    `;
export const GetAvailableSpectrogramAnalysisForImportDocument = `
    query getAvailableSpectrogramAnalysisForImport($datasetID: ID!) {
  allSpectrogramAnalysisForImport(datasetId: $datasetID) {
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
    getSpectrogramAnalysis: build.query<GetSpectrogramAnalysisQuery, GetSpectrogramAnalysisQueryVariables | void>({
      query: (variables) => ({ document: GetSpectrogramAnalysisDocument, variables })
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


