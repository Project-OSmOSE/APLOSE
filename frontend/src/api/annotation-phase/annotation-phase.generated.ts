import * as Types from '../types.gql-generated';

import { gqlAPI } from '@/api/baseGqlApi';
export type EndPhaseMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
  campaignID: Types.Scalars['ID']['input'];
}>;


export type EndPhaseMutation = { __typename?: 'Mutation', endAnnotationPhase?: { __typename?: 'EndAnnotationPhaseMutation', ok: boolean } | null };

export type CreateAnnotationPhaseMutationVariables = Types.Exact<{
  campaignID: Types.Scalars['ID']['input'];
  labelsWithAcousticFeatures: Array<Types.InputMaybe<Types.Scalars['ID']['input']>> | Types.InputMaybe<Types.Scalars['ID']['input']>;
  labelSetID: Types.Scalars['ID']['input'];
  confidenceSetID?: Types.InputMaybe<Types.Scalars['ID']['input']>;
  allowPointAnnotation: Types.Scalars['Boolean']['input'];
}>;


export type CreateAnnotationPhaseMutation = { __typename?: 'Mutation', createAnnotationPhase?: { __typename?: 'CreateAnnotationPhase', id: string } | null, updateAnnotationCampaign?: { __typename?: 'UpdateAnnotationCampaignMutationPayload', errors: Array<{ __typename?: 'ErrorType', field: string, messages: Array<string> }> } | null };

export type CreateVerificationPhaseMutationVariables = Types.Exact<{
  campaignID: Types.Scalars['ID']['input'];
}>;


export type CreateVerificationPhaseMutation = { __typename?: 'Mutation', createAnnotationPhase?: { __typename?: 'CreateAnnotationPhase', id: string } | null };

export type GetAnnotationPhaseQueryVariables = Types.Exact<{
  campaignID: Types.Scalars['ID']['input'];
  phase: Types.AnnotationPhaseType;
}>;


export type GetAnnotationPhaseQuery = { __typename?: 'Query', annotationPhaseByCampaignPhase?: { __typename?: 'AnnotationPhaseNode', id: string, phase: Types.AnnotationPhaseType, canManage: boolean, endedAt?: any | null, userTasksCount: number, userCompletedTasksCount: number, tasksCount: number, completedTasksCount: number, hasAnnotations: boolean } | null };


export const EndPhaseDocument = `
    mutation endPhase($id: ID!, $campaignID: ID!) {
  endAnnotationPhase(id: $id) {
    ok
  }
}
    `;
export const CreateAnnotationPhaseDocument = `
    mutation createAnnotationPhase($campaignID: ID!, $labelsWithAcousticFeatures: [ID]!, $labelSetID: ID!, $confidenceSetID: ID, $allowPointAnnotation: Boolean!) {
  createAnnotationPhase(campaignId: $campaignID, type: Annotation) {
    id
  }
  updateAnnotationCampaign(
    input: {id: $campaignID, allowPointAnnotation: $allowPointAnnotation, labelsWithAcousticFeatures: $labelsWithAcousticFeatures, labelSet: $labelSetID, confidenceSet: $confidenceSetID}
  ) {
    errors {
      field
      messages
    }
  }
}
    `;
export const CreateVerificationPhaseDocument = `
    mutation createVerificationPhase($campaignID: ID!) {
  createAnnotationPhase(campaignId: $campaignID, type: Verification) {
    id
  }
}
    `;
export const GetAnnotationPhaseDocument = `
    query getAnnotationPhase($campaignID: ID!, $phase: AnnotationPhaseType!) {
  annotationPhaseByCampaignPhase(campaignId: $campaignID, phaseType: $phase) {
    id
    phase
    canManage
    endedAt
    userTasksCount
    userCompletedTasksCount
    tasksCount
    completedTasksCount
    hasAnnotations
  }
}
    `;

const injectedRtkApi = gqlAPI.injectEndpoints({
  endpoints: (build) => ({
    endPhase: build.mutation<EndPhaseMutation, EndPhaseMutationVariables>({
      query: (variables) => ({ document: EndPhaseDocument, variables })
    }),
    createAnnotationPhase: build.mutation<CreateAnnotationPhaseMutation, CreateAnnotationPhaseMutationVariables>({
      query: (variables) => ({ document: CreateAnnotationPhaseDocument, variables })
    }),
    createVerificationPhase: build.mutation<CreateVerificationPhaseMutation, CreateVerificationPhaseMutationVariables>({
      query: (variables) => ({ document: CreateVerificationPhaseDocument, variables })
    }),
    getAnnotationPhase: build.query<GetAnnotationPhaseQuery, GetAnnotationPhaseQueryVariables>({
      query: (variables) => ({ document: GetAnnotationPhaseDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


