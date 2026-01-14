import { useMemo } from "react";
import { UserGqlAPI } from "./api";

const {
  getCurrentUser,
  listUsers,
  updateCurrentUserEmail,
  updateCurrentUserPassword,
} = UserGqlAPI.endpoints

export const useCurrentUser = () => {
  const info = getCurrentUser.useQuery()
  return useMemo(() => ({
    ...info,
    user: info?.data?.currentUser
  }), [ info ])
}

export const useAllUsers = () => {
  const info = listUsers.useQuery()
  return useMemo(() => ({
    ...info,
    users: info?.data?.allUsers?.results.filter(r => r !== null) ?? [],
    groups: info?.data?.allUserGroups?.results.filter(r => r !== null) ?? [],
  }), [ info ])
}

export const useUpdateCurrentUserEmail = () => {
  const [ updateEmail, info ] = updateCurrentUserEmail.useMutation();

  return {
    updateEmail,
    ...useMemo(() => {
      const formErrors = info.data?.currentUserUpdate?.errors ?? []
      return {
        ...info,
        isSuccess: info.isSuccess && formErrors.length === 0,
        formErrors
      }
    }, [ info ])
  }
}

export const useUpdateCurrentUserPassword = () => {
  const [ updatePassword, info ] = updateCurrentUserPassword.useMutation();

  return {
    updatePassword,
    ...useMemo(() => {
      const formErrors = info.data?.userUpdatePassword?.errors ?? []
      return {
        ...info,
        isSuccess: info.isSuccess && formErrors.length === 0,
        formErrors
      }
    }, [ info ])
  }
}