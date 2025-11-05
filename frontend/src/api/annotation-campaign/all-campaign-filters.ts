import { createSlice } from '@reduxjs/toolkit';
import { type ListCampaignsQueryVariables } from './annotation-campaign.generated'
import { logoutFulfilled } from '@/api';

export type AllCampaignFilters = ListCampaignsQueryVariables

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
  selectors: {
    selectFilters: state => state,
  },
})
