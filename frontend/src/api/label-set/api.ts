import { api } from './label-set.generated'

export const LabelSetGqlAPI = api.enhanceEndpoints({
  endpoints: {
    listLabelSets: {
      providesTags: [ 'LabelSet' ],
    },
    getCampaignLabels: {
      // @ts-expect-error: result and error are unused
      providesTags: (result, error, { campaignID }) => [ {
        type: 'CampaignLabels',
        id: campaignID,
      } ],
    },
    updateCampaignFeaturedLabels: {
      // @ts-expect-error: result and error are unused
      invalidatesTags: (result, error, { campaignID }) => [ {
        type: 'CampaignLabels',
        id: campaignID,
      } ],
    },
  },
})
