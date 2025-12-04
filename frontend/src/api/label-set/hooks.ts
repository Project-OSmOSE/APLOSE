import { useMemo } from 'react';
import { LabelSetGqlAPI } from './api'

const {
  listLabelSets,
} = LabelSetGqlAPI.endpoints

export const useAllLabelSets = () => {
  const info = listLabelSets.useQuery()
  return useMemo(() => ({
    ...info,
    allLabelSets: info.data?.allLabelSets?.results.map(r => r!),
  }), [ info ])
}
