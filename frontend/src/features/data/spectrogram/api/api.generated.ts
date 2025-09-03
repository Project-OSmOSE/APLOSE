import * as Types from '../../../gql/types.generated';

import { gqlAPI } from '@/features/gql/baseApi.ts';
export type GetSpectrogramsForCampaignQueryVariables = Types.Exact<{
  campaignID: Types.Scalars['ID']['input'];
  annotatorID: Types.Scalars['ID']['input'];
  phase: Types.AnnotationPhaseType;
  offset: Types.Scalars['Int']['input'];
}>;


export type GetSpectrogramsForCampaignQuery = { __typename?: 'Query', allSpectrograms?: { __typename?: 'SpectrogramNodeNodeConnection', totalCount?: number | null, results: Array<{ __typename?: 'SpectrogramNode', id: string, filename: string, start: any, duration: number } | null> } | null };

export type GetSpectrogramsForCampaignComplementaryQueryVariables = Types.Exact<{
  campaignID: Types.Scalars['ID']['input'];
  annotatorID: Types.Scalars['ID']['input'];
  phase: Types.AnnotationPhaseType;
  spectroIds: Array<Types.InputMaybe<Types.Scalars['ID']['input']>> | Types.InputMaybe<Types.Scalars['ID']['input']>;
}>;


export type GetSpectrogramsForCampaignComplementaryQuery = { __typename?: 'Query', annotatorAnnotations?: { __typename?: 'AnnotationNodeNodeConnection', results: Array<{ __typename?: 'AnnotationNode', type: Types.AnnotationType, spectrogram: { __typename?: 'SpectrogramNode', id: string } } | null> } | null, otherAnnotations?: { __typename?: 'AnnotationNodeNodeConnection', results: Array<{ __typename?: 'AnnotationNode', type: Types.AnnotationType, spectrogram: { __typename?: 'SpectrogramNode', id: string } } | null> } | null, allAnnotationTasks?: { __typename?: 'AnnotationTaskNodeNodeConnection', results: Array<{ __typename?: 'AnnotationTaskNode', status?: Types.AnnotationTaskStatus | null, spectrogram: { __typename?: 'SpectrogramNode', id: string } } | null> } | null };


export const GetSpectrogramsForCampaignDocument = `
    query getSpectrogramsForCampaign($campaignID: ID!, $annotatorID: ID!, $phase: AnnotationPhaseType!, $offset: Int!) {
  allSpectrograms(
    limit: 20
    offset: $offset
    campaignId: $campaignID
    phaseType: $phase
    annotatorId: $annotatorID
    orderBy: "start"
  ) {
    results {
      id
      filename
      start
      duration
    }
    totalCount
  }
}
    `;
export const GetSpectrogramsForCampaignComplementaryDocument = `
    query getSpectrogramsForCampaignComplementary($campaignID: ID!, $annotatorID: ID!, $phase: AnnotationPhaseType!, $spectroIds: [ID]!) {
  annotatorAnnotations: allAnnotations(
    annotatorId: $annotatorID
    annotationCampaignId: $campaignID
    phaseType: $phase
    spectrogramId_In: $spectroIds
  ) {
    results {
      type
      spectrogram {
        id
      }
    }
  }
  otherAnnotations: allAnnotations(
    notAnnotatorId: $annotatorID
    annotationCampaignId: $campaignID
    phaseType: $phase
    spectrogramId_In: $spectroIds
  ) {
    results {
      type
      spectrogram {
        id
      }
    }
  }
  allAnnotationTasks(
    annotatorId: $annotatorID
    annotationCampaignId: $campaignID
    phaseType: $phase
    spectrogramId_In: $spectroIds
  ) {
    results {
      status
      spectrogram {
        id
      }
    }
  }
}
    `;

const injectedRtkApi = gqlAPI.injectEndpoints({
  endpoints: (build) => ({
    getSpectrogramsForCampaign: build.query<GetSpectrogramsForCampaignQuery, GetSpectrogramsForCampaignQueryVariables>({
      query: (variables) => ({ document: GetSpectrogramsForCampaignDocument, variables })
    }),
    getSpectrogramsForCampaignComplementary: build.query<GetSpectrogramsForCampaignComplementaryQuery, GetSpectrogramsForCampaignComplementaryQueryVariables>({
      query: (variables) => ({ document: GetSpectrogramsForCampaignComplementaryDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


