import { api } from './annotation-campaign.generated'

export const AnnotationCampaignGqlAPI = api.enhanceEndpoints({
  endpoints: {
    updateCampaignFeaturedLabels: {
      invalidatesTags: (_result, _error, { id }) => [ 'Campaign', { type: 'Campaign', id } ],
    },
  },
})