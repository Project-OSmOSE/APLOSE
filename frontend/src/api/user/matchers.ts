import { UserGqlAPI } from './api';

const {
  getCurrentUser,
} = UserGqlAPI.endpoints

export const getCurrentUserFulfilled = getCurrentUser.matchFulfilled