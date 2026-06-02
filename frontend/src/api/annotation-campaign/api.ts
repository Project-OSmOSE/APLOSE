import { api } from './annotation-campaign.generated'

export const AnnotationCampaignGqlAPI = api.enhanceEndpoints({
  endpoints: {
    getCampaign: {
      // @ts-expect-error: result and error are unused
      providesTags: (result, error, { id }) => [ { type: 'Campaign', id } ],
    },
    createCampaign: {
      invalidatesTags: [ 'Campaign' ],
    },
    archiveCampaign: {
      invalidatesTags: (_result, _error, { id }) => [ 'Campaign', { type: 'Campaign', id } ],
    },
    updateCampaignFeaturedLabels: {
      invalidatesTags: (_result, _error, { id }) => [ 'Campaign', { type: 'Campaign', id } ],
    },
  },
})