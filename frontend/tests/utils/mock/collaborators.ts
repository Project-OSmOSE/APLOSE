import type { RestQuery } from './_types';

export const COLLABORATOR_QUERIES: {
  listCollaborators: RestQuery<[]>
} = {
  listCollaborators: {
    url: '/api/collaborators/on_aplose_home',
    success: {
      status: 200,
      json: [],
    },
  },
}
