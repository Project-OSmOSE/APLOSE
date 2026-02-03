import * as Types from '../types.gql-generated';

import { gqlAPI } from '@/api/baseGqlApi';
export type HomeCollaboratorsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type HomeCollaboratorsQuery = { __typename?: 'Query', allCollaborators?: { __typename?: 'CollaboratorNodeNodeConnection', results: Array<{ __typename?: 'CollaboratorNode', name: string, thumbnail: string, url?: string | null } | null> } | null };


export const HomeCollaboratorsDocument = `
    query homeCollaborators {
  allCollaborators(showOnAploseHome: true) {
    results {
      name
      thumbnail
      url
    }
  }
}
    `;

const injectedRtkApi = gqlAPI.injectEndpoints({
  endpoints: (build) => ({
    homeCollaborators: build.query<HomeCollaboratorsQuery, HomeCollaboratorsQueryVariables | void>({
      query: (variables) => ({ document: HomeCollaboratorsDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


