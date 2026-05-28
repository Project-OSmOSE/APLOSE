import type { LegacySpectrogramConfigurationNode } from '../../../../src/api/types.gql-generated';

export type LegacyConfiguration = Omit<LegacySpectrogramConfigurationNode, 'audioFilesSubtypes' | 'spectrogramAnalysis'>
export const legacyConfiguration: LegacyConfiguration = {
  id: '1',
  channelCount: 1,
  dataNormalization: 'instrument',
  spectrogramNormalization: 'density',
  fileOverlap: 0.50,
  folder: '',
  gainDb: 0,
  frequencyResolution: 250,
  hpFilterMinFrequency: 1000,
  zscoreDuration: 'original',
  windowType: null,
  zoomLevel: 2,
}
