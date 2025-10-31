import type { SpectrogramAnalysisNode } from '../../../../src/api/types.gql-generated';

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
}
