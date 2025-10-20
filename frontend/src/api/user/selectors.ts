import { createSelector } from '@reduxjs/toolkit';
import { AppState } from '@/features/App';
import { UserGqlAPI } from './api';


const {
  getCurrentUser,
} = UserGqlAPI.endpoints

const createGetCurrentUserSelector = createSelector(
  () => undefined,
  () => getCurrentUser.select(),
)
export const selectCurrentUser = createSelector(
  (state: AppState) => state,
  () => createGetCurrentUserSelector(undefined),
  (state, selectCurrentUser) => selectCurrentUser(state).data?.currentUser,
)
