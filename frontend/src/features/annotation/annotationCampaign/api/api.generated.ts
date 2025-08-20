import * as Types from '../../../gql/types.generated';

import { gqlAPI } from '@/features/gql/baseApi.ts';
export type GetAnnotationCampaignsQueryVariables = Types.Exact<{
  userID: Types.Scalars['ID']['input'];
  annotatorID?: Types.InputMaybe<Types.Scalars['Decimal']['input']>;
  ownerID?: Types.InputMaybe<Types.Scalars['Decimal']['input']>;
  isArchived?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
  phase?: Types.InputMaybe<Types.Scalars['String']['input']>;
  search?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type GetAnnotationCampaignsQuery = { __typename?: 'Query', allAnnotationCampaigns?: { __typename?: 'AnnotationCampaignNodeNodeConnection', results: Array<{ __typename?: 'AnnotationCampaignNode', id: string, name: string, deadline?: any | null, tasksCount?: number | null, finishedTasksCount?: number | null, userTasksCount?: number | null, userFinishedTasksCount?: number | null, dataset: { __typename?: 'DatasetNode', name: string }, archive?: { __typename?: 'ArchiveNode', id: string } | null, phases?: { __typename?: 'AnnotationPhaseNodeNodeConnection', results: Array<{ __typename?: 'AnnotationPhaseNode', phase?: any | null } | null> } | null } | null> } | null };


export const GetAnnotationCampaignsDocument = `
    query getAnnotationCampaigns($userID: ID!, $annotatorID: Decimal, $ownerID: Decimal, $isArchived: Boolean, $phase: String, $search: String) {
  allAnnotationCampaigns(
    annotatorId: $annotatorID
    ownerId: $ownerID
    isArchived: $isArchived
    phaseType: $phase
    search: $search
    orderBy: "name"
  ) {
    results {
      id
      name
      deadline
      tasksCount
      finishedTasksCount
      userTasksCount(id: $userID)
      userFinishedTasksCount(id: $userID)
      dataset {
        name
      }
      archive {
        id
      }
      phases {
        results {
          phase
        }
      }
    }
  }
}
    `;

const injectedRtkApi = gqlAPI.injectEndpoints({
  endpoints: (build) => ({
    getAnnotationCampaigns: build.query<GetAnnotationCampaignsQuery, GetAnnotationCampaignsQueryVariables>({
      query: (variables) => ({ document: GetAnnotationCampaignsDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


