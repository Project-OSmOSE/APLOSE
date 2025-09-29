import { useAppSearchParams } from "@/service/ui";
import { useCallback, useEffect } from "react";
import { AnnotationDisplaySlice, selectCampaignFilters } from "../slice";
import { ListCampaignsAndPhasesQueryVariables } from "../api/annotation.generated.ts";
import { useCurrentUser } from "@/features/auth/api";

export const useCampaignFilters = () => {
  const { user } = useCurrentUser();
  const { params, updateParams, clearParams } = useAppSearchParams<ListCampaignsAndPhasesQueryVariables>(
    selectCampaignFilters,
    AnnotationDisplaySlice.actions.updateCampaignFilters,
  )

  useEffect(() => {
    init()
  }, [ user ]);

  useEffect(() => {
    init()
  }, []);

  const init = useCallback(() => {
    if (!user) return;
    const updatedFilters: ListCampaignsAndPhasesQueryVariables = {
      annotatorPk: user.pk,
      isArchived: false,
      ...params
    }
    if (updatedFilters.annotatorPk !== user.pk) {
      updatedFilters.annotatorPk = user.pk
    }
    if (updatedFilters.ownerPk && updatedFilters.ownerPk !== user.pk) {
      updatedFilters.ownerPk = user.pk
    }
    updateParams(updatedFilters)
  }, [ params, user, updateParams ])

  return { params, updateParams, clearParams }
}