import * as Types from '../../types.generated';

import { gqlAPI } from '@/features/gql/baseApi.ts';
export type GetPhaseQueryVariables = Types.Exact<{
  campaignID: Types.Scalars['PK']['input'];
  phaseType: Types.AnnotationPhaseType;
}>;


export type GetPhaseQuery = { __typename?: 'Query', annotationPhaseForCampaign?: { __typename?: 'AnnotationPhaseNode', endedAt?: any | null, phase?: Types.AnnotationPhaseType | null, hasAnnotations?: boolean | null, annotationCampaign: { __typename?: 'AnnotationCampaignNode', archive?: { __typename?: 'ArchiveNode', date: any } | null } } | null };


export const GetPhaseDocument = `
    query getPhase($campaignID: PK!, $phaseType: AnnotationPhaseType!) {
  annotationPhaseForCampaign(campaignId: $campaignID, phaseType: $phaseType) {
    annotationCampaign {
      archive {
        date
      }
    }
    endedAt
    phase
    hasAnnotations
  }
}
    `;

const injectedRtkApi = gqlAPI.injectEndpoints({
  endpoints: (build) => ({
    getPhase: build.query<GetPhaseQuery, GetPhaseQueryVariables>({
      query: (variables) => ({ document: GetPhaseDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


