import {
  api,
  GetAnnotationCampaignByIdDetailedQuery,
  GetAnnotationCampaignByIdGlobalQuery,
  GetAnnotationCampaignsQuery,
  GetAnnotationCampaignsQueryVariables,
} from "./api.generated.ts";
import { DefinitionsFromApi, OverrideResultType } from "@reduxjs/toolkit/query";

type N<T> = NonNullable<T>

const Tags = [ 'AnnotationCampaign', 'AnnotationCampaignGlobal', 'AnnotationCampaignDetailed' ]
type TagType = typeof Tags[number]

type AnnotationCampaign = N<N<N<GetAnnotationCampaignsQuery['allAnnotationCampaigns']>['results']>[number]>
type GetAnnotationCampaignsFilter = {
  annotatorID?: N<GetAnnotationCampaignsQueryVariables['annotatorID']>;
  ownerID?: N<GetAnnotationCampaignsQueryVariables['ownerID']>;
  isArchived?: N<GetAnnotationCampaignsQueryVariables['isArchived']>;
  phase?: N<GetAnnotationCampaignsQueryVariables['phase']>;
  search?: N<GetAnnotationCampaignsQueryVariables['search']>;
}

type AnnotationCampaignGlobal = N<GetAnnotationCampaignByIdGlobalQuery['annotationCampaignById']>
type AnnotationCampaignDetailed = N<GetAnnotationCampaignByIdDetailedQuery['annotationCampaignById']>


enum AnnotationCampaignState {
  open = "Open",
  finished = "Finished",
  archived = "Archived",
  dueDate = "Due date",
}

type apiDefinitions = DefinitionsFromApi<typeof api>;
type apiType =
  Omit<apiDefinitions, 'getAnnotationCampaigns' | 'getAnnotationCampaignByIDGlobal' | 'getAnnotationCampaignByIDDetailed'>
  & {
  getAnnotationCampaigns: OverrideResultType<apiDefinitions['getAnnotationCampaigns'], AnnotationCampaign[]>,
  getAnnotationCampaignByIDGlobal: OverrideResultType<apiDefinitions['getAnnotationCampaignByIDGlobal'], AnnotationCampaignGlobal | undefined>,
  getAnnotationCampaignByIDDetailed: OverrideResultType<apiDefinitions['getAnnotationCampaignByIDDetailed'], AnnotationCampaignDetailed | undefined>,
}

const enhancedAPI = api.enhanceEndpoints<TagType, apiType>({
  addTagTypes: Tags,
  endpoints: {
    getAnnotationCampaigns: {
      transformResponse(response: GetAnnotationCampaignsQuery) {
        return (response?.allAnnotationCampaigns?.results?.filter(r => r !== null) ?? [])
      },
      providesTags: [ 'AnnotationCampaign' ],
    },
    getAnnotationCampaignByIDGlobal: {
      transformResponse: (response: GetAnnotationCampaignByIdGlobalQuery) => response.annotationCampaignById ?? undefined,
      // @ts-expect-error: result and error are unused
      providesTags: (result, error, { id }) => [ { type: 'AnnotationCampaignGlobal', id } ]
    },
    getAnnotationCampaignByIDDetailed: {
      transformResponse: (response: GetAnnotationCampaignByIdDetailedQuery) => response.annotationCampaignById ?? undefined,
      // @ts-expect-error: result and error are unused
      providesTags: (result, error, { id }) => [ { type: 'AnnotationCampaignDetailed', id } ]
    },
  }
})

export {
  enhancedAPI as AnnotationCampaignAPI,
  type AnnotationCampaign,
  type GetAnnotationCampaignsFilter,
  type AnnotationCampaignGlobal,
  type AnnotationCampaignDetailed,
  AnnotationCampaignState,
}