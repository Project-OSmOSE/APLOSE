import { useAppSearchParams } from "@/service/ui/search.ts";
import { useCallback, useMemo } from "react";
import {
  AnnotationCampaignSlice,
  selectCampaignSpectrogramFilters,
  SpectrogramsFilter
} from "@/features/annotation/annotationCampaign";

export const useSpectrogramFilters = () => {
  const { params, updateParams: _updateParams } = useAppSearchParams<SpectrogramsFilter>(
    selectCampaignSpectrogramFilters,
    AnnotationCampaignSlice.actions.updateSpectrogramFilters
  )

  const hasFilters = useMemo(() => Object.values(params).filter(v => !!v).length > 0, [ params ])

  const updateParams = useCallback((params: Omit<SpectrogramsFilter, 'page'>) => {
    _updateParams({ ...params, page: 1 })
  }, [])

  const resetParams = useCallback(() => updateParams({}), [ updateParams ])

  return { params, updateParams, resetParams, hasFilters }
}
