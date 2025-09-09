import { createSelector, createSlice } from "@reduxjs/toolkit";
import { AuthAPI } from "@/service/api/auth.ts";
import { AppState } from "@/service/app.ts";
import { GetSpectrogramsFromDatesQueryVariables } from "@/features/gql/api/data/spectrogram.generated.ts";
import { MakeOptional } from "@/features/gql/types.generated.ts";

export type SpectrogramsFilter = MakeOptional<Omit<
  GetSpectrogramsFromDatesQueryVariables,
  'phase' | 'campaignID' | 'annotatorID' | 'offset'
>, 'fromDatetime' | 'toDatetime'> & {
  page: number;
}

type AnnotationCampaignState = {
  spectrogramFilter: SpectrogramsFilter;
}

function reset(state: AnnotationCampaignState) {
  state.spectrogramFilter = { page: 1 }
}

export const AnnotationCampaignSlice = createSlice({
  name: 'AnnotationCampaignSlice',
  initialState: {
    spectrogramFilter: { page: 1 },
  } satisfies AnnotationCampaignState as AnnotationCampaignState,
  reducers: {
    updateSpectrogramFilters: (state: AnnotationCampaignState, { payload }: { payload: SpectrogramsFilter }) => {
      state.spectrogramFilter = payload;
    },
    reset
  },
  extraReducers: builder => {
    builder.addMatcher(AuthAPI.endpoints.logout.matchFulfilled, reset)
  }
})

export const selectCampaignSpectrogramFilters = createSelector(
  (state: AppState) => state[AnnotationCampaignSlice.reducerPath],
  (state: AnnotationCampaignState) => state.spectrogramFilter,
)
