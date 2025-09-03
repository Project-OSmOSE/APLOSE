import { useCallback, useEffect, useRef } from "react";
import { useAlert } from "@/service/ui";
import { useAnnotatorUI } from "./ui.hook";
import { useSpectrogramFilters } from "@/service/slices/filter.ts";
import { useRetrieveCurrentCampaign } from "@/service/api/campaign.ts";
import { useRetrieveCurrentPhase } from "@/service/api/campaign-phase.ts";
import { useNavigate } from "react-router-dom";

export const useAnnotatorNavigation = () => {
  const { campaignID } = useRetrieveCurrentCampaign()
  const { phaseType } = useRetrieveCurrentPhase()
  const { params } = useSpectrogramFilters()
  const { hasChanged: _hasChanged } = useAnnotatorUI();
  const hasChanged = useRef<boolean>(_hasChanged);
  useEffect(() => {
    hasChanged.current = _hasChanged
  }, [ _hasChanged ]);
  const alert = useAlert();
  const navigate = useNavigate()

  const canNavigate = useCallback(async (): Promise<boolean> => {
    if (hasChanged.current) return true;
    return new Promise<boolean>((resolve) => {
      alert.showAlert({
        type: 'Warning',
        message: `You have unsaved changes. Are you sure you want to forget all of them?`,
        actions: [ {
          label: 'Forget my changes',
          callback: () => resolve(true)
        } ],
        onCancel: () => resolve(false)
      })
    })
  }, [ hasChanged.current ])

  const openAnnotator = useCallback((spectrogramID: string | number) => {
    const encodedParams = encodeURI(Object.entries(params).map(([ k, v ]) => `${ k }=${ v }`).join('&'));
    navigate(`/annotation-campaign/${ campaignID }/phase/${ phaseType }/spectrogram/${ spectrogramID }?${ encodedParams }`);
  }, [ campaignID, phaseType, params ])

  return { canNavigate, openAnnotator }
}