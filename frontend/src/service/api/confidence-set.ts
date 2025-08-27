import { API } from "@/service/api/index.ts";
import { ID } from "@/service/type.ts";
import { useMemo } from "react";
import { useRetrieveCurrentCampaign } from "@/service/api/campaign.ts";
import { skipToken } from "@reduxjs/toolkit/query";
import { ConfidenceIndicatorSet } from "@/service/types";


export const ConfidenceSetAPI = API.injectEndpoints({
  endpoints: (builder) => ({
    listConfidenceSet: builder.query<Array<ConfidenceIndicatorSet>, void>({
      query: () => 'confidence-set/'
    }),
    retrieveConfidenceSet: builder.query<ConfidenceIndicatorSet, ID>({
      query: (id) => `confidence-set/${ id }/`
    }),
  })
})

export const useGetConfidenceSetForCurrentCampaign = () => {
  const { campaign } = useRetrieveCurrentCampaign()
  const {
    data,
    ...info
  } = ConfidenceSetAPI.endpoints.retrieveConfidenceSet.useQuery(campaign?.confidence_set ?? skipToken)
  return useMemo(() => ({ confidenceSet: campaign?.confidence_set ? data : undefined, ...info, }), [ data, info, campaign ])
}
