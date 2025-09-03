import * as Types from '../../gql/types.generated';

import { gqlAPI } from '@/features/gql/baseApi.ts';
export type GetAnnotatorQueryVariables = Types.Exact<{
  spectrogramID: Types.Scalars['ID']['input'];
  campaignID: Types.Scalars['ID']['input'];
  annotatorID: Types.Scalars['ID']['input'];
  phaseType: Types.AnnotationPhaseType;
  filename__icontain?: Types.InputMaybe<Types.Scalars['String']['input']>;
  label__name?: Types.InputMaybe<Types.Scalars['String']['input']>;
  confidence_indicator__label?: Types.InputMaybe<Types.Scalars['String']['input']>;
  detector_configuration__detector__name?: Types.InputMaybe<Types.Scalars['String']['input']>;
  end__gte?: Types.InputMaybe<Types.Scalars['String']['input']>;
  start__lte?: Types.InputMaybe<Types.Scalars['String']['input']>;
  is_submitted?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
  with_user_annotations?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
  acoustic_features__isnull?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
}>;


export type GetAnnotatorQuery = { __typename?: 'Query', spectrogramPrevNext?: { __typename?: 'PrevNextNode', previousId?: string | null, nextId?: string | null } | null, annotationTaskIndexes?: { __typename?: 'AnnotationTaskIndexesNode', current?: number | null, total?: number | null } | null, spectrogramById?: { __typename?: 'SpectrogramNode', id: string, start: any, duration: number, filename: string } | null, annotationTask?: { __typename?: 'AnnotationTaskNode', status?: Types.AnnotationTaskStatus | null } | null, annotationFileRange?: { __typename?: 'AnnotationFileRangeNode', id: string } | null, allAnnotationComments?: { __typename?: 'AnnotationCommentNodeNodeConnection', results: Array<{ __typename?: 'AnnotationCommentNode', id: string, comment: string, annotationId?: string | null, createdAt: any, author: { __typename?: 'UserNode', id: string, displayName?: string | null } } | null> } | null, userAnnotations?: { __typename?: 'AnnotationNodeNodeConnection', results: Array<{ __typename?: 'AnnotationNode', id: string, type: Types.AnnotationType, startTime?: number | null, endTime?: number | null, startFrequency?: number | null, endFrequency?: number | null, isUpdateOfId?: string | null, annotationPhase: { __typename?: 'AnnotationPhaseNode', id: string }, annotator?: { __typename?: 'UserNode', id: string, displayName?: string | null } | null, label: { __typename?: 'AnnotationLabelNode', name: string }, confidence?: { __typename?: 'ConfidenceNode', label: string } | null, acousticFeatures?: { __typename?: 'AcousticFeaturesNode', startFrequency?: number | null, endFrequency?: number | null, hasHarmonics?: boolean | null, relativeMinFrequencyCount?: number | null, relativeMaxFrequencyCount?: number | null, stepsCount?: number | null, trend?: Types.SignalTrendType | null } | null } | null> } | null, otherAnnotations?: { __typename?: 'AnnotationNodeNodeConnection', results: Array<{ __typename?: 'AnnotationNode', id: string, type: Types.AnnotationType, startTime?: number | null, endTime?: number | null, startFrequency?: number | null, endFrequency?: number | null, annotationPhase: { __typename?: 'AnnotationPhaseNode', id: string }, annotator?: { __typename?: 'UserNode', id: string, displayName?: string | null } | null, label: { __typename?: 'AnnotationLabelNode', name: string }, confidence?: { __typename?: 'ConfidenceNode', label: string } | null, validations?: { __typename?: 'AnnotationValidationNodeNodeConnection', results: Array<{ __typename?: 'AnnotationValidationNode', id: string, isValid: boolean } | null> } | null, detectorConfiguration?: { __typename?: 'DetectorConfigurationNode', id: string, configuration?: string | null, detector: { __typename?: 'DetectorNode', name: string } } | null, acousticFeatures?: { __typename?: 'AcousticFeaturesNode', startFrequency?: number | null, endFrequency?: number | null, hasHarmonics?: boolean | null, relativeMinFrequencyCount?: number | null, relativeMaxFrequencyCount?: number | null, stepsCount?: number | null, trend?: Types.SignalTrendType | null } | null } | null> } | null, allSpectrogramAnalysis?: { __typename?: 'SpectrogramAnalysisNodeNodeConnection', results: Array<{ __typename?: 'SpectrogramAnalysisNode', id: string, name: string, colormap: { __typename?: 'ColormapNode', name: string }, fft: { __typename?: 'FFTNode', nfft: number, windowSize: number, overlap: any, samplingFrequency: number }, legacyConfiguration?: { __typename?: 'LegacySpectrogramConfigurationNode', scaleName?: string | null, zoomLevel: number, linearFrequencyScale?: { __typename?: 'LinearScaleNode', minValue: number, maxValue: number } | null, multiLinearFrequencyScale?: { __typename?: 'MultiLinearScaleNode', innerScales?: { __typename?: 'LinearScaleNodeNodeConnection', results: Array<{ __typename?: 'LinearScaleNode', minValue: number, maxValue: number, ratio: number } | null> } | null } | null } | null } | null> } | null, annotationCampaignLabelSet?: { __typename?: 'LabelSetNode', labels?: { __typename?: 'AnnotationLabelNodeNodeConnection', results: Array<{ __typename?: 'AnnotationLabelNode', name: string } | null> } | null } | null, annotationCampaignConfidenceSet?: { __typename?: 'ConfidenceSetNode', desc?: string | null, confidenceIndicators?: { __typename?: 'ConfidenceNodeNodeConnection', results: Array<{ __typename?: 'ConfidenceNode', label: string, isDefault?: boolean | null } | null> } | null } | null };

export type GetSpectrogramPathQueryVariables = Types.Exact<{
  spectrogramID: Types.Scalars['ID']['input'];
  analysisID: Types.Scalars['ID']['input'];
}>;


export type GetSpectrogramPathQuery = { __typename?: 'Query', spectrogramById?: { __typename?: 'SpectrogramNode', filename: string, path: string, audioPath: string } | null };


export const GetAnnotatorDocument = `
    query getAnnotator($spectrogramID: ID!, $campaignID: ID!, $annotatorID: ID!, $phaseType: AnnotationPhaseType!, $filename__icontain: String, $label__name: String, $confidence_indicator__label: String, $detector_configuration__detector__name: String, $end__gte: String, $start__lte: String, $is_submitted: Boolean, $with_user_annotations: Boolean, $acoustic_features__isnull: Boolean) {
  spectrogramPrevNext(
    campaignId: $campaignID
    phaseType: $phaseType
    annotatorId: $annotatorID
    spectrogramId: $spectrogramID
    filename__icontain: $filename__icontain
    label__name: $label__name
    confidence_indicator__label: $confidence_indicator__label
    detector_configuration__detector__name: $detector_configuration__detector__name
    end__gte: $end__gte
    start__lte: $start__lte
    is_submitted: $is_submitted
    with_user_annotations: $with_user_annotations
    acoustic_features__isnull: $acoustic_features__isnull
  ) {
    previousId
    nextId
  }
  annotationTaskIndexes(
    annotationCampaignId: $campaignID
    phaseType: $phaseType
    annotatorId: $annotatorID
    spectrogramId: $spectrogramID
  ) {
    current
    total
  }
  spectrogramById(id: $spectrogramID) {
    id
    start
    duration
    filename
  }
  annotationTask(
    annotationCampaignId: $campaignID
    phaseType: $phaseType
    annotatorId: $annotatorID
    spectrogramId: $spectrogramID
  ) {
    status
  }
  annotationFileRange(
    annotationCampaignId: $campaignID
    phaseType: $phaseType
    annotatorId: $annotatorID
    spectrogramId: $spectrogramID
  ) {
    id
  }
  allAnnotationComments(
    annotationCampaignId: $campaignID
    authorId: $annotatorID
    phaseType: $phaseType
    spectrogramId: $spectrogramID
  ) {
    results {
      id
      comment
      author {
        id
        displayName
      }
      annotationId
      createdAt
    }
  }
  userAnnotations: allAnnotations(
    spectrogramId: $spectrogramID
    annotationCampaignId: $campaignID
    annotatorId: $annotatorID
    phaseType: $phaseType
  ) {
    results {
      id
      annotationPhase {
        id
      }
      annotator {
        id
        displayName
      }
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
      isUpdateOfId
      acousticFeatures {
        startFrequency
        endFrequency
        hasHarmonics
        relativeMinFrequencyCount
        relativeMaxFrequencyCount
        stepsCount
        trend
      }
    }
  }
  otherAnnotations: allAnnotations(
    spectrogramId: $spectrogramID
    annotationCampaignId: $campaignID
    notAnnotatorId: $annotatorID
    phaseType: Annotation
  ) {
    results {
      id
      annotationPhase {
        id
      }
      annotator {
        id
        displayName
      }
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
      validations(annotator: $annotatorID) {
        results {
          id
          isValid
        }
      }
      detectorConfiguration {
        id
        detector {
          name
        }
        configuration
      }
      acousticFeatures {
        startFrequency
        endFrequency
        hasHarmonics
        relativeMinFrequencyCount
        relativeMaxFrequencyCount
        stepsCount
        trend
      }
    }
  }
  allSpectrogramAnalysis(annotationCampaignId: $campaignID) {
    results {
      id
      name
      colormap {
        name
      }
      fft {
        nfft
        windowSize
        overlap
        samplingFrequency
      }
      legacyConfiguration {
        scaleName
        zoomLevel
        linearFrequencyScale {
          minValue
          maxValue
        }
        multiLinearFrequencyScale {
          innerScales {
            results {
              minValue
              maxValue
              ratio
            }
          }
        }
      }
    }
  }
  annotationCampaignLabelSet(annotationCampaignId: $campaignID) {
    labels {
      results {
        name
      }
    }
  }
  annotationCampaignConfidenceSet(annotationCampaignId: $campaignID) {
    desc
    confidenceIndicators {
      results {
        label
        isDefault
      }
    }
  }
}
    `;
export const GetSpectrogramPathDocument = `
    query getSpectrogramPath($spectrogramID: ID!, $analysisID: ID!) {
  spectrogramById(id: $spectrogramID) {
    filename
    path(analysisId: $analysisID)
    audioPath(analysisId: $analysisID)
  }
}
    `;

const injectedRtkApi = gqlAPI.injectEndpoints({
  endpoints: (build) => ({
    getAnnotator: build.query<GetAnnotatorQuery, GetAnnotatorQueryVariables>({
      query: (variables) => ({ document: GetAnnotatorDocument, variables })
    }),
    getSpectrogramPath: build.query<GetSpectrogramPathQuery, GetSpectrogramPathQueryVariables>({
      query: (variables) => ({ document: GetSpectrogramPathDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


