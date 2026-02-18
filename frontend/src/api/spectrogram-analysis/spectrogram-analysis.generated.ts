import * as Types from '../types.gql-generated';

import { gqlAPI } from '@/api/baseGqlApi';
export type ListSpectrogramAnalysisQueryVariables = Types.Exact<{
  datasetID?: Types.InputMaybe<Types.Scalars['ID']['input']>;
  annotationCampaignID?: Types.InputMaybe<Types.Scalars['ID']['input']>;
}>;


export type ListSpectrogramAnalysisQuery = { __typename?: 'Query', allSpectrogramAnalysis?: { __typename?: 'SpectrogramAnalysisNodeNodeConnection', results: Array<{ __typename?: 'SpectrogramAnalysisNode', id: string, name: string, description?: string | null, createdAt: any, legacy: boolean, dataDuration?: number | null, start?: any | null, end?: any | null, fft: { __typename?: 'FFTNode', samplingFrequency: number, nfft: number, windowSize: number, overlap: any }, spectrograms?: { __typename?: 'SpectrogramNodeNodeConnection', totalCount: number } | null } | null> } | null };


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
      start
      end
      fft {
        samplingFrequency
        nfft
        windowSize
        overlap
      }
      spectrograms {
        totalCount
      }
    }
  }
}
    `;

const injectedRtkApi = gqlAPI.injectEndpoints({
  endpoints: (build) => ({
    listSpectrogramAnalysis: build.query<ListSpectrogramAnalysisQuery, ListSpectrogramAnalysisQueryVariables | void>({
      query: (variables) => ({ document: ListSpectrogramAnalysisDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


