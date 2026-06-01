import { api } from './user.generated';

export const UserGqlAPI = api.enhanceEndpoints({
  endpoints: {
    listUsers: {
      providesTags: [ 'User' ]
    },
    updateCurrentUserEmail: {
      invalidatesTags: [ 'CurrentUser' ]
    }
  }
})