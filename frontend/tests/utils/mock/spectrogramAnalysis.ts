import type {
  ImportSpectrogramAnalysisMutation,
  ListAvailableSpectrogramAnalysisForImportQuery,
  ListSpectrogramAnalysisQuery,
} from '../../../src/api/spectrogram-analysis';
import type { GqlQuery } from './_types';
import { dataset, fft, spectrogramAnalysis } from './types';


export const ANALYSIS_QUERIES: {
  listSpectrogramAnalysis: GqlQuery<ListSpectrogramAnalysisQuery>,
  listAvailableSpectrogramAnalysisForImport: GqlQuery<ListAvailableSpectrogramAnalysisForImportQuery>,
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
            start: spectrogramAnalysis.startDate,
            end: spectrogramAnalysis.endDate,
          },
        } ],
      },
    },
  },
  listAvailableSpectrogramAnalysisForImport: {
    defaultType: 'filled',
    empty: {
      allAnalysisForImport: null,
      datasetById: null,
    },
    filled: {
      allAnalysisForImport: [
        {
          name: 'Test analysis 1',
          path: 'Test analysis 1',
        },
        {
          name: 'Test analysis 2',
          path: 'Test analysis 2',
        },
      ],
      datasetById: {
        name: dataset.name,
        path: dataset.path,
      },
    },
  },
}

export const ANALYSIS_MUTATIONS: {
  importSpectrogramAnalysis: GqlQuery<ImportSpectrogramAnalysisMutation, never>,
} = {
  importSpectrogramAnalysis: {
    defaultType: 'empty',
    empty: {},
  },
}
