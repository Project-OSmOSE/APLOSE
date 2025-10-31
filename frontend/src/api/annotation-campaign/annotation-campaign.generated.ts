import * as Types from '../types.gql-generated';

import { gqlAPI } from '@/api/baseGqlApi';
export type ListCampaignsQueryVariables = Types.Exact<{
  isArchived?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
  phase?: Types.InputMaybe<Types.AnnotationPhaseType>;
  ownerID?: Types.InputMaybe<Types.Scalars['ID']['input']>;
  annotatorID?: Types.InputMaybe<Types.Scalars['ID']['input']>;
  search?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type ListCampaignsQuery = { __typename?: 'Query', allAnnotationCampaigns?: { __typename?: 'AnnotationCampaignNodeNodeConnection', results: Array<{ __typename?: 'AnnotationCampaignNode', id: string, name: string, deadline?: any | null, isArchived: boolean, datasetName: string, phaseTypes: Array<Types.AnnotationPhaseType | null>, tasksCount: number, completedTasksCount: number, userTasksCount: number, userCompletedTasksCount: number } | null> } | null };

export type GetCampaignQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type GetCampaignQuery = { __typename?: 'Query', annotationCampaignById?: { __typename?: 'AnnotationCampaignNode', id: string, name: string, createdAt: any, instructionsUrl?: string | null, deadline?: any | null, isArchived: boolean, canManage: boolean, allowPointAnnotation: boolean, allowColormapTuning: boolean, allowImageTuning: boolean, colormapDefault?: string | null, colormapInvertedDefault?: boolean | null, description?: string | null, spectrogramsCount: number, dataset: { __typename?: 'DatasetNode', id: string, name: string }, labelSet?: { __typename?: 'LabelSetNode', name: string, description?: string | null, labels: Array<{ __typename?: 'AnnotationLabelNode', name: string } | null> } | null, labelsWithAcousticFeatures?: Array<{ __typename?: 'AnnotationLabelNode', id: string, name: string } | null> | null, owner: { __typename?: 'UserNode', id: string, displayName: string, email: string }, archive?: { __typename?: 'ArchiveNode', date: any, byUser?: { __typename?: 'UserNode', displayName: string } | null } | null, confidenceSet?: { __typename?: 'ConfidenceSetNode', name: string, desc?: string | null, confidenceIndicators?: Array<{ __typename?: 'ConfidenceNode', label: string } | null> | null } | null, detectors?: Array<{ __typename?: 'DetectorNode', id: string, name: string } | null> | null, annotators?: Array<{ __typename?: 'UserNode', id: string, displayName: string } | null> | null, analysis: { __typename?: 'SpectrogramAnalysisNodeConnection', edges: Array<{ __typename?: 'SpectrogramAnalysisNodeEdge', node?: { __typename?: 'SpectrogramAnalysisNode', id: string, legacy: boolean, colormap: { __typename?: 'ColormapNode', name: string }, fft: { __typename?: 'FFTNode', nfft: number, windowSize: number, overlap: any, samplingFrequency: number }, legacyConfiguration?: { __typename?: 'LegacySpectrogramConfigurationNode', scaleName?: string | null, zoomLevel: number, linearFrequencyScale?: { __typename?: 'LinearScaleNode', ratio: number, minValue: number, maxValue: number } | null, multiLinearFrequencyScale?: { __typename?: 'MultiLinearScaleNode', innerScales?: Array<{ __typename?: 'LinearScaleNode', ratio: number, minValue: number, maxValue: number } | null> | null } | null } | null } | null } | null> }, phases: Array<{ __typename?: 'AnnotationPhaseNode', id: string, phase: Types.AnnotationPhaseType, isOpen: boolean, tasksCount: number, completedTasksCount: number } | null> } | null };

export type CreateCampaignMutationVariables = Types.Exact<{
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


export type CreateCampaignMutation = { __typename?: 'Mutation', createAnnotationCampaign?: { __typename?: 'CreateAnnotationCampaignMutationPayload', annotationCampaign?: { __typename?: 'AnnotationCampaignNode', id: string } | null, errors: Array<{ __typename?: 'ErrorType', field: string, messages: Array<string> }> } | null };

export type ArchiveCampaignMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type ArchiveCampaignMutation = { __typename?: 'Mutation', archiveAnnotationCampaign?: { __typename?: 'ArchiveAnnotationCampaignMutation', ok: boolean } | null };

export type UpdateCampaignFeaturedLabelsMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
  labelsWithAcousticFeatures: Array<Types.InputMaybe<Types.Scalars['ID']['input']>> | Types.InputMaybe<Types.Scalars['ID']['input']>;
}>;


export type UpdateCampaignFeaturedLabelsMutation = { __typename?: 'Mutation', updateAnnotationCampaign?: { __typename?: 'UpdateAnnotationCampaignMutationPayload', errors: Array<{ __typename?: 'ErrorType', field: string, messages: Array<string> }> } | null };


export const ListCampaignsDocument = `
    query listCampaigns($isArchived: Boolean, $phase: AnnotationPhaseType, $ownerID: ID, $annotatorID: ID, $search: String) {
  allAnnotationCampaigns(
    isArchived: $isArchived
    phases_Phase: $phase
    ownerId: $ownerID
    phases_AnnotationFileRanges_AnnotatorId: $annotatorID
    search: $search
    orderBy: "name"
  ) {
    results {
      id
      name
      deadline
      isArchived
      datasetName
      phaseTypes
      tasksCount
      completedTasksCount
      userTasksCount
      userCompletedTasksCount
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
    labelSet {
      name
      description
      labels {
        name
      }
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
    confidenceSet {
      name
      desc
      confidenceIndicators {
        label
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
    spectrogramsCount
    phases {
      id
      phase
      isOpen
      tasksCount
      completedTasksCount
    }
  }
}
    `;
export const CreateCampaignDocument = `
    mutation createCampaign($name: String!, $description: String, $instructionsUrl: String, $deadline: Date, $allowImageTuning: Boolean, $allowColormapTuning: Boolean, $colormapDefault: String, $colormapInvertedDefault: Boolean, $datasetID: ID!, $analysisIDs: [ID]!) {
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
export const ArchiveCampaignDocument = `
    mutation archiveCampaign($id: ID!) {
  archiveAnnotationCampaign(id: $id) {
    ok
  }
}
    `;
export const UpdateCampaignFeaturedLabelsDocument = `
    mutation updateCampaignFeaturedLabels($id: ID!, $labelsWithAcousticFeatures: [ID]!) {
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
    listCampaigns: build.query<ListCampaignsQuery, ListCampaignsQueryVariables | void>({
      query: (variables) => ({ document: ListCampaignsDocument, variables })
    }),
    getCampaign: build.query<GetCampaignQuery, GetCampaignQueryVariables>({
      query: (variables) => ({ document: GetCampaignDocument, variables })
    }),
    createCampaign: build.mutation<CreateCampaignMutation, CreateCampaignMutationVariables>({
      query: (variables) => ({ document: CreateCampaignDocument, variables })
    }),
    archiveCampaign: build.mutation<ArchiveCampaignMutation, ArchiveCampaignMutationVariables>({
      query: (variables) => ({ document: ArchiveCampaignDocument, variables })
    }),
    updateCampaignFeaturedLabels: build.mutation<UpdateCampaignFeaturedLabelsMutation, UpdateCampaignFeaturedLabelsMutationVariables>({
      query: (variables) => ({ document: UpdateCampaignFeaturedLabelsDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


