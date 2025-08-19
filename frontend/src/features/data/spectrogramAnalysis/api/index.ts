import {
  api,
  GetAvailableSpectrogramAnalysisForImportQuery,
  GetAvailableSpectrogramAnalysisForImportQueryVariables,
  GetSpectrogramAnalysisQuery,
  GetSpectrogramAnalysisQueryVariables
} from "./api.generated.ts";
import { DefinitionsFromApi, OverrideResultType } from "@reduxjs/toolkit/query";

type N<T> = NonNullable<T>

const Tags = [ 'SpectrogramAnalysis', 'ImportSpectrogramAnalysis' ]
type TagType = typeof Tags[number]

type SpectrogramAnalysis = N<N<N<GetSpectrogramAnalysisQuery['allSpectrogramAnalysis']>['results']>[number]>

type ImportSpectrogramAnalysis = N<N<GetAvailableSpectrogramAnalysisForImportQuery['allSpectrogramAnalysisForImport']>[number]>

type apiDefinitions = DefinitionsFromApi<typeof api>;
type apiType = Omit<apiDefinitions, 'getAvailableSpectrogramAnalysisForImport'> & {
  getSpectrogramAnalysis: OverrideResultType<apiDefinitions['getSpectrogramAnalysis'], SpectrogramAnalysis[]>,
  getAvailableSpectrogramAnalysisForImport: OverrideResultType<apiDefinitions['getAvailableSpectrogramAnalysisForImport'], ImportSpectrogramAnalysis[]>,
}

const enhancedAPI = api.enhanceEndpoints<TagType, apiType>({
  addTagTypes: Tags,
  endpoints: {
    getSpectrogramAnalysis: {
      transformResponse(response: GetSpectrogramAnalysisQuery) {
        return (response?.allSpectrogramAnalysis?.results?.filter(r => r !== null) ?? [])
      },
      // @ts-expect-error: result and error are unused
      providesTags: (result, error, { datasetID, annotationCampaignID }: GetSpectrogramAnalysisQueryVariables) => [
        { type: 'SpectrogramAnalysis', id: `d${ datasetID }-ac${ annotationCampaignID }` }
      ]
    },
    getAvailableSpectrogramAnalysisForImport: {
      transformResponse(response: GetAvailableSpectrogramAnalysisForImportQuery) {
        return response?.allSpectrogramAnalysisForImport?.filter(r => r !== null) ?? [];
      },
      // @ts-expect-error: result and error are unused
      providesTags: (result, error, { datasetID }: GetAvailableSpectrogramAnalysisForImportQueryVariables) => [
        { type: 'ImportSpectrogramAnalysis', id: `d${ datasetID }` }
      ]
    },
    postAnalysisForImport: {
      invalidatesTags: (_, error) => error ? [] : [ 'Dataset', 'SpectrogramAnalysis' ]
    },
  }
})

export {
  enhancedAPI as SpectrogramAnalysisAPI,
  type SpectrogramAnalysis,
  type ImportSpectrogramAnalysis
}