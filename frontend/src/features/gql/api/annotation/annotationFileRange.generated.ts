import * as Types from '../../types.generated';

import { gqlAPI } from '@/features/gql/baseApi.ts';
export type GetFileRangeDatesQueryVariables = Types.Exact<{
  campaignID: Types.Scalars['ID']['input'];
  annotatorID: Types.Scalars['ID']['input'];
  phase: Types.Scalars['String']['input'];
}>;


export type GetFileRangeDatesQuery = { __typename?: 'Query', allAnnotationFileRanges?: { __typename?: 'AnnotationFileRangeNodeNodeConnection', results: Array<{ __typename?: 'AnnotationFileRangeNode', fromDatetime: any, toDatetime: any } | null> } | null };


export const GetFileRangeDatesDocument = `
    query getFileRangeDates($campaignID: ID!, $annotatorID: ID!, $phase: String!) {
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


