import type { MockType, RestQuery } from './_types';

export const COLLABORATOR_QUERIES: {
  listCollaborators: { [key in MockType]: RestQuery<[]> }
} = {
  listCollaborators: {
    empty: {
      url: '/api/collaborators/on_aplose_home',
      status: 200,
      json: [],
    },
    filled: {
      url: '/api/collaborators/on_aplose_home',
      status: 200,
      json: [],
    },
  },
}
