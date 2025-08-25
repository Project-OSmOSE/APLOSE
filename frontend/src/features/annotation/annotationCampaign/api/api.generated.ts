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


export type GetAnnotationCampaignsQuery = { __typename?: 'Query', allAnnotationCampaigns?: { __typename?: 'AnnotationCampaignNodeNodeConnection', results: Array<{ __typename?: 'AnnotationCampaignNode', id: string, name: string, deadline?: any | null, tasksCount?: number | null, finishedTasksCount?: number | null, userTasksCount?: number | null, userFinishedTasksCount?: number | null, state?: string | null, dataset: { __typename?: 'DatasetNode', name: string }, archive?: { __typename?: 'ArchiveNode', id: string } | null, phases?: { __typename?: 'AnnotationPhaseNodeNodeConnection', results: Array<{ __typename?: 'AnnotationPhaseNode', phase?: any | null } | null> } | null } | null> } | null };

export type GetAnnotationCampaignByIdGlobalQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type GetAnnotationCampaignByIdGlobalQuery = { __typename?: 'Query', annotationCampaignById?: { __typename?: 'AnnotationCampaignNode', name: string, createdAt: any, owner: { __typename?: 'UserNode', displayName?: string | null, email: string }, phases?: { __typename?: 'AnnotationPhaseNodeNodeConnection', results: Array<{ __typename?: 'AnnotationPhaseNode', phase?: any | null } | null> } | null, archive?: { __typename?: 'ArchiveNode', date: any } | null } | null };

export type GetAnnotationCampaignByIdDetailedQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type GetAnnotationCampaignByIdDetailedQuery = { __typename?: 'Query', annotationCampaignById?: { __typename?: 'AnnotationCampaignNode', id: string, isEditAllowed?: boolean | null, instructionsUrl?: string | null, deadline?: any | null, description?: string | null, allowPointAnnotation: boolean, labelsWithAcousticFeatures?: { __typename?: 'AnnotationLabelNodeNodeConnection', results: Array<{ __typename?: 'AnnotationLabelNode', name: string } | null> } | null, labelSet?: { __typename?: 'LabelSetNode', name: string, description?: string | null, labels?: { __typename?: 'AnnotationLabelNodeNodeConnection', results: Array<{ __typename?: 'AnnotationLabelNode', name: string } | null> } | null } | null, confidenceSet?: { __typename?: 'ConfidenceSetNode', name: string, confidenceIndicators?: { __typename?: 'ConfidenceNodeNodeConnection', results: Array<{ __typename?: 'ConfidenceNode', label: string } | null> } | null } | null, archive?: { __typename?: 'ArchiveNode', id: string, date: any, byUser?: { __typename?: 'UserNode', displayName?: string | null } | null } | null, phases?: { __typename?: 'AnnotationPhaseNodeNodeConnection', results: Array<{ __typename?: 'AnnotationPhaseNode', phase?: any | null, isCompleted?: boolean | null, completedTasksCount?: number | null, tasksCount?: number | null } | null> } | null, dataset: { __typename?: 'DatasetNode', id: string, name: string }, analysis?: { __typename?: 'SpectrogramAnalysisNodeNodeConnection', results: Array<{ __typename?: 'SpectrogramAnalysisNode', name: string } | null> } | null } | null };

export type PostArchiveAnnotationCampaignMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type PostArchiveAnnotationCampaignMutation = { __typename?: 'Mutation', archiveAnnotationCampaign?: { __typename?: 'ArchiveAnnotationCampaignMutation', ok: boolean } | null };

export type PostUpdateAnnotationCampaignLabelsWithFeaturesMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
  labels: Array<Types.InputMaybe<Types.Scalars['String']['input']>> | Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type PostUpdateAnnotationCampaignLabelsWithFeaturesMutation = { __typename?: 'Mutation', updateAnnotationCampaignLabelsWithFeatures?: { __typename?: 'UpdateAnnotationCampaignLabelsWithFeaturesMutation', ok: boolean } | null };


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
      state
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
export const GetAnnotationCampaignByIdGlobalDocument = `
    query getAnnotationCampaignByIDGlobal($id: ID!) {
  annotationCampaignById(id: $id) {
    name
    createdAt
    owner {
      displayName
      email
    }
    phases(orderBy: "phase") {
      results {
        phase
      }
    }
    archive {
      date
    }
  }
}
    `;
export const GetAnnotationCampaignByIdDetailedDocument = `
    query getAnnotationCampaignByIDDetailed($id: ID!) {
  annotationCampaignById(id: $id) {
    id
    isEditAllowed
    instructionsUrl
    deadline
    description
    allowPointAnnotation
    labelsWithAcousticFeatures {
      results {
        name
      }
    }
    labelSet {
      name
      description
      labels {
        results {
          name
        }
      }
    }
    confidenceSet {
      name
      confidenceIndicators {
        results {
          label
        }
      }
    }
    archive {
      id
      date
      byUser {
        displayName
      }
    }
    phases {
      results {
        phase
        isCompleted
        completedTasksCount
        tasksCount
      }
    }
    dataset {
      id
      name
    }
    analysis {
      results {
        name
      }
    }
  }
}
    `;
export const PostArchiveAnnotationCampaignDocument = `
    mutation postArchiveAnnotationCampaign($id: ID!) {
  archiveAnnotationCampaign(id: $id) {
    ok
  }
}
    `;
export const PostUpdateAnnotationCampaignLabelsWithFeaturesDocument = `
    mutation postUpdateAnnotationCampaignLabelsWithFeatures($id: ID!, $labels: [String]!) {
  updateAnnotationCampaignLabelsWithFeatures(
    id: $id
    labelsWithAcousticFeatures: $labels
  ) {
    ok
  }
}
    `;

const injectedRtkApi = gqlAPI.injectEndpoints({
  endpoints: (build) => ({
    getAnnotationCampaigns: build.query<GetAnnotationCampaignsQuery, GetAnnotationCampaignsQueryVariables>({
      query: (variables) => ({ document: GetAnnotationCampaignsDocument, variables })
    }),
    getAnnotationCampaignByIDGlobal: build.query<GetAnnotationCampaignByIdGlobalQuery, GetAnnotationCampaignByIdGlobalQueryVariables>({
      query: (variables) => ({ document: GetAnnotationCampaignByIdGlobalDocument, variables })
    }),
    getAnnotationCampaignByIDDetailed: build.query<GetAnnotationCampaignByIdDetailedQuery, GetAnnotationCampaignByIdDetailedQueryVariables>({
      query: (variables) => ({ document: GetAnnotationCampaignByIdDetailedDocument, variables })
    }),
    postArchiveAnnotationCampaign: build.mutation<PostArchiveAnnotationCampaignMutation, PostArchiveAnnotationCampaignMutationVariables>({
      query: (variables) => ({ document: PostArchiveAnnotationCampaignDocument, variables })
    }),
    postUpdateAnnotationCampaignLabelsWithFeatures: build.mutation<PostUpdateAnnotationCampaignLabelsWithFeaturesMutation, PostUpdateAnnotationCampaignLabelsWithFeaturesMutationVariables>({
      query: (variables) => ({ document: PostUpdateAnnotationCampaignLabelsWithFeaturesDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


