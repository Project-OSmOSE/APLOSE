import { createSelector, createSlice } from "@reduxjs/toolkit";
import { CampaignFilter } from "@/service/api/campaign.ts";
import { useAppSearchParams } from "@/service/ui/search.ts";
import { useCallback, useEffect } from "react";
import { AppState } from "@/service/app.ts";
import { UserAPI } from "@/service/api/user.ts";
import { AuthAPI } from "@/service/api/auth.ts";
import { SpectrogramFilter as _SpectrogramFilter } from "@/service/api/annotation-file-range.ts";

type SpectrogramFilter = _SpectrogramFilter

type FilterState = {
  campaign: CampaignFilter;
  spectrogram: SpectrogramFilter;
}

function reset(state: FilterState) {
  state.campaign = {}
  state.spectrogram = {}
}

export const FilterSlice = createSlice({
  name: 'FilterSlice',
  initialState: {
    campaign: {},
    spectrogram: {},
  } satisfies FilterState as FilterState,
  reducers: {
    updateCampaignFilters: (state: FilterState, { payload }: { payload: CampaignFilter }) => {
      state.campaign = payload;
    },
    updateSpectrogramFilters: (state: FilterState, { payload }: { payload: SpectrogramFilter }) => {
      state.spectrogram = payload;
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

export const useCampaignFilters = () => {
  const { params, updateParams, clearParams } = useAppSearchParams<CampaignFilter>(
    selectCampaignFilters,
    FilterSlice.actions.updateCampaignFilters,
  )
  const { data: user } = UserAPI.endpoints.getCurrentUser.useQuery()

  useEffect(() => {
    init()
  }, [ user ]);

  useEffect(() => {
    init()
  }, []);

  const init = useCallback(() => {
    if (!user) return;
    const updatedFilters = {
      phases__annotation_file_ranges__annotator_id: user.id,
      archive__isnull: true,
      ...params
    }
    if (updatedFilters.phases__annotation_file_ranges__annotator_id !== user.id) {
      updatedFilters.phases__annotation_file_ranges__annotator_id = user.id
    }
    if (updatedFilters.owner && updatedFilters.owner !== user.id) {
      updatedFilters.owner = user.id
    }
    updateParams(updatedFilters)
  }, [ params, user, updateParams ])

  return { params, updateParams, clearParams }
}

export const selectSpectrogramFilters = createSelector(
  (state: AppState) => state.filter,
  (state: FilterState) => state.spectrogram,
)

export const useSpectrogramFilters = (clearOnLoad: boolean = false) => {
  const { params, updateParams, clearParams } = useAppSearchParams<SpectrogramFilter>(
    selectSpectrogramFilters,
    FilterSlice.actions.updateSpectrogramFilters
  )

  useEffect(() => {
    if (!clearOnLoad) return;
    updateParams(params)
  }, []);

  return { params, updateParams, clearParams }
}
