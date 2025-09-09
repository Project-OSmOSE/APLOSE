import * as Types from '../../types.generated';

import { gqlAPI } from '@/features/gql/baseApi.ts';
export type GetSpectrogramsFromDatesQueryVariables = Types.Exact<{
  fromDatetime: Types.Scalars['DateTime']['input'];
  toDatetime: Types.Scalars['DateTime']['input'];
  campaignID: Types.Scalars['PK']['input'];
  annotatorID: Types.Scalars['PK']['input'];
  phase: Types.AnnotationPhaseType;
  offset: Types.Scalars['Int']['input'];
  isTaskCompleted?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
  hasAnnotations?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
  annotatedByAnnotatorID?: Types.InputMaybe<Types.Scalars['PK']['input']>;
  annotatedByDetectorID?: Types.InputMaybe<Types.Scalars['PK']['input']>;
  annotatedWithLabel?: Types.InputMaybe<Types.Scalars['String']['input']>;
  annotatedWithConfidence?: Types.InputMaybe<Types.Scalars['String']['input']>;
  annotatedWithFeatures?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
}>;


export type GetSpectrogramsFromDatesQuery = { __typename?: 'Query', allSpectrograms?: { __typename?: 'SpectrogramNodeNodeConnection', totalCount?: number | null, results: Array<{ __typename?: 'SpectrogramNode', pk: any, filename: string, start: any, duration: number } | null> } | null };

export type GetSpectrogramsFromDatesComplementQueryVariables = Types.Exact<{
  campaignID: Types.Scalars['PK']['input'];
  annotatorID: Types.Scalars['PK']['input'];
  phase: Types.AnnotationPhaseType;
  spectrogramIDs: Array<Types.InputMaybe<Types.Scalars['PK']['input']>> | Types.InputMaybe<Types.Scalars['PK']['input']>;
}>;


export type GetSpectrogramsFromDatesComplementQuery = { __typename?: 'Query', annotatorAnnotations?: { __typename?: 'AnnotationNodeNodeConnection', results: Array<{ __typename?: 'AnnotationNode', type: Types.AnnotationType, spectrogram: { __typename?: 'SpectrogramNode', pk: any } } | null> } | null, otherAnnotations?: { __typename?: 'AnnotationNodeNodeConnection', results: Array<{ __typename?: 'AnnotationNode', type: Types.AnnotationType, spectrogram: { __typename?: 'SpectrogramNode', pk: any } } | null> } | null, allAnnotationTasks?: { __typename?: 'AnnotationTaskNodeNodeConnection', results: Array<{ __typename?: 'AnnotationTaskNode', status?: Types.AnnotationTaskStatus | null, spectrogram: { __typename?: 'SpectrogramNode', pk: any } } | null> } | null };


export const GetSpectrogramsFromDatesDocument = `
    query getSpectrogramsFromDates($fromDatetime: DateTime!, $toDatetime: DateTime!, $campaignID: PK!, $annotatorID: PK!, $phase: AnnotationPhaseType!, $offset: Int!, $isTaskCompleted: Boolean, $hasAnnotations: Boolean, $annotatedByAnnotatorID: PK, $annotatedByDetectorID: PK, $annotatedWithLabel: String, $annotatedWithConfidence: String, $annotatedWithFeatures: Boolean) {
  allSpectrograms(
    limit: 20
    offset: $offset
    campaignId: $campaignID
    phaseType: $phase
    annotatorId: $annotatorID
    start_Gte: $fromDatetime
    end_Lte: $toDatetime
    orderBy: "start"
    isTaskCompleted: $isTaskCompleted
    annotatedByAnnotator: $annotatedByAnnotatorID
    annotatedByDetector: $annotatedByDetectorID
    hasAnnotations: $hasAnnotations
    annotatedWithLabel: $annotatedWithLabel
    annotatedWithConfidence: $annotatedWithConfidence
    annotatedWithFeatures: $annotatedWithFeatures
  ) {
    results {
      pk
      filename
      start
      duration
    }
    totalCount
  }
}
    `;
export const GetSpectrogramsFromDatesComplementDocument = `
    query getSpectrogramsFromDatesComplement($campaignID: PK!, $annotatorID: PK!, $phase: AnnotationPhaseType!, $spectrogramIDs: [PK]!) {
  annotatorAnnotations: allAnnotations(
    annotatorId: $annotatorID
    annotationCampaignId: $campaignID
    phaseType: $phase
    spectrogramId_In: $spectrogramIDs
  ) {
    results {
      type
      spectrogram {
        pk
      }
    }
  }
  otherAnnotations: allAnnotations(
    notAnnotatorId: $annotatorID
    annotationCampaignId: $campaignID
    phaseType: $phase
    spectrogramId_In: $spectrogramIDs
  ) {
    results {
      type
      spectrogram {
        pk
      }
    }
  }
  allAnnotationTasks(
    annotatorId: $annotatorID
    annotationCampaignId: $campaignID
    phaseType: $phase
    spectrogramId_In: $spectrogramIDs
  ) {
    results {
      status
      spectrogram {
        pk
      }
    }
  }
}
    `;

const injectedRtkApi = gqlAPI.injectEndpoints({
  endpoints: (build) => ({
    getSpectrogramsFromDates: build.query<GetSpectrogramsFromDatesQuery, GetSpectrogramsFromDatesQueryVariables>({
      query: (variables) => ({ document: GetSpectrogramsFromDatesDocument, variables })
    }),
    getSpectrogramsFromDatesComplement: build.query<GetSpectrogramsFromDatesComplementQuery, GetSpectrogramsFromDatesComplementQueryVariables>({
      query: (variables) => ({ document: GetSpectrogramsFromDatesComplementDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


