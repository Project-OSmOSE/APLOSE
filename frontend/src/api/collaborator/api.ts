import { restAPI } from '@/api/baseRestApi';
import { Collaborator } from './types'

export const CollaboratorRestAPI = restAPI.injectEndpoints({
  endpoints: (builder) => ({
    listCollaborator: builder.query<Array<Collaborator>, void>({
      query: () => 'collaborators/on_aplose_home',
      providesTags: [ 'Collaborator' ],
    }),
  }),
})
