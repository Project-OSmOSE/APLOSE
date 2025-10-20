import type { LegacySpectrogramConfigurationNode } from '../../../src/api';

export type LegacyConfiguration = Omit<LegacySpectrogramConfigurationNode, 'audioFilesSubtypes' | 'spectrogramAnalysis'>
export const legacyConfiguration: LegacyConfiguration = {
  id: '1',
  scaleName: 'Default',
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
  linearFrequencyScale: null,
  multiLinearFrequencyScale: null,
  zoomLevel: 2,
}
