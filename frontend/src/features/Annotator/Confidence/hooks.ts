import { useAppDispatch, useAppSelector } from '@/features/App';
import { focus, selectAllConfidences, selectFocus } from './slice'
import { useCallback, useMemo } from 'react';

export const useAnnotatorConfidence = () => {
  const dispatch = useAppDispatch();
  const allConfidences = useAppSelector(state => selectAllConfidences(state.annotator))

  return {
    allConfidences: useMemo(() => {
      return allConfidences.filter(c => !!c).map(c => c!.label)
    }, [ allConfidences ]),
    focusedConfidence: useAppSelector(state => selectFocus(state.annotator)),
    focus: useCallback((confidence: string) => {
      dispatch(focus(confidence))
    }, []),
  }
}