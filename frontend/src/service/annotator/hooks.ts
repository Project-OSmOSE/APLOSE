import { useRetrieveCurrentCampaign } from "@/service/api/campaign.ts";
import { useRetrieveCurrentPhase } from "@/service/api/campaign-phase.ts";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { useSpectrogramFilters } from "@/service/slices/filter.ts";

export const useOpenAnnotator = () => {
  const { campaignID } = useRetrieveCurrentCampaign()
  const { phaseType } = useRetrieveCurrentPhase()
  const { params } = useSpectrogramFilters()
  const navigate = useNavigate()

  return useCallback((spectrogramID: string | number) => {
    const encodedParams = encodeURI(Object.entries(params).map(([ k, v ]) => `${ k }=${ v }`).join('&'));
    navigate(`/annotation-campaign/${ campaignID }/phase/${ phaseType }/spectrogram/${ spectrogramID }?${ encodedParams }`);
  }, [ campaignID, phaseType ])
}