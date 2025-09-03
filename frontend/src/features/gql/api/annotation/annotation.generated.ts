import * as Types from '../../types.generated';

import { gqlAPI } from '@/features/gql/baseApi.ts';
export type GetAnnotationSettingsQueryVariables = Types.Exact<{
  campaignID: Types.Scalars['ID']['input'];
  phaseType: Types.AnnotationPhaseType;
}>;


export type GetAnnotationSettingsQuery = { __typename?: 'Query', annotationPhaseForCampaign?: { __typename?: 'AnnotationPhaseNode', annotationCampaign: { __typename?: 'AnnotationCampaignNode', labelSet?: { __typename?: 'LabelSetNode', labels?: { __typename?: 'AnnotationLabelNodeNodeConnection', results: Array<{ __typename?: 'AnnotationLabelNode', name: string } | null> } | null } | null, confidenceSet?: { __typename?: 'ConfidenceSetNode', confidenceIndicators?: { __typename?: 'ConfidenceNodeNodeConnection', results: Array<{ __typename?: 'ConfidenceNode', label: string } | null> } | null } | null, detectors?: { __typename?: 'DetectorNodeNodeConnection', results: Array<{ __typename?: 'DetectorNode', id: string, name: string } | null> } | null, annotators?: { __typename?: 'UserNodeNodeConnection', results: Array<{ __typename?: 'UserNode', id: string, displayName?: string | null, username: string } | null> } | null } } | null };


export const GetAnnotationSettingsDocument = `
    query getAnnotationSettings($campaignID: ID!, $phaseType: AnnotationPhaseType!) {
  annotationPhaseForCampaign(campaignId: $campaignID, phaseType: $phaseType) {
    annotationCampaign {
      labelSet {
        labels {
          results {
            name
          }
        }
      }
      confidenceSet {
        confidenceIndicators {
          results {
            label
          }
        }
      }
      detectors {
        results {
          id
          name
        }
      }
      annotators {
        results {
          id
          displayName
          username
        }
      }
    }
  }
}
    `;

const injectedRtkApi = gqlAPI.injectEndpoints({
  endpoints: (build) => ({
    getAnnotationSettings: build.query<GetAnnotationSettingsQuery, GetAnnotationSettingsQueryVariables>({
      query: (variables) => ({ document: GetAnnotationSettingsDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


