import type { DetectorConfigurationNode, DetectorNode } from '../../../../src/api/types.gql-generated';

export type DetectorConfiguration =
  Omit<DetectorConfigurationNode, 'detector' | 'annotations'>
export type Detector =
  Omit<DetectorNode, 'specification' | 'configurations'>

export const detectorConfiguration: DetectorConfiguration = {
  id: '1',
  configuration: 'Test configuration',
}
export const detector: Detector = {
  id: '1',
  name: 'detector1',
}
