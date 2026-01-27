import { AuthRestAPI } from './api';
import { useCallback } from 'react';
import { gqlAPI, GqlTags } from '@/api/baseGqlApi.ts';

const {
  login,
  logout,
} = AuthRestAPI.endpoints

export const useLogin = login.useMutation

export const useLogout = () => {
  const [_method, info] = logout.useMutation()

  const method = useCallback(() => {
    gqlAPI.util.invalidateTags(GqlTags)
    return _method()
  }, [_method])

  return {
    logout: method,
    ...info
  }
}