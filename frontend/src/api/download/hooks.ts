import { DownloadRestAPI } from '@/api/download/api';
import { useCallback } from 'react';
import { useLoaderData } from '@tanstack/react-router';

const {
  downloadAnalysis,
  downloadAnnotations,
  downloadProgress,
} = DownloadRestAPI.endpoints


export const useDownloadAnalysis = downloadAnalysis.useMutation

export const useDownloadAnnotations = () => {
  const { campaign } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })
  const { phase } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID/_detailLayout/phase/$phaseType' })
  const [ method, info ] = downloadAnnotations.useMutation()

  return {
    downloadAnnotations: useCallback(() => {
      return method({
        phaseID: phase.id,
        campaignName: campaign.name,
      }).unwrap()
    }, [ method, campaign, phase ]),
    ...info,
  }
}

export const useDownloadProgress = () => {
  const { campaign } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })
  const { phase } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID/_detailLayout/phase/$phaseType' })
  const [ method, info ] = downloadProgress.useMutation()

  return {
    downloadProgress: useCallback(() => {
      return method({
        phaseID: phase.id,
        campaignName: campaign.name,
      }).unwrap()
    }, [ method, campaign, phase ]),
    ...info,
  }
}