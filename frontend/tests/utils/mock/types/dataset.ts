import type { DatasetNode } from '../../../../src/api/types.gql-generated';

export type Dataset =
  Omit<DatasetNode, 'owner' | 'annotationCampaigns' | 'spectrogramAnalysis' | 'relatedChannelConfigurations'>

export const dataset: Dataset = {
  id: '1',
  name: 'Test dataset',
  path: 'test/dataset',
  description: 'Coastal audio recordings',
  createdAt: new Date().toISOString(),
  legacy: true,
  analysisCount: 1,
  start: '2021-08-02T00:00:00Z',
  end: '2022-07-13T06:00:00Z',
  spectrogramCount: 99,
}
