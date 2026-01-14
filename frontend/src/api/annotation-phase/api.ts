import { api } from './annotation-phase.generated'

export const AnnotationPhaseGqlAPI = api.enhanceEndpoints({
  endpoints: {
    getAnnotationPhase: {
      providesTags: result => [
        { type: 'AnnotationPhase', id: result?.annotationPhaseByCampaignPhase?.id }
      ]
    },
    endPhase: {
      // @ts-expect-error: result and error are unused
      invalidatesTags: (result, error, { campaignID }) => [ {
        type: 'Campaign',
        id: campaignID
      } ]
    },
    createAnnotationPhase: {
      // @ts-expect-error: result and error are unused
      invalidatesTags: (result, error, { campaignID }) => [ {
        type: 'Campaign',
        id: campaignID
      }, 'Campaign' ]
    },
    createVerificationPhase: {
      // @ts-expect-error: result and error are unused
      invalidatesTags: (result, error, { campaignID }) => [ {
        type: 'Campaign',
        id: campaignID
      }, 'Campaign' ]
    },
  }
})