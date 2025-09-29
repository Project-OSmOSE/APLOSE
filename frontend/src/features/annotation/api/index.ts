import { api } from './annotation.generated.ts'
import { useMemo } from "react";
import { usePathParams } from "../hooks";

export const AnnotationAPI = api.enhanceEndpoints({
  addTagTypes: [ 'Campaign', 'CampaignsAndPhases', 'Label', 'LabelsAndConfidenceSets' ],
  endpoints: {
    listCampaignsAndPhases: {
      // @ts-expect-error: result and error are unused
      providesTags: (result, error, args) => [ {
        type: 'CampaignsAndPhases',
        id: JSON.stringify(args)
      } ],
    },
    getCampaign: {
      // @ts-expect-error: result and error are unused
      providesTags: (result, error, { pk }) => [ {
        type: 'Campaign',
        id: pk
      } ]
    },
    endPhase: {
      // @ts-expect-error: result and error are unused
      invalidatesTags: (result, error, { campaignPK }) => [ {
        type: 'Campaign',
        id: campaignPK
      } ]
    },
    createVerificationPhase: {
      // @ts-expect-error: result and error are unused
      invalidatesTags: (result, error, { campaignPK }) => [ {
        type: 'Campaign',
        id: campaignPK
      }, 'CampaignsAndPhases' ]
    },
    createAnnotationPhase: {
      // @ts-expect-error: result and error are unused
      invalidatesTags: (result, error, { campaignPK }) => [ {
        type: 'Campaign',
        id: campaignPK
      }, 'CampaignsAndPhases' ]
    },

    getLabels: {
      // @ts-expect-error: result and error are unused
      providesTags: (result, error, args) => [ {
        type: 'Label',
        id: JSON.stringify(args)
      } ]
    },
    getLabelsAndConfidenceSets: {
      providesTags: [ 'LabelsAndConfidenceSets' ]
    },
  }
})

export const {
  useEndPhaseMutation,
  useCreateVerificationPhaseMutation,
  useCreateAnnotationPhaseMutation,
} = AnnotationAPI

export const useCurrentAnnotationCampaign = () => {
  const { campaignID: pk } = usePathParams();
  const result = AnnotationAPI.useGetCampaignQuery({ pk }, { skip: !pk })
  return useMemo(() => ({
    ...result,
    campaign: result?.data?.annotationCampaignByPk,
    phases: result?.data?.allAnnotationPhases?.results.filter(r => r !== null) ?? []
  }), [ result ])
}

export const useLabelsAndConfidenceSets = () => {
  const result = AnnotationAPI.useGetLabelsAndConfidenceSetsQuery()
  return useMemo(() => ({
    ...result,
    labelSets: result?.data?.allLabelSets?.results.filter(r => r !== null) ?? [],
    confidenceSets: result?.data?.allConfidenceSets?.results.filter(r => r !== null) ?? [],
  }), [ result ])
}
