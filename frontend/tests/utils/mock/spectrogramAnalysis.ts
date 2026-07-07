import type {
    AllSpectrogramAnalysisForDatasetQuery,
    AllSpectrogramAnalysisQuery,
} from '../../../src/features/SpectrogramAnalysis';
import type { GqlQuery } from './_types';
import { fft, spectrogramAnalysis } from './types';
import type { Colormap } from '../../../src/features/Colormap';


export const ANALYSIS_QUERIES: {
    allSpectrogramAnalysis: GqlQuery<AllSpectrogramAnalysisQuery>,
    allSpectrogramAnalysisForDataset: GqlQuery<AllSpectrogramAnalysisForDatasetQuery>,
} = {
    allSpectrogramAnalysis: {
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
    allSpectrogramAnalysisForDataset: {
        defaultType: 'filled',
        empty: {
            allSpectrogramAnalysis: null,
        },
        filled: {
            allSpectrogramAnalysis: {
                results: [ {
                    id: spectrogramAnalysis.id,
                    name: spectrogramAnalysis.name,
                    colormap: {
                        name: 'Greys' as Colormap
                    }
                } ],
            },
        },
    },
}
