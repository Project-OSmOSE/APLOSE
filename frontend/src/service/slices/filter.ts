import { createSelector, createSlice } from "@reduxjs/toolkit";
import { useAppSearchParams } from "@/service/ui/search.ts";
import { useCallback, useEffect } from "react";
import { AppState } from "@/service/app.ts";
import { AuthAPI } from "@/service/api/auth.ts";
import { SpectrogramFilter as _SpectrogramFilter } from "@/service/api/annotation-file-range.ts";

type SpectrogramFilter = _SpectrogramFilter & {
  page: number;
}

type FilterState = {
  spectrogram: SpectrogramFilter;
}

function reset(state: FilterState) {
  state.spectrogram = { page: 1 }
}

export const FilterSlice = createSlice({
  name: 'FilterSlice',
  initialState: {
    spectrogram: { page: 1 },
  } satisfies FilterState as FilterState,
  reducers: {
    updateSpectrogramFilters: (state: FilterState, { payload }: { payload: SpectrogramFilter }) => {
      state.spectrogram = payload;
    },
    reset
  },
  extraReducers: builder => {
    builder.addMatcher(AuthAPI.endpoints.logout.matchFulfilled, reset)
  }
})

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

  return {
    params,
    updateParams: useCallback((p: Omit<SpectrogramFilter, 'page'>) => {
      updateParams({ ...p, page: 1 })
    }, [ updateParams ]),
    clearParams: useCallback(() => {
      clearParams()
      updateParams({ page: 1 })
    }, [ clearParams ]),
  }
}
