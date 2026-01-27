import { createSlice } from '@reduxjs/toolkit';
import { type ListCampaignsQueryVariables } from './annotation-campaign.generated'
import { logoutFulfilled } from '@/api';

export type AllCampaignFilters = ListCampaignsQueryVariables

function reset(state: AllCampaignFilters) {
  state.filter_annotatorID = undefined;
  state.filter_ownerID = undefined;
  state.filter_isArchived = undefined;
  state.filter_phase = undefined;
  state.search = undefined;
}

export const AllAnnotationCampaignFilterSlice = createSlice({
  name: 'AllAnnotationCampaignFilterSlice',
  initialState: {} as AllCampaignFilters,
  reducers: {
    updateCampaignFilters: (_state: AllCampaignFilters, { payload }: {
      payload: AllCampaignFilters
    }) => {
      return payload
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
