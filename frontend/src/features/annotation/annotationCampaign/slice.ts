import { createSelector, createSlice } from "@reduxjs/toolkit";
import { AuthAPI } from "@/service/api/auth.ts";
import { AppState } from "@/service/app.ts";
import { GetAnnotationCampaignsFilter } from "./api";
import { GetSpectrogramsFromDatesQueryVariables } from "@/features/gql/api/data/spectrogram.generated.ts";
import { MakeOptional } from "@/features/gql/types.generated.ts";

export type SpectrogramsFilter = MakeOptional<Omit<
  GetSpectrogramsFromDatesQueryVariables,
  'phase' | 'campaignID' | 'annotatorID' | 'offset'
>, 'fromDatetime' | 'toDatetime'>

type AnnotationCampaignState = {
  campaignFilter: GetAnnotationCampaignsFilter;
  spectrogramFilter: SpectrogramsFilter;
}

function reset(state: AnnotationCampaignState) {
  state.campaignFilter = {}
  state.spectrogramFilter = {}
}

export const AnnotationCampaignSlice = createSlice({
  name: 'AnnotationCampaignSlice',
  initialState: {
    campaignFilter: {},
    spectrogramFilter: {},
  } satisfies AnnotationCampaignState as AnnotationCampaignState,
  reducers: {
    updateCampaignFilters: (state: AnnotationCampaignState, { payload }: { payload: GetAnnotationCampaignsFilter }) => {
      state.campaignFilter = payload;
    },
    updateSpectrogramFilters: (state: AnnotationCampaignState, { payload }: { payload: SpectrogramsFilter }) => {
      state.spectrogramFilter = payload;
    },
    reset
  },
  extraReducers: builder => {
    builder.addMatcher(AuthAPI.endpoints.logout.matchFulfilled, reset)
  }
})

export const selectCampaignFilters = createSelector(
  (state: AppState) => state[AnnotationCampaignSlice.reducerPath],
  (state: AnnotationCampaignState) => state.campaignFilter,
)

export const selectCampaignSpectrogramFilters = createSelector(
  (state: AppState) => state[AnnotationCampaignSlice.reducerPath],
  (state: AnnotationCampaignState) => state.spectrogramFilter,
)
