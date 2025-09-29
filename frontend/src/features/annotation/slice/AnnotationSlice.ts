import { createSlice } from "@reduxjs/toolkit";
import { AuthAPI } from "@/service/api/auth.ts";
import { ListCampaignsAndPhasesQueryVariables } from "../api/annotation.generated.ts";

export type AnnotationDisplayState = {
  campaignFilters: ListCampaignsAndPhasesQueryVariables
}

function reset(state: AnnotationDisplayState) {
  state.campaignFilters = {}
}

export const AnnotationDisplaySlice = createSlice({
  name: 'AnnotationDisplaySlice',
  initialState: {
    campaignFilters: {},
  } satisfies AnnotationDisplayState as AnnotationDisplayState,
  reducers: {
    updateCampaignFilters: (state: AnnotationDisplayState, { payload }: {
      payload: ListCampaignsAndPhasesQueryVariables
    }) => {
      state.campaignFilters = payload;
    },
    reset
  },
  extraReducers: builder => {
    builder.addMatcher(AuthAPI.endpoints.logout.matchFulfilled, reset)
  }
})