import * as Types from '../types.gql-generated';

import { gqlAPI } from '@/api/baseGqlApi';
export type UpdateTaskCommentsMutationVariables = Types.Exact<{
  campaignID: Types.Scalars['ID']['input'];
  spectrogramID: Types.Scalars['ID']['input'];
  phase: Types.AnnotationPhaseType;
  comments: Array<Types.InputMaybe<Types.AnnotationCommentInput>> | Types.InputMaybe<Types.AnnotationCommentInput>;
}>;


export type UpdateTaskCommentsMutation = { __typename?: 'Mutation', updateAnnotationComments?: { __typename?: 'UpdateAnnotationCommentsMutationPayload', errors?: Array<Array<{ __typename?: 'ErrorType', messages: Array<string>, field: string } | null> | null> | null } | null };


export const UpdateTaskCommentsDocument = `
    mutation updateTaskComments($campaignID: ID!, $spectrogramID: ID!, $phase: AnnotationPhaseType!, $comments: [AnnotationCommentInput]!) {
  updateAnnotationComments(
    input: {campaignId: $campaignID, phaseType: $phase, spectrogramId: $spectrogramID, list: $comments, annotationId: null}
  ) {
    errors {
      messages
      field
    }
  }
}
    `;

const injectedRtkApi = gqlAPI.injectEndpoints({
  endpoints: (build) => ({
    updateTaskComments: build.mutation<UpdateTaskCommentsMutation, UpdateTaskCommentsMutationVariables>({
      query: (variables) => ({ document: UpdateTaskCommentsDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


