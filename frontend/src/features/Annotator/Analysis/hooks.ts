import { useCallback, useMemo } from 'react';
import { useCurrentCampaign } from '@/api';
import { useAppDispatch, useAppSelector } from '@/features';
import { Analysis, selectID, setAnalysis } from './slice'

export const useAnnotatorAnalysis = () => {
  const { allAnalysis } = useCurrentCampaign()
  const analysisID = useAppSelector(state => selectID(state.annotator))
  const analysis = useMemo(() => allAnalysis?.find(a => a?.id === analysisID) ?? undefined, [ allAnalysis, analysisID ])
  const dispatch = useAppDispatch()

  return {
    allAnalysis,
    analysis,
    analysisID,
    setAnalysis: useCallback((value?: Analysis) => dispatch(setAnalysis(value)), []),
  }
}
