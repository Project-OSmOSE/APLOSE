import * as Types from '../../types.generated';

import { gqlAPI } from '@/features/gql/baseApi.ts';
export type GetFileRangeDatesQueryVariables = Types.Exact<{
  campaignID: Types.Scalars['PK']['input'];
  annotatorID: Types.Scalars['PK']['input'];
  phase: Types.AnnotationPhaseType;
}>;


export type GetFileRangeDatesQuery = { __typename?: 'Query', allAnnotationFileRanges?: { __typename?: 'AnnotationFileRangeNodeNodeConnection', results: Array<{ __typename?: 'AnnotationFileRangeNode', fromDatetime: any, toDatetime: any } | null> } | null };


export const GetFileRangeDatesDocument = `
    query getFileRangeDates($campaignID: PK!, $annotatorID: PK!, $phase: AnnotationPhaseType!) {
  allAnnotationFileRanges(
    annotationCampaignId: $campaignID
    annotatorId: $annotatorID
    phaseType: $phase
  ) {
    results {
      fromDatetime
      toDatetime
    }
  }
}
    `;

const injectedRtkApi = gqlAPI.injectEndpoints({
  endpoints: (build) => ({
    getFileRangeDates: build.query<GetFileRangeDatesQuery, GetFileRangeDatesQueryVariables>({
      query: (variables) => ({ document: GetFileRangeDatesDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


