import { api } from './collaborator.generated'

export const CollaboratorGqlAPI = api.enhanceEndpoints({
  endpoints: {
    homeCollaborators: {
      providesTags: [ 'Collaborator' ],
    },
  },
})