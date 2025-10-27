import * as Types from '../types.gql-generated';

import { gqlAPI } from '@/api/baseGqlApi';
export type GetCurrentUserQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetCurrentUserQuery = { __typename?: 'Query', currentUser?: { __typename?: 'UserNode', id: string, displayName: string, isAdmin: boolean, isSuperuser: boolean, username: string, email: string } | null };

export type ListUsersQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ListUsersQuery = { __typename?: 'Query', allUsers?: { __typename?: 'UserNodeNodeConnection', results: Array<{ __typename?: 'UserNode', id: string, displayName: string, expertise?: Types.ExpertiseLevelType | null } | null> } | null, allUserGroups?: { __typename?: 'UserGroupNodeNodeConnection', results: Array<{ __typename?: 'UserGroupNode', id: string, name: string, users?: Array<{ __typename?: 'UserNode', id: string } | null> | null } | null> } | null };

export type UpdateCurrentUserPasswordMutationVariables = Types.Exact<{
  oldPassword: Types.Scalars['String']['input'];
  newPassword: Types.Scalars['String']['input'];
}>;


export type UpdateCurrentUserPasswordMutation = { __typename?: 'Mutation', userUpdatePassword?: { __typename?: 'UpdateUserPasswordMutationPayload', errors?: Array<{ __typename?: 'ErrorType', field: string, messages: Array<string> } | null> | null } | null };

export type UpdateCurrentUserEmailMutationVariables = Types.Exact<{
  email: Types.Scalars['String']['input'];
}>;


export type UpdateCurrentUserEmailMutation = { __typename?: 'Mutation', currentUserUpdate?: { __typename?: 'UpdateUserMutationPayload', errors: Array<{ __typename?: 'ErrorType', field: string, messages: Array<string> }> } | null };


export const GetCurrentUserDocument = `
    query getCurrentUser {
  currentUser {
    id
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
      id
      displayName
      expertise
    }
  }
  allUserGroups {
    results {
      id
      name
      users {
        id
      }
    }
  }
}
    `;
export const UpdateCurrentUserPasswordDocument = `
    mutation updateCurrentUserPassword($oldPassword: String!, $newPassword: String!) {
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
export const UpdateCurrentUserEmailDocument = `
    mutation updateCurrentUserEmail($email: String!) {
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
    updateCurrentUserPassword: build.mutation<UpdateCurrentUserPasswordMutation, UpdateCurrentUserPasswordMutationVariables>({
      query: (variables) => ({ document: UpdateCurrentUserPasswordDocument, variables })
    }),
    updateCurrentUserEmail: build.mutation<UpdateCurrentUserEmailMutation, UpdateCurrentUserEmailMutationVariables>({
      query: (variables) => ({ document: UpdateCurrentUserEmailDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


