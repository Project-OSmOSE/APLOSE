import { api } from './annotation-campaign.generated'

export const AnnotationCampaignGqlAPI = api.enhanceEndpoints({
  endpoints: {
    listCampaignsAndPhases: {
      // @ts-expect-error: result and error are unused
      providesTags: (result, error, args) => [ {
        type: 'Campaign',
        id: JSON.stringify(args)
      } ],
    },
    getCampaign: {
      // @ts-expect-error: result and error are unused
      providesTags: (result, error, { id }) => [ { type: 'Campaign', id } ]
    },
    createAnnotationCampaign: {
      invalidatesTags: [ 'Campaign', ],
    },
    archiveAnnotationCampaign: {
      // @ts-expect-error: result and error are unused
      invalidatesTags: (result, error, { id }) => [ 'Campaign', { type: 'Campaign', id } ]
    },
    updateAnnotationCampaignFeaturedLabels: {
      // @ts-expect-error: result and error are unused
      invalidatesTags: (result, error, { id }) => [ 'Campaign', { type: 'Campaign', id } ]
    }
  }
})