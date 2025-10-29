import * as Types from '../types.gql-generated';

import { gqlAPI } from '@/api/baseGqlApi';
export type UpdateAnnotationsMutationVariables = Types.Exact<{
  campaignID: Types.Scalars['ID']['input'];
  spectrogramID: Types.Scalars['ID']['input'];
  phase: Types.AnnotationPhaseType;
  annotations: Array<Types.InputMaybe<Types.AnnotationInput>> | Types.InputMaybe<Types.AnnotationInput>;
}>;


export type UpdateAnnotationsMutation = { __typename?: 'Mutation', updateAnnotations?: { __typename?: 'UpdateAnnotationsMutationPayload', errors?: Array<Array<{ __typename?: 'ErrorType', messages: Array<string>, field: string } | null> | null> | null } | null };


export const UpdateAnnotationsDocument = `
    mutation updateAnnotations($campaignID: ID!, $spectrogramID: ID!, $phase: AnnotationPhaseType!, $annotations: [AnnotationInput]!) {
  updateAnnotations(
    input: {campaignId: $campaignID, phaseType: $phase, spectrogramId: $spectrogramID, list: $annotations}
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
    updateAnnotations: build.mutation<UpdateAnnotationsMutation, UpdateAnnotationsMutationVariables>({
      query: (variables) => ({ document: UpdateAnnotationsDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


