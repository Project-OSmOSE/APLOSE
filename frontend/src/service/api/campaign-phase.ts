import { API } from "@/service/api/index.ts";
import { AnnotationCampaign, AnnotationPhase, Phase } from "@/service/types";
import { ID } from "@/service/type.ts";
import { downloadResponseHandler } from "@/service/function.ts";
import { useRetrieveCurrentCampaign } from "@/service/api/campaign.ts";
import { useMemo } from "react";
import { useParams } from "react-router-dom";


export const CampaignPhaseAPI = API.injectEndpoints({
  endpoints: (builder) => ({
    listCampaignPhase: builder.query<AnnotationPhase[], {
      campaigns?: AnnotationCampaign[],
    } | void>({
      query: (arg) => {
        const params: any = {}
        if (arg) {
          if (arg.campaigns) params.annotation_campaign_id__in = JSON.stringify(arg.campaigns.map(c => c.id))
        }
        return {
          url: `annotation-campaign-phase/`,
          params,
        }
      },
      providesTags: phases => (phases ?? []).map(({ id }) => ({ type: 'CampaignPhase' as const, id })),
    }),
    retrieveCampaignPhase: builder.query<AnnotationPhase, {
      campaignID: ID,
      phaseType: Phase
    }>({
      query: ({ campaignID, phaseType }) => `annotation-campaign/${ campaignID }/phase/${ phaseType }`,
      providesTags: phase => phase ? [ { type: 'CampaignPhase' as const, id: phase.id } ] : [],
    }),
    postCampaignPhase: builder.mutation<AnnotationPhase, {
      campaign: AnnotationCampaign,
      phase: Phase,
    }>({
      query: ({ campaign, phase }) => ({
        url: 'annotation-campaign-phase/',
        method: 'POST',
        body: {
          phase,
          annotation_campaign: campaign.id
        }
      }),
      invalidatesTags: phase => phase ? [
        { type: "CampaignPhase", id: phase.id },
        { type: "Campaign", id: phase.annotation_campaign },
      ] : [],
    }),
    endCampaignPhase: builder.mutation<AnnotationPhase, ID>({
      query: (phaseID) => ({
        url: `annotation-campaign-phase/${ phaseID }/end/`,
        method: 'POST',
      }),
      invalidatesTags: phase => phase ? [ { type: "CampaignPhase", id: phase.id }, 'Campaign' ] : [ 'Campaign' ],
    }),
    downloadCampaignPhaseReport: builder.mutation<void, {
      phaseID: ID;
      filename: string;
    }>({
      query: ({ phaseID, filename }) => ({
        url: `annotation-campaign-phase/${ phaseID }/report/`,
        params: { filename },
        responseHandler: downloadResponseHandler
      }),
    }),
    downloadCampaignPhaseStatus: builder.mutation<void, {
      phaseID: ID;
      filename: string;
    }>({
      query: ({ phaseID, filename }) => ({
        url: `annotation-campaign-phase/${ phaseID }/report-status/`,
        params: { filename },
        responseHandler: downloadResponseHandler
      }),
    }),
  })
})

export const useListPhasesForCurrentCampaign = () => {
  const { campaign } = useRetrieveCurrentCampaign()
  const { data, ...info } = CampaignPhaseAPI.endpoints.listCampaignPhase.useQuery({
    campaigns: [ campaign! ],
  }, { skip: !campaign })
  const annotationPhase = useMemo(() => data?.find(p => p.phase === 'Annotation'), [ data ])
  const verificationPhase = useMemo(() => data?.find(p => p.phase === 'Verification'), [ data ])
  return useMemo(() => ({
    phases: data,
    annotationPhase,
    verificationPhase, ...info,
  }), [ data, annotationPhase, verificationPhase, info ])
}

export const useRetrieveCurrentPhase = () => {
  const { campaignID, phaseType } = useParams<{ campaignID: string; phaseType?: Phase; }>();
  const { campaign } = useRetrieveCurrentCampaign()
  const { data: phase, ...info } = CampaignPhaseAPI.endpoints.retrieveCampaignPhase.useQuery({
    campaignID: campaignID ?? '', phaseType: phaseType ?? "Annotation"
  }, { skip: !campaignID || !phaseType })
  const isEditable = useMemo(() => !campaign?.archive && !phase?.ended_by, [ campaign, phase ])
  return useMemo(() => ({
    phaseType,
    phase,
    isEditable,
    ...info,
  }), [ phaseType, phase, isEditable, info ])
}
