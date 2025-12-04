import { useMemo } from "react";
import { ConfidenceSetGqlAPI } from './api'

const {
  listConfidenceSets,
} = ConfidenceSetGqlAPI.endpoints

export const useAllConfidenceSets = () => {
  const info = listConfidenceSets.useQuery()
  return useMemo(() => ({
    ...info,
    allConfidenceSets: info.data?.allConfidenceSets?.results.filter(r => r !== null)
  }), [ info ])
}
