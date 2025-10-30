import * as Types from '../types.gql-generated';

import { gqlAPI } from '@/api/baseGqlApi';
export type ListAnnotationTaskQueryVariables = Types.Exact<{
  annotatorID: Types.Scalars['ID']['input'];
  campaignID: Types.Scalars['ID']['input'];
  phaseType: Types.AnnotationPhaseType;
  limit: Types.Scalars['Int']['input'];
  offset: Types.Scalars['Int']['input'];
  search?: Types.InputMaybe<Types.Scalars['String']['input']>;
  status?: Types.InputMaybe<Types.AnnotationTaskStatus>;
  from?: Types.InputMaybe<Types.Scalars['DateTime']['input']>;
  to?: Types.InputMaybe<Types.Scalars['DateTime']['input']>;
  withAnnotations?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
  annotationLabel?: Types.InputMaybe<Types.Scalars['String']['input']>;
  annotationConfidence?: Types.InputMaybe<Types.Scalars['String']['input']>;
  annotationDetector?: Types.InputMaybe<Types.Scalars['ID']['input']>;
  annotationAnnotator?: Types.InputMaybe<Types.Scalars['ID']['input']>;
  withAcousticFeatures?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
}>;


export type ListAnnotationTaskQuery = { __typename?: 'Query', allAnnotationSpectrograms?: { __typename?: 'AnnotationSpectrogramNodeNodeConnection', resumeSpectrogramId?: string | null, totalCount: number, results: Array<{ __typename?: 'AnnotationSpectrogramNode', id: string, filename: string, start: any, duration: number, task?: { __typename?: 'AnnotationTaskNode', status: Types.AnnotationTaskStatus, annotations?: { __typename?: 'AnnotationNodeNodeConnection', totalCount?: number | null } | null, validatedAnnotations?: { __typename?: 'AnnotationNodeNodeConnection', totalCount?: number | null } | null } | null } | null> } | null };

export type GetAnnotationTaskQueryVariables = Types.Exact<{
  spectrogramID: Types.Scalars['ID']['input'];
  annotatorID: Types.Scalars['ID']['input'];
  campaignID: Types.Scalars['ID']['input'];
  analysisID: Types.Scalars['ID']['input'];
  phaseType: Types.AnnotationPhaseType;
  search?: Types.InputMaybe<Types.Scalars['String']['input']>;
  status?: Types.InputMaybe<Types.AnnotationTaskStatus>;
  from?: Types.InputMaybe<Types.Scalars['DateTime']['input']>;
  to?: Types.InputMaybe<Types.Scalars['DateTime']['input']>;
  withAnnotations?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
  annotationLabel?: Types.InputMaybe<Types.Scalars['String']['input']>;
  annotationConfidence?: Types.InputMaybe<Types.Scalars['String']['input']>;
  annotationDetector?: Types.InputMaybe<Types.Scalars['ID']['input']>;
  annotationAnnotator?: Types.InputMaybe<Types.Scalars['ID']['input']>;
  withAcousticFeatures?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
}>;


export type GetAnnotationTaskQuery = { __typename?: 'Query', annotationSpectrogramById?: { __typename?: 'AnnotationSpectrogramNode', id: string, filename: string, audioPath: string, path: string, start: any, duration: number, isAssigned: boolean, task?: { __typename?: 'AnnotationTaskNode', status: Types.AnnotationTaskStatus, comments?: { __typename?: 'AnnotationCommentNodeNodeConnection', results: Array<{ __typename?: 'AnnotationCommentNode', id: string, comment: string } | null> } | null, annotations?: { __typename?: 'AnnotationNodeNodeConnection', results: Array<{ __typename?: 'AnnotationNode', id: string, type: Types.AnnotationType, startTime?: number | null, endTime?: number | null, startFrequency?: number | null, endFrequency?: number | null, label: { __typename?: 'AnnotationLabelNode', name: string }, confidence?: { __typename?: 'ConfidenceNode', label: string } | null, detectorConfiguration?: { __typename?: 'DetectorConfigurationNode', detector: { __typename?: 'DetectorNode', id: string, name: string } } | null, annotator?: { __typename?: 'UserNode', id: string, displayName: string } | null, comments?: { __typename?: 'AnnotationCommentNodeNodeConnection', results: Array<{ __typename?: 'AnnotationCommentNode', id: string, comment: string } | null> } | null, validations?: { __typename?: 'AnnotationValidationNodeNodeConnection', results: Array<{ __typename?: 'AnnotationValidationNode', id: string, isValid: boolean } | null> } | null, isUpdateOf?: { __typename?: 'AnnotationNode', id: string } | null, acousticFeatures?: { __typename?: 'AcousticFeaturesNode', id: string, startFrequency?: number | null, endFrequency?: number | null, trend?: Types.SignalTrendType | null, stepsCount?: number | null, relativeMinFrequencyCount?: number | null, relativeMaxFrequencyCount?: number | null, hasHarmonics?: boolean | null } | null, analysis: { __typename?: 'SpectrogramAnalysisNode', id: string } } | null> } | null } | null } | null, allAnnotationSpectrograms?: { __typename?: 'AnnotationSpectrogramNodeNodeConnection', currentIndex?: number | null, totalCount: number, previousSpectrogramId?: string | null, nextSpectrogramId?: string | null } | null };

export type SubmitTaskMutationVariables = Types.Exact<{
  campaignID: Types.Scalars['ID']['input'];
  spectrogramID: Types.Scalars['ID']['input'];
  phase: Types.AnnotationPhaseType;
  startedAt: Types.Scalars['DateTime']['input'];
  endedAt: Types.Scalars['DateTime']['input'];
  content: Types.Scalars['String']['input'];
}>;


export type SubmitTaskMutation = { __typename?: 'Mutation', submitAnnotationTask?: { __typename?: 'SubmitAnnotationTaskMutation', ok: boolean } | null };


export const ListAnnotationTaskDocument = `
    query listAnnotationTask($annotatorID: ID!, $campaignID: ID!, $phaseType: AnnotationPhaseType!, $limit: Int!, $offset: Int!, $search: String, $status: AnnotationTaskStatus, $from: DateTime, $to: DateTime, $withAnnotations: Boolean, $annotationLabel: String, $annotationConfidence: String, $annotationDetector: ID, $annotationAnnotator: ID, $withAcousticFeatures: Boolean) {
  allAnnotationSpectrograms(
    limit: $limit
    offset: $offset
    orderBy: "start"
    annotator: $annotatorID
    annotationCampaign: $campaignID
    phase: $phaseType
    filename_Icontains: $search
    end_Gte: $from
    start_Lte: $to
    annotationTasks_Status: $status
    annotations_Exists: $withAnnotations
    annotations_LabelName: $annotationLabel
    annotations_Confidence_Label: $annotationConfidence
    annotations_Detector: $annotationDetector
    annotations_Annotator: $annotationAnnotator
    annotations_AcousticFeatures_Exists: $withAcousticFeatures
  ) {
    resumeSpectrogramId
    results {
      id
      filename
      start
      duration
      task(phase: $phaseType, campaignId: $campaignID) {
        status
        annotations(
          annotator: $annotationAnnotator
          label_Name: $annotationLabel
          confidence_Label: $annotationConfidence
          detectorConfiguration_Detector: $annotationDetector
          acousticFeatures_Exists: $withAcousticFeatures
        ) {
          totalCount
        }
        validatedAnnotations: annotations(
          isValid: true
          annotator: $annotationAnnotator
          label_Name: $annotationLabel
          confidence_Label: $annotationConfidence
          detectorConfiguration_Detector: $annotationDetector
          acousticFeatures_Exists: $withAcousticFeatures
        ) {
          totalCount
        }
      }
    }
    totalCount
  }
}
    `;
export const GetAnnotationTaskDocument = `
    query getAnnotationTask($spectrogramID: ID!, $annotatorID: ID!, $campaignID: ID!, $analysisID: ID!, $phaseType: AnnotationPhaseType!, $search: String, $status: AnnotationTaskStatus, $from: DateTime, $to: DateTime, $withAnnotations: Boolean, $annotationLabel: String, $annotationConfidence: String, $annotationDetector: ID, $annotationAnnotator: ID, $withAcousticFeatures: Boolean) {
  annotationSpectrogramById(id: $spectrogramID) {
    id
    filename
    audioPath(analysisId: $analysisID)
    path(analysisId: $analysisID)
    start
    duration
    isAssigned(phase: $phaseType, campaignId: $campaignID)
    task(phase: $phaseType, campaignId: $campaignID) {
      status
      comments(author: $annotatorID, annotationPhase_Phase: $phaseType) {
        results {
          id
          comment
        }
      }
      annotations {
        results {
          id
          type
          startTime
          endTime
          startFrequency
          endFrequency
          label {
            name
          }
          confidence {
            label
          }
          detectorConfiguration {
            detector {
              id
              name
            }
          }
          annotator {
            id
            displayName
          }
          comments(author: $annotatorID) {
            results {
              id
              comment
            }
          }
          validations(annotator: $annotatorID) {
            results {
              id
              isValid
            }
          }
          isUpdateOf {
            id
          }
          acousticFeatures {
            id
            startFrequency
            endFrequency
            trend
            stepsCount
            relativeMinFrequencyCount
            relativeMaxFrequencyCount
            hasHarmonics
          }
          analysis {
            id
          }
        }
      }
    }
  }
  allAnnotationSpectrograms(
    orderBy: "start"
    annotator: $annotatorID
    annotationCampaign: $campaignID
    phase: $phaseType
    filename_Icontains: $search
    end_Gte: $from
    start_Lte: $to
    annotationTasks_Status: $status
    annotations_Exists: $withAnnotations
    annotations_LabelName: $annotationLabel
    annotations_Confidence_Label: $annotationConfidence
    annotations_Detector: $annotationDetector
    annotations_Annotator: $annotationAnnotator
    annotations_AcousticFeatures_Exists: $withAcousticFeatures
  ) {
    currentIndex(spectrogramId: $spectrogramID)
    totalCount
    previousSpectrogramId(spectrogramId: $spectrogramID)
    nextSpectrogramId(spectrogramId: $spectrogramID)
  }
}
    `;
export const SubmitTaskDocument = `
    mutation submitTask($campaignID: ID!, $spectrogramID: ID!, $phase: AnnotationPhaseType!, $startedAt: DateTime!, $endedAt: DateTime!, $content: String!) {
  submitAnnotationTask(
    spectrogramId: $spectrogramID
    phaseType: $phase
    campaignId: $campaignID
    startedAt: $startedAt
    endedAt: $endedAt
    content: $content
  ) {
    ok
  }
}
    `;

const injectedRtkApi = gqlAPI.injectEndpoints({
  endpoints: (build) => ({
    listAnnotationTask: build.query<ListAnnotationTaskQuery, ListAnnotationTaskQueryVariables>({
      query: (variables) => ({ document: ListAnnotationTaskDocument, variables })
    }),
    getAnnotationTask: build.query<GetAnnotationTaskQuery, GetAnnotationTaskQueryVariables>({
      query: (variables) => ({ document: GetAnnotationTaskDocument, variables })
    }),
    submitTask: build.mutation<SubmitTaskMutation, SubmitTaskMutationVariables>({
      query: (variables) => ({ document: SubmitTaskDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


