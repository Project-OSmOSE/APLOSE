import { AuthRestAPI } from './api';

const {
  login,
  logout,
} = AuthRestAPI.endpoints

export const useLogin = login.useMutation
export const useLogout = logout.useMutation
