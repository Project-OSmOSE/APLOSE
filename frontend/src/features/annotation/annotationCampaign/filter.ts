import { useAppSearchParams } from "@/service/ui/search.ts";
import { useCallback, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/service/app.ts";
import { UserAPI } from "@/service/api/user.ts";
import { GetAnnotationCampaignsFilter } from "./api";
import { AnnotationCampaignSlice, selectCampaignFilters } from "./slice";


export const useCampaignFilters = () => {
  const { params, updateParams } = useAppSearchParams<GetAnnotationCampaignsFilter>()
  const { data: user } = UserAPI.endpoints.getCurrentUser.useQuery()
  const loadedFilters = useAppSelector(selectCampaignFilters)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!user) return;

    // Load default params
    const updatedFilters: GetAnnotationCampaignsFilter = {
      annotatorID: user.id,
      isArchived: false,
      ...loadedFilters
    }
    if (updatedFilters.annotatorID !== user.id) {
      updatedFilters.annotatorID = user.id
    }
    if (updatedFilters.ownerID && updatedFilters.ownerID !== user.id) {
      updatedFilters.ownerID = user.id
    }
    updateParams(updatedFilters)
  }, [ user ]);

  useEffect(() => {
    dispatch(AnnotationCampaignSlice.actions.updateCampaignFilters(params))
  }, [ params ]);

  const hasFilters = useMemo(() => {
    return params.ownerID || params.annotatorID || params.phase || params.search || params.isArchived !== undefined;
  }, [ params ])

  const resetParams = useCallback(() => {
    updateParams({
      isArchived: false,
      annotatorID: user?.id,
      phase: undefined,
      ownerID: undefined,
      search: undefined,
    })
  }, [ updateParams, user ])

  return { params, updateParams, resetParams, hasFilters }
}
