import { api } from "./spectrogram-analysis.generated";

export const SpectrogramAnalysisGqlAPI = api.enhanceEndpoints({
  endpoints: {
    listSpectrogramAnalysis: {
      // @ts-expect-error: result and error are unused
      providesTags: (result, error, args) => [
        { type: 'SpectrogramAnalysis', id: JSON.stringify(args) }
      ]
    },
    listAvailableSpectrogramAnalysisForImport: {
      // @ts-expect-error: result and error are unused
      providesTags: (result, error, args) => [
        { type: 'ImportSpectrogramAnalysis', id: JSON.stringify(args) }
      ]
    },
    importSpectrogramAnalysis: {
      invalidatesTags: (_, error) => error ? [] : [ 'Dataset', 'SpectrogramAnalysis' ]
    },
  }
})
