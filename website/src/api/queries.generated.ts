import * as Types from './types.gql-generated';

import { GraphQLClient, RequestOptions } from 'graphql-request';
import { GraphQLError, print } from 'graphql'
import gql from 'graphql-tag';
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
export type AllTeamMembersQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type AllTeamMembersQuery = { __typename?: 'Query', allTeamMembers?: { __typename?: 'TeamMemberNodeNodeConnection', results: Array<{ __typename?: 'TeamMemberNode', id: string, picture: string, position: string, type?: Types.TeamMemberTypeEnum | null, person: { __typename?: 'PersonNode', initialNames?: string | null, firstName: string, lastName: string, currentInstitutions?: Array<{ __typename?: 'InstitutionNode', name: string } | null> | null } } | null> } | null };

export type TeamMemberByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type TeamMemberByIdQuery = { __typename?: 'Query', teamMemberById?: { __typename?: 'TeamMemberNode', position: string, picture: string, biography?: string | null, personalWebsiteUrl?: string | null, githubUrl?: string | null, mailAddress?: string | null, linkedinUrl?: string | null, researchGateUrl?: string | null, person: { __typename?: 'PersonNode', firstName: string, lastName: string, initialNames?: string | null } } | null };


export const AllTeamMembersDocument = gql`
    query allTeamMembers {
  allTeamMembers {
    results {
      id
      picture
      person {
        initialNames
        firstName
        lastName
        currentInstitutions {
          name
        }
      }
      position
      type
    }
  }
}
    `;
export const TeamMemberByIdDocument = gql`
    query teamMemberById($id: ID!) {
  teamMemberById(id: $id) {
    position
    picture
    biography
    person {
      firstName
      lastName
      initialNames
    }
    personalWebsiteUrl
    githubUrl
    mailAddress
    linkedinUrl
    researchGateUrl
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();
const AllTeamMembersDocumentString = print(AllTeamMembersDocument);
const TeamMemberByIdDocumentString = print(TeamMemberByIdDocument);
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    allTeamMembers(variables?: AllTeamMembersQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: AllTeamMembersQuery; errors?: GraphQLError[]; extensions?: any; headers: Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<AllTeamMembersQuery>(AllTeamMembersDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'allTeamMembers', 'query', variables);
    },
    teamMemberById(variables: TeamMemberByIdQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: TeamMemberByIdQuery; errors?: GraphQLError[]; extensions?: any; headers: Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<TeamMemberByIdQuery>(TeamMemberByIdDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'teamMemberById', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;