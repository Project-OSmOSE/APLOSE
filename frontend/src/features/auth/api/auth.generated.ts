import * as Types from '../../_utils_/gql/types.generated';

import { gqlAPI } from '@/features/_utils_/gql/baseApi.ts';
export type GetCurrentUserQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetCurrentUserQuery = { __typename?: 'Query', currentUser?: { __typename?: 'UserNode', pk: any, displayName: string, isAdmin: boolean, isSuperuser: boolean, username: string, email: string } | null };

export type ListUsersQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ListUsersQuery = { __typename?: 'Query', allUsers?: { __typename?: 'UserNodeNodeConnection', results: Array<{ __typename?: 'UserNode', pk: any, displayName: string, expertise?: Types.ExpertiseLevel | null } | null> } | null, allUserGroups?: { __typename?: 'UserGroupNodeNodeConnection', results: Array<{ __typename?: 'UserGroupNode', pk: any, name: string, annotators: { __typename?: 'UserNodeConnection', edges: Array<{ __typename?: 'UserNodeEdge', node?: { __typename?: 'UserNode', pk: any } | null } | null> } } | null> } | null };

export type UpdatePasswordMutationVariables = Types.Exact<{
  oldPassword: Types.Scalars['String']['input'];
  newPassword: Types.Scalars['String']['input'];
}>;


export type UpdatePasswordMutation = { __typename?: 'Mutation', userUpdatePassword?: { __typename?: 'UpdatePasswordMutationPayload', errors?: Array<{ __typename?: 'ErrorType', field: string, messages: Array<string> } | null> | null } | null };

export type UpdateUserMutationVariables = Types.Exact<{
  email: Types.Scalars['String']['input'];
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', currentUserUpdate?: { __typename?: 'UpdateUserMutationPayload', errors: Array<{ __typename?: 'ErrorType', field: string, messages: Array<string> }> } | null };


export const GetCurrentUserDocument = `
    query getCurrentUser {
  currentUser {
    pk
    displayName
    isAdmin
    isSuperuser
    username
    email
  }
}
    `;
export const ListUsersDocument = `
    query listUsers {
  allUsers {
    results {
      pk
      displayName
      expertise
    }
  }
  allUserGroups {
    results {
      pk
      name
      annotators {
        edges {
          node {
            pk
          }
        }
      }
    }
  }
}
    `;
export const UpdatePasswordDocument = `
    mutation updatePassword($oldPassword: String!, $newPassword: String!) {
  userUpdatePassword(
    input: {oldPassword: $oldPassword, newPassword: $newPassword}
  ) {
    errors {
      field
      messages
    }
  }
}
    `;
export const UpdateUserDocument = `
    mutation updateUser($email: String!) {
  currentUserUpdate(input: {email: $email}) {
    errors {
      field
      messages
    }
  }
}
    `;

const injectedRtkApi = gqlAPI.injectEndpoints({
  endpoints: (build) => ({
    getCurrentUser: build.query<GetCurrentUserQuery, GetCurrentUserQueryVariables | void>({
      query: (variables) => ({ document: GetCurrentUserDocument, variables })
    }),
    listUsers: build.query<ListUsersQuery, ListUsersQueryVariables | void>({
      query: (variables) => ({ document: ListUsersDocument, variables })
    }),
    updatePassword: build.mutation<UpdatePasswordMutation, UpdatePasswordMutationVariables>({
      query: (variables) => ({ document: UpdatePasswordDocument, variables })
    }),
    updateUser: build.mutation<UpdateUserMutation, UpdateUserMutationVariables>({
      query: (variables) => ({ document: UpdateUserDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


