import { createSelector, createSlice } from "@reduxjs/toolkit";
import { CampaignFilter } from "@/service/api/campaign.ts";
import { useAppSearchParams } from "@/service/ui/search.ts";
import { useCallback, useEffect } from "react";
import { AppState, useAppDispatch, useAppSelector } from "@/service/app.ts";
import { UserAPI } from "@/service/api/user.ts";
import { AuthAPI } from "@/service/api/auth.ts";
import { SpectrogramFilter as _SpectrogramFilter } from "@/service/api/annotation-file-range.ts";

type SpectrogramFilter = _SpectrogramFilter & { page: number };

type FilterState = {
  campaign: CampaignFilter;
  spectrogram: SpectrogramFilter;
}

function reset(state: FilterState) {
  state.campaign = {}
  state.spectrogram = { page: 1 }
}

export const FilterSlice = createSlice({
  name: 'FilterSlice',
  initialState: {
    campaign: {},
    spectrogram: { page: 1 },
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
  const { params, updateParams, clearParams } = useAppSearchParams<CampaignFilter>()
  const { data: user } = UserAPI.endpoints.getCurrentUser.useQuery()
  const loadedFilters = useAppSelector(selectCampaignFilters)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!user) return;

    // Load default params
    const updatedFilters = {
      phases__annotation_file_ranges__annotator_id: user.id,
      archive__isnull: true,
      ...loadedFilters
    }
    if (updatedFilters.phases__annotation_file_ranges__annotator_id !== user.id) {
      updatedFilters.phases__annotation_file_ranges__annotator_id = user.id
    }
    if (updatedFilters.owner && updatedFilters.owner !== user.id) {
      updatedFilters.owner = user.id
    }
    updateParams(updatedFilters)
  }, [ user ]);

  useEffect(() => {
    dispatch(FilterSlice.actions.updateCampaignFilters(params))
  }, [ params ]);

  return { params, updateParams, clearParams }
}

export const selectSpectrogramFilters = createSelector(
  (state: AppState) => state.filter,
  (state: FilterState) => state.spectrogram,
)

export const useSpectrogramFilters = (clearOnLoad: boolean = false) => {
  const { params, updateParams: _updateParams } = useAppSearchParams<SpectrogramFilter>()
  const loadedFilters = useAppSelector(selectSpectrogramFilters)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!clearOnLoad) return;
    updateParams(loadedFilters)
  }, []);

  useEffect(() => {
    dispatch(FilterSlice.actions.updateSpectrogramFilters(params))
  }, [ params ]);

  const updateParams = useCallback((p: Omit<SpectrogramFilter, 'page'>) => {
    _updateParams({ ...p, page: 1 })
  }, [])

  const updatePage = useCallback((page: number) => {
    _updateParams({ ...params, page })
  }, [ params ])

  const clearParams = useCallback(() => {
    _updateParams({ page: 1 })
  }, [])

  return { params, updateParams, updatePage, clearParams }
}
