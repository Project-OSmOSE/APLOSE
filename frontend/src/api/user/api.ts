import { api } from "./user.generated";

export const UserGqlAPI = api.enhanceEndpoints({
  endpoints: {
    getCurrentUser: {
      providesTags: [ 'CurrentUser' ]
    },
    listUsers: {
      providesTags: [ 'User' ]
    },
    updateCurrentUserEmail: {
      invalidatesTags: [ 'CurrentUser' ]
    }
  }
})