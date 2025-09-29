import { api } from './auth.generated.ts'
import { useMemo } from "react";
import { createSelector } from "@reduxjs/toolkit";
import { AppState } from "@/service/app.ts";

export const AuthQueryAPI = api.enhanceEndpoints({
  endpoints: {
    getCurrentUser: {
      providesTags: [ 'CurrentUser' ]
    },
    listUsers: {
      providesTags: [ 'User' ]
    },
    updateUser: {
      invalidatesTags: [ 'CurrentUser' ]
    }
  }
})

export const {
  useUpdatePasswordMutation,
} = AuthQueryAPI

const createGetCurrentUserSelector = createSelector(
  () => undefined,
  () => AuthQueryAPI.endpoints.getCurrentUser.select()
)
export const selectCurrentUser = createSelector(
  (state: AppState) => state,
  () => createGetCurrentUserSelector(undefined),
  (state, selectCurrentUser) => selectCurrentUser(state).data?.currentUser
)

export const useCurrentUser = () => {
  const results = AuthQueryAPI.endpoints.getCurrentUser.useQuery()
  return useMemo(() => ({
    ...results,
    user: results?.data?.currentUser
  }), [ results ])
}

export const useUsers = () => {
  const results = AuthQueryAPI.endpoints.listUsers.useQuery()
  return useMemo(() => ({
    ...results,
    users: results?.data?.allUsers?.results.filter(r => r !== null) ?? [],
    groups: results?.data?.allUserGroups?.results.filter(r => r !== null) ?? [],
  }), [ results ])
}

export const useUpdateCurrentUser = () => {
  const [ updateCurrentUser, result ] = AuthQueryAPI.useUpdateUserMutation();

  return {
    updateCurrentUser,
    data: useMemo(() => {
      const formErrors = result.data?.currentUserUpdate?.errors ?? []
      return {
        ...result,
        isSuccess: result.isSuccess && formErrors.length === 0,
        formErrors
      }
    }, [ result ])
  }
}