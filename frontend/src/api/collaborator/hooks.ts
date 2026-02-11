import { CollaboratorGqlAPI } from './api'
import { useMemo } from 'react';

//  API

const {
  homeCollaborators
} = CollaboratorGqlAPI.endpoints

export const useHomeCollaborators = () => {
  const info = homeCollaborators.useQuery()
  return useMemo(() => ({
    ...info,
    collaborators: info.data?.allCollaborators?.results.filter(r => r !== null).map(c => c!),
  }), [ info ]);
}
