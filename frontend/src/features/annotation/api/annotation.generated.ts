import * as Types from '../../_utils_/gql/types.generated';

import { gqlAPI } from '@/features/_utils_/gql/baseApi.ts';
export type ListCampaignsAndPhasesQueryVariables = Types.Exact<{
  isArchived?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
  phase?: Types.InputMaybe<Types.AnnotationPhaseType>;
  ownerPk?: Types.InputMaybe<Types.Scalars['PK']['input']>;
  annotatorPk?: Types.InputMaybe<Types.Scalars['PK']['input']>;
  search?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type ListCampaignsAndPhasesQuery = { __typename?: 'Query', allAnnotationCampaigns?: { __typename?: 'AnnotationCampaignNodeNodeConnection', results: Array<{ __typename?: 'AnnotationCampaignNode', pk: any, name: string, datasetName: string, deadline?: any | null, isArchived: boolean } | null> } | null, allAnnotationPhases?: { __typename?: 'AnnotationPhaseNodeNodeConnection', results: Array<{ __typename?: 'AnnotationPhaseNode', pk: any, phase: Types.AnnotationPhaseType, userTasksCount: number, userCompletedTasksCount: number, tasksCount: number, completedTasksCount: number, annotationCampaignPk: number } | null> } | null };

export type GetCampaignQueryVariables = Types.Exact<{
  pk: Types.Scalars['PK']['input'];
}>;


export type GetCampaignQuery = { __typename?: 'Query', annotationCampaignByPk?: { __typename?: 'AnnotationCampaignNode', pk: any, isArchived: boolean, canManage: boolean, labelsWithAcousticFeatures?: { __typename?: 'AnnotationLabelNodeNodeConnection', results: Array<{ __typename?: 'AnnotationLabelNode', name: string } | null> } | null, owner: { __typename?: 'UserNode', pk: any } } | null, allAnnotationPhases?: { __typename?: 'AnnotationPhaseNodeNodeConnection', results: Array<{ __typename?: 'AnnotationPhaseNode', pk: any, phase: Types.AnnotationPhaseType, completedTasksCount: number, tasksCount: number, isOpen: boolean } | null> } | null };

export type EndPhaseMutationVariables = Types.Exact<{
  pk: Types.Scalars['PK']['input'];
  campaignPk: Types.Scalars['PK']['input'];
}>;


export type EndPhaseMutation = { __typename?: 'Mutation', endAnnotationPhase?: { __typename?: 'EndAnnotationPhaseMutation', ok: boolean } | null };

export type CreateVerificationPhaseMutationVariables = Types.Exact<{
  campaignPk: Types.Scalars['PK']['input'];
}>;


export type CreateVerificationPhaseMutation = { __typename?: 'Mutation', createAnnotationPhase?: { __typename?: 'CreateAnnotationPhase', pk: any } | null };

export type CreateAnnotationPhaseMutationVariables = Types.Exact<{
  campaignPk: Types.Scalars['PK']['input'];
  labelsWithAcousticFeatures: Array<Types.InputMaybe<Types.Scalars['String']['input']>> | Types.InputMaybe<Types.Scalars['String']['input']>;
  labelSetPk: Types.Scalars['PK']['input'];
  confidenceSetPk: Types.Scalars['PK']['input'];
  allowPointAnnotation: Types.Scalars['Boolean']['input'];
}>;


export type CreateAnnotationPhaseMutation = { __typename?: 'Mutation', createAnnotationPhase?: { __typename?: 'CreateAnnotationPhase', pk: any } | null, updateAnnotationCampaign?: { __typename?: 'UpdateAnnotationCampaign', ok: boolean } | null };

export type GetLabelsQueryVariables = Types.Exact<{
  campaignPK?: Types.InputMaybe<Types.Scalars['PK']['input']>;
  phase?: Types.InputMaybe<Types.AnnotationPhaseType>;
  userPK?: Types.InputMaybe<Types.Scalars['PK']['input']>;
}>;


export type GetLabelsQuery = { __typename?: 'Query', allAnnotationLabels?: { __typename?: 'AnnotationLabelNodeNodeConnection', results: Array<{ __typename?: 'AnnotationLabelNode', name: string } | null> } | null };

export type GetLabelsAndConfidenceSetsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetLabelsAndConfidenceSetsQuery = { __typename?: 'Query', allLabelSets?: { __typename?: 'LabelSetNodeNodeConnection', results: Array<{ __typename?: 'LabelSetNode', pk: any, name: string, description?: string | null, labels?: { __typename?: 'AnnotationLabelNodeNodeConnection', results: Array<{ __typename?: 'AnnotationLabelNode', name: string } | null> } | null } | null> } | null, allConfidenceSets?: { __typename?: 'ConfidenceSetNodeNodeConnection', results: Array<{ __typename?: 'ConfidenceSetNode', pk: any, name: string, desc?: string | null, confidenceIndicators?: { __typename?: 'ConfidenceNodeNodeConnection', results: Array<{ __typename?: 'ConfidenceNode', label: string, level: number } | null> } | null } | null> } | null };


export const ListCampaignsAndPhasesDocument = `
    query listCampaignsAndPhases($isArchived: Boolean, $phase: AnnotationPhaseType, $ownerPk: PK, $annotatorPk: PK, $search: String) {
  allAnnotationCampaigns(
    isArchived: $isArchived
    phaseType: $phase
    ownerPk: $ownerPk
    annotatorPk: $annotatorPk
    search: $search
  ) {
    results {
      pk
      name
      datasetName
      deadline
      isArchived
    }
  }
  allAnnotationPhases(
    isCampaignArchived: $isArchived
    phaseType: $phase
    campaignOwnerPk: $ownerPk
    annotatorPk: $annotatorPk
    search: $search
  ) {
    results {
      pk
      phase
      userTasksCount
      userCompletedTasksCount
      tasksCount
      completedTasksCount
      annotationCampaignPk
    }
  }
}
    `;
export const GetCampaignDocument = `
    query getCampaign($pk: PK!) {
  annotationCampaignByPk(pk: $pk) {
    pk
    isArchived
    canManage
    labelsWithAcousticFeatures {
      results {
        name
      }
    }
    owner {
      pk
    }
  }
  allAnnotationPhases(campaignPk: $pk) {
    results {
      pk
      phase
      completedTasksCount
      tasksCount
      isOpen
    }
  }
}
    `;
export const EndPhaseDocument = `
    mutation endPhase($pk: PK!, $campaignPk: PK!) {
  endAnnotationPhase(pk: $pk) {
    ok
  }
}
    `;
export const CreateVerificationPhaseDocument = `
    mutation createVerificationPhase($campaignPk: PK!) {
  createAnnotationPhase(campaignPk: $campaignPk, type: Verification) {
    pk
  }
}
    `;
export const CreateAnnotationPhaseDocument = `
    mutation createAnnotationPhase($campaignPk: PK!, $labelsWithAcousticFeatures: [String]!, $labelSetPk: PK!, $confidenceSetPk: PK!, $allowPointAnnotation: Boolean!) {
  createAnnotationPhase(campaignPk: $campaignPk, type: Annotation) {
    pk
  }
  updateAnnotationCampaign(
    pk: $campaignPk
    labelsWithAcousticFeatures: $labelsWithAcousticFeatures
    labelSetPk: $labelSetPk
    confidenceSetPk: $confidenceSetPk
    allowPointAnnotation: $allowPointAnnotation
  ) {
    ok
  }
}
    `;
export const GetLabelsDocument = `
    query getLabels($campaignPK: PK, $phase: AnnotationPhaseType, $userPK: PK) {
  allAnnotationLabels(
    usedInAnnotationsOfCampaign: $campaignPK
    usedInAnnotationsOfPhase: $phase
    usedInAnnotationsByUser: $userPK
  ) {
    results {
      name
    }
  }
}
    `;
export const GetLabelsAndConfidenceSetsDocument = `
    query getLabelsAndConfidenceSets {
  allLabelSets {
    results {
      pk
      name
      description
      labels {
        results {
          name
        }
      }
    }
  }
  allConfidenceSets {
    results {
      pk
      name
      desc
      confidenceIndicators {
        results {
          label
          level
        }
      }
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
    endPhase: build.mutation<EndPhaseMutation, EndPhaseMutationVariables>({
      query: (variables) => ({ document: EndPhaseDocument, variables })
    }),
    createVerificationPhase: build.mutation<CreateVerificationPhaseMutation, CreateVerificationPhaseMutationVariables>({
      query: (variables) => ({ document: CreateVerificationPhaseDocument, variables })
    }),
    createAnnotationPhase: build.mutation<CreateAnnotationPhaseMutation, CreateAnnotationPhaseMutationVariables>({
      query: (variables) => ({ document: CreateAnnotationPhaseDocument, variables })
    }),
    getLabels: build.query<GetLabelsQuery, GetLabelsQueryVariables | void>({
      query: (variables) => ({ document: GetLabelsDocument, variables })
    }),
    getLabelsAndConfidenceSets: build.query<GetLabelsAndConfidenceSetsQuery, GetLabelsAndConfidenceSetsQueryVariables | void>({
      query: (variables) => ({ document: GetLabelsAndConfidenceSetsDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


