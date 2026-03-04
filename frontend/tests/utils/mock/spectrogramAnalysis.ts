import type { ListSpectrogramAnalysisQuery } from '../../../src/api/spectrogram-analysis';
import type { GqlQuery } from './_types';
import { fft, spectrogramAnalysis } from './types';


export const ANALYSIS_QUERIES: {
    listSpectrogramAnalysis: GqlQuery<ListSpectrogramAnalysisQuery>,
} = {
    listSpectrogramAnalysis: {
        defaultType: 'filled',
        empty: {
            allSpectrogramAnalysis: null,
        },
        filled: {
            allSpectrogramAnalysis: {
                results: [ {
                    id: spectrogramAnalysis.id,
                    name: spectrogramAnalysis.name,
                    legacy: spectrogramAnalysis.legacy,
                    createdAt: spectrogramAnalysis.createdAt,
                    description: spectrogramAnalysis.description,
                    dataDuration: spectrogramAnalysis.dataDuration,
                    fft: {
                        nfft: fft.nfft,
                        overlap: fft.overlap,
                        windowSize: fft.windowSize,
                        samplingFrequency: fft.samplingFrequency,
                    },
                    spectrograms: {
                        totalCount: 99,
                    },
                } ],
            },
        },
    },
}
