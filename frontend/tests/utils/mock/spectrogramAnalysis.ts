import type {
  ListAvailableSpectrogramAnalysisForImportQuery,
  ListSpectrogramAnalysisQuery,
} from '../../../src/api/spectrogram-analysis';
import type { SpectrogramAnalysisNode } from '../../../src/api/types.gql-generated';
import type { GqlQuery } from './_types';
import { fft } from './fft';
import { dataset } from './dataset';

export type SpectrogramAnalysis = Omit<SpectrogramAnalysisNode,
  'dataset'
  | 'spectrograms'
  | 'fft'
  | 'colormap'
  | 'legacyConfiguration'
  | 'annotationCampaigns'
  | 'owner'
  | 'annotations'>
export const spectrogramAnalysis: SpectrogramAnalysis = {
  id: '1',
  createdAt: new Date().toISOString(),
  legacy: true,
  name: '2048_2048_50',
  description: '',
  startDate: '2021-08-02T00:00:00Z',
  endDate: '2022-07-13T06:00:00Z',
  dataDuration: 10,
  dynamicMin: 30,
  dynamicMax: 60,
  path: 'analysis',
  filesCount: 99,
}

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
          start: spectrogramAnalysis.start,
          end: spectrogramAnalysis.end,
          description: spectrogramAnalysis.description,
          dataDuration: spectrogramAnalysis.dataDuration,
          filesCount: spectrogramAnalysis.filesCount,
          fft: {
            nfft: fft.nfft,
            overlap: fft.overlap,
            windowSize: fft.windowSize,
            samplingFrequency: fft.samplingFrequency,
          },
        } ],
      },
    },
  },
  listAvailableSpectrogramAnalysisForImport: {
    defaultType: 'filled',
    empty: {
      allSpectrogramAnalysisForImport: null,
      datasetById: null,
    },
    filled: {
      allSpectrogramAnalysisForImport: [
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

export type AnalysisMutations = 'importSpectrogramAnalysis'
