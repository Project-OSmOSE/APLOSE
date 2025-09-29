import * as Types from '../../../_utils_/gql/types.generated';

import { gqlAPI } from '@/features/_utils_/gql/baseApi.ts';
export type GetAnnotationSettingsQueryVariables = Types.Exact<{
  campaignID: Types.Scalars['PK']['input'];
  phaseType: Types.AnnotationPhaseType;
}>;


export type GetAnnotationSettingsQuery = { __typename?: 'Query', annotationPhaseForCampaign?: { __typename?: 'AnnotationPhaseNode', annotationCampaign: { __typename?: 'AnnotationCampaignNode', labelSet?: { __typename?: 'LabelSetNode', labels?: { __typename?: 'AnnotationLabelNodeNodeConnection', results: Array<{ __typename?: 'AnnotationLabelNode', name: string } | null> } | null } | null, confidenceSet?: { __typename?: 'ConfidenceSetNode', confidenceIndicators?: { __typename?: 'ConfidenceNodeNodeConnection', results: Array<{ __typename?: 'ConfidenceNode', label: string } | null> } | null } | null, detectors?: { __typename?: 'DetectorNodeNodeConnection', results: Array<{ __typename?: 'DetectorNode', pk: any, name: string } | null> } | null, annotators?: { __typename?: 'UserNodeNodeConnection', results: Array<{ __typename?: 'UserNode', pk: any, displayName: string, username: string } | null> } | null } } | null };


export const GetAnnotationSettingsDocument = `
    query getAnnotationSettings($campaignID: PK!, $phaseType: AnnotationPhaseType!) {
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
          pk
          name
        }
      }
      annotators {
        results {
          pk
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


