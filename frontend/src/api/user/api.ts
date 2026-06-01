import { api } from './user.generated';

export const UserGqlAPI = api.enhanceEndpoints({
  endpoints: {
    updateCurrentUserEmail: {
      invalidatesTags: [ 'CurrentUser' ]
    }
  }
})