import { DownloadRestAPI } from '@/api/download/api';
import { useCallback } from 'react';
import { useCurrentCampaign, useCurrentPhase } from '@/api';

const {
  downloadAnalysis,
  downloadAnnotations,
  downloadProgress,
} = DownloadRestAPI.endpoints


export const useDownloadAnalysis = downloadAnalysis.useMutation

export const useDownloadAnnotations = () => {
  const { campaign } = useCurrentCampaign();
  const { phase } = useCurrentPhase();
  const [ method, info ] = downloadAnnotations.useMutation()

  return {
    downloadAnnotations: useCallback(() => {
      if (!campaign || !phase) return;
      return method({
        phaseID: phase.id,
        campaignName: campaign.name,
      }).unwrap()
    }, [ method, campaign, phase ]),
    ...info,
  }
}

export const useDownloadProgress = () => {
  const { campaign } = useCurrentCampaign();
  const { phase } = useCurrentPhase();
  const [ method, info ] = downloadProgress.useMutation()

  return {
    downloadProgress: useCallback(() => {
      if (!campaign || !phase) return;
      return method({
        phaseID: phase.id,
        campaignName: campaign.name,
      }).unwrap()
    }, [ method, campaign, phase ]),
    ...info,
  }
}