import * as Types from '../../../gql/types.generated';

import { gqlAPI } from '@/features/gql/baseApi.ts';
export type GetDatasetsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetDatasetsQuery = { __typename?: 'Query', allDatasets?: { __typename?: 'DatasetNodeNodeConnection', results: Array<{ __typename?: 'DatasetNode', pk: any, name: string, description?: string | null, createdAt: any, legacy: boolean, analysisCount?: number | null, filesCount?: number | null, start?: any | null, end?: any | null } | null> } | null };

export type GetDatasetByPkQueryVariables = Types.Exact<{
  pk: Types.Scalars['PK']['input'];
}>;


export type GetDatasetByPkQuery = { __typename?: 'Query', datasetByPk?: { __typename?: 'DatasetNode', pk: any, name: string, path: string, description?: string | null, start?: any | null, end?: any | null, createdAt: any, legacy: boolean, owner: { __typename?: 'UserNode', displayName: string } } | null };

export type GetSpectrogramAnalysisQueryVariables = Types.Exact<{
  datasetPK?: Types.InputMaybe<Types.Scalars['PK']['input']>;
  annotationCampaignPK?: Types.InputMaybe<Types.Scalars['PK']['input']>;
}>;


export type GetSpectrogramAnalysisQuery = { __typename?: 'Query', allSpectrogramAnalysis?: { __typename?: 'SpectrogramAnalysisNodeNodeConnection', results: Array<{ __typename?: 'SpectrogramAnalysisNode', pk: any, name: string, description?: string | null, createdAt: any, legacy: boolean, filesCount?: number | null, start?: any | null, end?: any | null, dataDuration?: number | null, fft: { __typename?: 'FFTNode', samplingFrequency: number, nfft: number, windowSize: number, overlap: any } } | null> } | null };


export const GetDatasetsDocument = `
    query getDatasets {
  allDatasets(orderBy: "-createdAt") {
    results {
      pk
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
export const GetDatasetByPkDocument = `
    query getDatasetByPk($pk: PK!) {
  datasetByPk(pk: $pk) {
    pk
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
export const GetSpectrogramAnalysisDocument = `
    query getSpectrogramAnalysis($datasetPK: PK, $annotationCampaignPK: PK) {
  allSpectrogramAnalysis(
    orderBy: "-createdAt"
    datasetId: $datasetPK
    annotationCampaignId: $annotationCampaignPK
  ) {
    results {
      pk
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

const injectedRtkApi = gqlAPI.injectEndpoints({
  endpoints: (build) => ({
    getDatasets: build.query<GetDatasetsQuery, GetDatasetsQueryVariables | void>({
      query: (variables) => ({ document: GetDatasetsDocument, variables })
    }),
    getDatasetByPk: build.query<GetDatasetByPkQuery, GetDatasetByPkQueryVariables>({
      query: (variables) => ({ document: GetDatasetByPkDocument, variables })
    }),
    getSpectrogramAnalysis: build.query<GetSpectrogramAnalysisQuery, GetSpectrogramAnalysisQueryVariables | void>({
      query: (variables) => ({ document: GetSpectrogramAnalysisDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


