import { createSelector } from '@reduxjs/toolkit';
import { UserGqlAPI } from './api';

export const selectCurrentUser = createSelector(
  UserGqlAPI.endpoints.getCurrentUser.select(),
  (userQuery) => userQuery.data?.currentUser,
)
