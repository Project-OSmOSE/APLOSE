import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSpectrogramFilters } from "@/service/slices/filter.ts";
import { UserAPI } from "@/service/api/user.ts";
import { useRetrieveCurrentCampaign } from "@/service/api/campaign.ts";
import { useRetrieveCurrentPhase } from "@/service/api/campaign-phase.ts";
import { AnnotatorAPI } from "../api";
import { AnnotationPhaseType } from "@/features/gql/types.generated.ts";

export const useAnnotatorQuery = (args: { refetchOnMountOrArgChange: boolean } | void) => {
  const { params } = useSpectrogramFilters()
  const { data: user } = UserAPI.endpoints.getCurrentUser.useQuery()
  const { campaignID } = useRetrieveCurrentCampaign()
  const { phaseType, isEditable } = useRetrieveCurrentPhase()
  const { spectrogramID } = useParams<{ spectrogramID: string }>();

  const { data, ...info } = AnnotatorAPI.endpoints.getAnnotator.useQuery({
    ...params,
    campaignID: campaignID ?? '',
    phaseType: AnnotationPhaseType[phaseType ?? 'Annotation'],
    spectrogramID: spectrogramID ?? '',
    annotatorID: user?.id?.toString() ?? '',
  }, {
    skip: !campaignID || !phaseType || !spectrogramID || !user,
    refetchOnMountOrArgChange: args?.refetchOnMountOrArgChange
  });

  const canEdit = useMemo(() => isEditable && data?.annotationFileRange, [ data, isEditable ])
  return useMemo(() => ({ data, canEdit, ...info, }), [ data, canEdit, info ])
}