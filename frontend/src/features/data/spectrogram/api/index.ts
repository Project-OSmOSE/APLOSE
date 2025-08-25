import { api, GetSpectrogramsForCampaignQuery, } from "./api.generated.ts";
import { DefinitionsFromApi, OverrideResultType } from "@reduxjs/toolkit/query";

type N<T> = NonNullable<T>

const Tags = [ 'SpectrogramsForCampaign', 'SpectrogramsForCampaignComplement' ]
type TagType = typeof Tags[number]

type SpectrogramForCampaign = N<N<N<GetSpectrogramsForCampaignQuery['allSpectrograms']>['results']>[number]>

type apiDefinitions = DefinitionsFromApi<typeof api>;
type apiType =
  Omit<apiDefinitions, 'getSpectrogramsForCampaign'>
  & {
  getSpectrogramsForCampaign: OverrideResultType<apiDefinitions['getSpectrogramsForCampaign'], SpectrogramForCampaign[]>,
}

const enhancedAPI = api.enhanceEndpoints<TagType, apiType>({
  addTagTypes: Tags,
  endpoints: {
    getSpectrogramsForCampaign: {
      transformResponse(response: GetSpectrogramsForCampaignQuery) {
        return (response?.allSpectrograms?.results?.filter(r => r !== null) ?? [])
      },
      // @ts-expect-error: result and error are unused
      providesTags: (result, error, args) => [ {
        type: 'SpectrogramsForCampaign',
        id: JSON.stringify(args)
      } ]
    },
    getSpectrogramsForCampaignComplementary: {
      // @ts-expect-error: result and error are unused
      providesTags: (result, error, args) => [ {
        type: 'SpectrogramsForCampaignComplement',
        id: JSON.stringify(args)
      } ]
    }
  }
})

export {
  enhancedAPI as SpectrogramAPI,
  type SpectrogramForCampaign,
}