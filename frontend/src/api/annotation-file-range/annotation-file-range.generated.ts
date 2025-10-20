import * as Types from '../types.gql-generated';

import { gqlAPI } from '@/api/baseGqlApi';
export type ListFileRangesQueryVariables = Types.Exact<{
  campaignID: Types.Scalars['ID']['input'];
  phaseType: Types.AnnotationPhaseType;
}>;


export type ListFileRangesQuery = { __typename?: 'Query', allAnnotationFileRanges?: { __typename?: 'AnnotationFileRangeNodeNodeConnection', results: Array<{ __typename?: 'AnnotationFileRangeNode', id: string, firstFileIndex: number, lastFileIndex: number, annotator: { __typename?: 'UserNode', id: string, displayName: string }, spectrograms?: { __typename?: 'SpectrogramNodeNodeConnection', totalCount?: number | null } | null, completedAnnotationTasks?: { __typename?: 'AnnotationTaskNodeNodeConnection', totalCount?: number | null } | null } | null> } | null };

export type UpdateFileRangesMutationVariables = Types.Exact<{
  campaignID: Types.Scalars['ID']['input'];
  phaseType: Types.AnnotationPhaseType;
  fileRanges: Array<Types.InputMaybe<Types.AnnotationFileRangeInput>> | Types.InputMaybe<Types.AnnotationFileRangeInput>;
}>;


export type UpdateFileRangesMutation = { __typename?: 'Mutation', updateAnnotationPhaseFileRanges?: { __typename?: 'UpdateAnnotationPhaseFileRanges', errors: Array<Array<{ __typename?: 'ErrorType', messages: Array<string>, field: string }> | null> } | null };


export const ListFileRangesDocument = `
    query listFileRanges($campaignID: ID!, $phaseType: AnnotationPhaseType!) {
  allAnnotationFileRanges(
    annotationPhase_AnnotationCampaign: $campaignID
    annotationPhase_Phase: $phaseType
  ) {
    results {
      id
      firstFileIndex
      lastFileIndex
      annotator {
        id
        displayName
      }
      spectrograms {
        totalCount
      }
      completedAnnotationTasks: annotationTasks(status: Finished) {
        totalCount
      }
    }
  }
}
    `;
export const UpdateFileRangesDocument = `
    mutation updateFileRanges($campaignID: ID!, $phaseType: AnnotationPhaseType!, $fileRanges: [AnnotationFileRangeInput]!) {
  updateAnnotationPhaseFileRanges(
    campaignId: $campaignID
    phaseType: $phaseType
    fileRanges: $fileRanges
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
    listFileRanges: build.query<ListFileRangesQuery, ListFileRangesQueryVariables>({
      query: (variables) => ({ document: ListFileRangesDocument, variables })
    }),
    updateFileRanges: build.mutation<UpdateFileRangesMutation, UpdateFileRangesMutationVariables>({
      query: (variables) => ({ document: UpdateFileRangesDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


