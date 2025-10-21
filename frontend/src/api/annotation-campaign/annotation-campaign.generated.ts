import * as Types from '../types.gql-generated';

import { gqlAPI } from '@/api/baseGqlApi';
export type ListCampaignsAndPhasesQueryVariables = Types.Exact<{
  isArchived?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
  phase?: Types.InputMaybe<Types.AnnotationPhaseType>;
  ownerID?: Types.InputMaybe<Types.Scalars['ID']['input']>;
  annotatorID?: Types.InputMaybe<Types.Scalars['ID']['input']>;
  search?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type ListCampaignsAndPhasesQuery = { __typename?: 'Query', allAnnotationCampaigns?: { __typename?: 'AnnotationCampaignNodeNodeConnection', results: Array<{ __typename?: 'AnnotationCampaignNode', id: string, name: string, datasetName: string, deadline?: any | null, isArchived: boolean } | null> } | null, allAnnotationPhases?: { __typename?: 'AnnotationPhaseNodeNodeConnection', results: Array<{ __typename?: 'AnnotationPhaseNode', id: string, phase: Types.AnnotationPhaseType, userTasksCount: number, userCompletedTasksCount: number, tasksCount: number, completedTasksCount: number, annotationCampaignId: string } | null> } | null };

export type GetCampaignQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type GetCampaignQuery = { __typename?: 'Query', annotationCampaignById?: { __typename?: 'AnnotationCampaignNode', id: string, name: string, createdAt: any, instructionsUrl?: string | null, deadline?: any | null, isArchived: boolean, canManage: boolean, allowPointAnnotation: boolean, allowColormapTuning: boolean, allowImageTuning: boolean, colormapDefault?: string | null, colormapInvertedDefault?: boolean | null, description?: string | null, filesCount: number, dataset: { __typename?: 'DatasetNode', id: string, name: string }, labelsWithAcousticFeatures?: Array<{ __typename?: 'AnnotationLabelNode', id: string, name: string } | null> | null, owner: { __typename?: 'UserNode', id: string, displayName: string, email: string }, archive?: { __typename?: 'ArchiveNode', date: any, byUser?: { __typename?: 'UserNode', displayName: string } | null } | null, confidenceSet?: { __typename?: 'ConfidenceSetNode', name: string, desc?: string | null, confidenceIndicators?: Array<{ __typename?: 'ConfidenceNode', label: string } | null> | null } | null, labelSet?: { __typename?: 'LabelSetNode', name: string, description?: string | null, labels: Array<{ __typename?: 'AnnotationLabelNode', name: string } | null> } | null, detectors?: Array<{ __typename?: 'DetectorNode', id: string, name: string } | null> | null, annotators?: Array<{ __typename?: 'UserNode', id: string, displayName: string } | null> | null, analysis: { __typename?: 'SpectrogramAnalysisNodeConnection', edges: Array<{ __typename?: 'SpectrogramAnalysisNodeEdge', node?: { __typename?: 'SpectrogramAnalysisNode', id: string, legacy: boolean, colormap: { __typename?: 'ColormapNode', name: string }, fft: { __typename?: 'FFTNode', nfft: number, windowSize: number, overlap: any, samplingFrequency: number }, legacyConfiguration?: { __typename?: 'LegacySpectrogramConfigurationNode', scaleName?: string | null, zoomLevel: number, linearFrequencyScale?: { __typename?: 'LinearScaleNode', ratio: number, minValue: number, maxValue: number } | null, multiLinearFrequencyScale?: { __typename?: 'MultiLinearScaleNode', innerScales?: Array<{ __typename?: 'LinearScaleNode', ratio: number, minValue: number, maxValue: number } | null> | null } | null } | null } | null } | null> } } | null, allAnnotationPhases?: { __typename?: 'AnnotationPhaseNodeNodeConnection', results: Array<{ __typename?: 'AnnotationPhaseNode', id: string, phase: Types.AnnotationPhaseType, completedTasksCount: number, tasksCount: number, isOpen: boolean } | null> } | null };

export type CreateAnnotationCampaignMutationVariables = Types.Exact<{
  name: Types.Scalars['String']['input'];
  description?: Types.InputMaybe<Types.Scalars['String']['input']>;
  instructionsUrl?: Types.InputMaybe<Types.Scalars['String']['input']>;
  deadline?: Types.InputMaybe<Types.Scalars['Date']['input']>;
  allowImageTuning?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
  allowColormapTuning?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
  colormapDefault?: Types.InputMaybe<Types.Scalars['String']['input']>;
  colormapInvertedDefault?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
  datasetID: Types.Scalars['ID']['input'];
  analysisIDs: Array<Types.InputMaybe<Types.Scalars['ID']['input']>> | Types.InputMaybe<Types.Scalars['ID']['input']>;
}>;


export type CreateAnnotationCampaignMutation = { __typename?: 'Mutation', createAnnotationCampaign?: { __typename?: 'CreateAnnotationCampaignMutationPayload', annotationCampaign?: { __typename?: 'AnnotationCampaignNode', id: string } | null, errors: Array<{ __typename?: 'ErrorType', field: string, messages: Array<string> }> } | null };

export type ArchiveAnnotationCampaignMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type ArchiveAnnotationCampaignMutation = { __typename?: 'Mutation', archiveAnnotationCampaign?: { __typename?: 'ArchiveAnnotationCampaignMutation', ok: boolean } | null };

export type UpdateAnnotationCampaignFeaturedLabelsMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
  labelsWithAcousticFeatures: Array<Types.InputMaybe<Types.Scalars['ID']['input']>> | Types.InputMaybe<Types.Scalars['ID']['input']>;
}>;


export type UpdateAnnotationCampaignFeaturedLabelsMutation = { __typename?: 'Mutation', updateAnnotationCampaign?: { __typename?: 'UpdateAnnotationCampaignMutationPayload', errors: Array<{ __typename?: 'ErrorType', field: string, messages: Array<string> }> } | null };


export const ListCampaignsAndPhasesDocument = `
    query listCampaignsAndPhases($isArchived: Boolean, $phase: AnnotationPhaseType, $ownerID: ID, $annotatorID: ID, $search: String) {
  allAnnotationCampaigns(
    isArchived: $isArchived
    phases_Phase: $phase
    ownerId: $ownerID
    phases_AnnotationFileRanges_AnnotatorId: $annotatorID
    search: $search
  ) {
    results {
      id
      name
      datasetName
      deadline
      isArchived
    }
  }
  allAnnotationPhases(
    isCampaignArchived: $isArchived
    phase: $phase
    annotationCampaign_OwnerId: $ownerID
    annotationFileRanges_AnnotatorId: $annotatorID
    search: $search
  ) {
    results {
      id
      phase
      userTasksCount
      userCompletedTasksCount
      tasksCount
      completedTasksCount
      annotationCampaignId
    }
  }
}
    `;
export const GetCampaignDocument = `
    query getCampaign($id: ID!) {
  annotationCampaignById(id: $id) {
    id
    name
    createdAt
    instructionsUrl
    deadline
    isArchived
    canManage
    allowPointAnnotation
    allowColormapTuning
    allowImageTuning
    colormapDefault
    colormapInvertedDefault
    dataset {
      id
      name
    }
    labelsWithAcousticFeatures {
      id
      name
    }
    owner {
      id
      displayName
      email
    }
    description
    archive {
      date
      byUser {
        displayName
      }
    }
    filesCount
    confidenceSet {
      name
      desc
      confidenceIndicators {
        label
      }
    }
    labelSet {
      name
      description
      labels {
        name
      }
    }
    detectors {
      id
      name
    }
    annotators {
      id
      displayName
    }
    analysis {
      edges {
        node {
          id
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
              ratio
              minValue
              maxValue
            }
            multiLinearFrequencyScale {
              innerScales {
                ratio
                minValue
                maxValue
              }
            }
          }
          legacy
        }
      }
    }
  }
  allAnnotationPhases(annotationCampaignId: $id) {
    results {
      id
      phase
      completedTasksCount
      tasksCount
      isOpen
    }
  }
}
    `;
export const CreateAnnotationCampaignDocument = `
    mutation createAnnotationCampaign($name: String!, $description: String, $instructionsUrl: String, $deadline: Date, $allowImageTuning: Boolean, $allowColormapTuning: Boolean, $colormapDefault: String, $colormapInvertedDefault: Boolean, $datasetID: ID!, $analysisIDs: [ID]!) {
  createAnnotationCampaign(
    input: {name: $name, description: $description, instructionsUrl: $instructionsUrl, deadline: $deadline, allowImageTuning: $allowImageTuning, allowColormapTuning: $allowColormapTuning, colormapDefault: $colormapDefault, colormapInvertedDefault: $colormapInvertedDefault, dataset: $datasetID, analysis: $analysisIDs}
  ) {
    annotationCampaign {
      id
    }
    errors {
      field
      messages
    }
  }
}
    `;
export const ArchiveAnnotationCampaignDocument = `
    mutation archiveAnnotationCampaign($id: ID!) {
  archiveAnnotationCampaign(id: $id) {
    ok
  }
}
    `;
export const UpdateAnnotationCampaignFeaturedLabelsDocument = `
    mutation updateAnnotationCampaignFeaturedLabels($id: ID!, $labelsWithAcousticFeatures: [ID]!) {
  updateAnnotationCampaign(
    input: {id: $id, labelsWithAcousticFeatures: $labelsWithAcousticFeatures}
  ) {
    errors {
      field
      messages
    }
  }
}
    `;

const injectedRtkApi = gqlAPI.injectEndpoints({
  endpoints: (build) => ({
    listCampaignsAndPhases: build.query<ListCampaignsAndPhasesQuery, ListCampaignsAndPhasesQueryVariables | void>({
      query: (variables) => ({ document: ListCampaignsAndPhasesDocument, variables })
    }),
    getCampaign: build.query<GetCampaignQuery, GetCampaignQueryVariables>({
      query: (variables) => ({ document: GetCampaignDocument, variables })
    }),
    createAnnotationCampaign: build.mutation<CreateAnnotationCampaignMutation, CreateAnnotationCampaignMutationVariables>({
      query: (variables) => ({ document: CreateAnnotationCampaignDocument, variables })
    }),
    archiveAnnotationCampaign: build.mutation<ArchiveAnnotationCampaignMutation, ArchiveAnnotationCampaignMutationVariables>({
      query: (variables) => ({ document: ArchiveAnnotationCampaignDocument, variables })
    }),
    updateAnnotationCampaignFeaturedLabels: build.mutation<UpdateAnnotationCampaignFeaturedLabelsMutation, UpdateAnnotationCampaignFeaturedLabelsMutationVariables>({
      query: (variables) => ({ document: UpdateAnnotationCampaignFeaturedLabelsDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


