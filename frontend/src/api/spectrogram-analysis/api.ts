import { api, type ListSpectrogramAnalysisQueryVariables } from './spectrogram-analysis.generated';

export function listSpectrogramAnalysisTag(args: ListSpectrogramAnalysisQueryVariables | void) {
    return { type: 'SpectrogramAnalysis', id: `${ args?.datasetID ?? '' }-${ args?.annotationCampaignID ?? '' }` }
}

export const SpectrogramAnalysisGqlAPI = api.enhanceEndpoints({
    endpoints: {
        listSpectrogramAnalysis: {
            providesTags: (_result, _error, args) =>
                [ listSpectrogramAnalysisTag(args) ],
        },
    },
})
