import { type CollaboratorNode } from '../../../../src/api/types.gql-generated';

export type Collaborator = Pick<CollaboratorNode, 'name' | 'url' | 'thumbnail'>
export const collaborator: Collaborator = {
  name: 'Collaborator',
  thumbnail: 'https://www.collaborator.co/img.png',
  url: 'https://www.collaborator.co',
}
