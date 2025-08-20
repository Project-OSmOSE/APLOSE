import { createSelector, createSlice } from "@reduxjs/toolkit";
import { AuthAPI } from "@/service/api/auth.ts";
import { AppState } from "@/service/app.ts";
import { GetAnnotationCampaignsFilter } from "./api";

type FilterState = {
  campaign: GetAnnotationCampaignsFilter;
}

function reset(state: FilterState) {
  state.campaign = {}
}

export const AnnotationCampaignSlice = createSlice({
  name: 'AnnotationCampaignSlice',
  initialState: {
    campaign: {},
  } satisfies FilterState as FilterState,
  reducers: {
    updateCampaignFilters: (state: FilterState, { payload }: { payload: GetAnnotationCampaignsFilter }) => {
      state.campaign = payload;
    },
    reset
  },
  extraReducers: builder => {
    builder.addMatcher(AuthAPI.endpoints.logout.matchFulfilled, reset)
  }
})

export const selectCampaignFilters = createSelector(
  (state: AppState) => state.filter,
  (state: FilterState) => state.campaign,
)
