import { api } from './annotation-campaign.generated'

export const AnnotationCampaignGqlAPI = api.enhanceEndpoints({
  endpoints: {
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