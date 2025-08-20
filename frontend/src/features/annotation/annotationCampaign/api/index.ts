import { api, GetAnnotationCampaignsQuery, GetAnnotationCampaignsQueryVariables, } from "./api.generated.ts";
import { DefinitionsFromApi, OverrideResultType } from "@reduxjs/toolkit/query";

type N<T> = NonNullable<T>

const Tags = [ 'AnnotationCampaign', ]
type TagType = typeof Tags[number]

type _AnnotationCampaign = N<N<N<GetAnnotationCampaignsQuery['allAnnotationCampaigns']>['results']>[number]>
type AnnotationCampaign = Omit<_AnnotationCampaign, 'phases'> & {
  phases: N<N<N<_AnnotationCampaign['phases']>["results"]>[number]>[]
}
type GetAnnotationCampaignsFilter = {
  annotatorID?: N<GetAnnotationCampaignsQueryVariables['annotatorID']>;
  ownerID?: N<GetAnnotationCampaignsQueryVariables['ownerID']>;
  isArchived?: N<GetAnnotationCampaignsQueryVariables['isArchived']>;
  phase?: N<GetAnnotationCampaignsQueryVariables['phase']>;
  search?: N<GetAnnotationCampaignsQueryVariables['search']>;
}

type apiDefinitions = DefinitionsFromApi<typeof api>;
type apiType = Omit<apiDefinitions, 'getAnnotationCampaigns'> & {
  getAnnotationCampaigns: OverrideResultType<apiDefinitions['getAnnotationCampaigns'], AnnotationCampaign[]>,
}

const enhancedAPI = api.enhanceEndpoints<TagType, apiType>({
  addTagTypes: Tags,
  endpoints: {
    getAnnotationCampaigns: {
      transformResponse(response: GetAnnotationCampaignsQuery) {
        return (response?.allAnnotationCampaigns?.results?.filter(r => r !== null) ?? []).map(c => ({
          ...c,
          phases: c.phases?.results?.filter(r => r !== null) ?? []
        }))
      },
      providesTags: [ 'AnnotationCampaign' ],
    },
  }
})

export {
  enhancedAPI as AnnotationCampaignAPI,
  type AnnotationCampaign,
  type GetAnnotationCampaignsFilter,
}