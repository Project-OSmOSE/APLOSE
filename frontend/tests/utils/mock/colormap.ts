import type { ColormapNode } from '../../../src/api/types.gql-generated';

export type Colormap = Omit<ColormapNode, 'spectrogramAnalysis'>
export const colormap: Colormap = {
  id: '1',
  name: 'viridis',
}
