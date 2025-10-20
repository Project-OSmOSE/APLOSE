import { createSelector, createSlice } from '@reduxjs/toolkit';
import { type ListCampaignsAndPhasesQueryVariables } from './annotation-campaign.generated'
import { AppState } from '@/features';
import { logoutFulfilled } from '@/api';

export type AllCampaignFilters = ListCampaignsAndPhasesQueryVariables

function reset(state: AllCampaignFilters) {
  state.annotatorID = undefined;
  state.ownerID = undefined;
  state.isArchived = undefined;
  state.phase = undefined;
  state.search = undefined;
}

export const AllAnnotationCampaignFilterSlice = createSlice({
  name: 'AllAnnotationCampaignFilterSlice',
  initialState: {} as AllCampaignFilters,
  reducers: {
    updateCampaignFilters: (state: AllCampaignFilters, { payload }: {
      payload: AllCampaignFilters
    }) => {
      Object.assign(state, payload)
    },
    reset,
  },
  extraReducers: builder => {
    builder.addMatcher(logoutFulfilled, reset)
  },
})

export const selectAllCampaignFilters = createSelector(
  (state: AppState) => state.AllAnnotationCampaignFilterSlice,
  (state: AllCampaignFilters) => state,
)