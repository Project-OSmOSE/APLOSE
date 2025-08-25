import { useAppSearchParams } from "@/service/ui/search.ts";
import { useCallback, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/service/app.ts";
import {
  AnnotationCampaignSlice,
  selectCampaignSpectrogramFilters,
  SpectrogramsFilter
} from "@/features/annotation/annotationCampaign";

export const useSpectrogramFilters = () => {
  const { params, updateParams } = useAppSearchParams<SpectrogramsFilter>()

  const loadedFilters = useAppSelector(selectCampaignSpectrogramFilters)
  const dispatch = useAppDispatch()

  useEffect(() => {
    updateParams(loadedFilters)
  }, []);

  useEffect(() => {
    dispatch(AnnotationCampaignSlice.actions.updateSpectrogramFilters(params))
  }, [ params ]);

  const hasFilters = useMemo(() => Object.values(params).filter(v => !!v).length > 0, [ params ])

  const resetParams = useCallback(() => updateParams({}), [ updateParams ])

  return { params, updateParams, resetParams, hasFilters }
}
