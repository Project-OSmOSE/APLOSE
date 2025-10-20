import { DetectorGqlAPI } from './api'
import { useMemo } from 'react';

const {
  listDetectors,
} = DetectorGqlAPI.endpoints

export const useAllDetectors = (options?: { skip?: boolean }) => {
  const info = listDetectors.useQuery(undefined, options)
  return useMemo(() => ({
    ...info,
    allDetectors: info.data?.allDetectors?.results.filter(d => d !== null).map(d => d!),
  }), [ info ])
}
