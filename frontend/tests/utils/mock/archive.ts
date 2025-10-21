import { type ArchiveNode } from '../../../src/api/types.gql-generated';

export type Archive = Omit<ArchiveNode, 'byUser' | 'annotationCampaign'>
export const archive: Archive = {
  id: '1',
  date: new Date().toISOString(),
}
