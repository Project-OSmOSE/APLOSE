import { useAppDispatch, useAppSelector } from '@/features/App';
import { selectFocus, selectHiddenLabels, setHiddenLabels } from './slice'
import { useCurrentCampaign } from '@/api';
import { useCallback, useMemo } from 'react';

export const useAnnotatorLabel = () => {
  const { campaign } = useCurrentCampaign()
  const allLabels: string[] = useMemo(() => {
    return campaign?.labelSet?.labels.filter(l => !!l).map(l => l!.name) ?? []
  }, [ campaign ])
  const dispatch = useAppDispatch()
  const hiddenLabels = useAppSelector(state => selectHiddenLabels(state.annotator))

  const hideLabel = useCallback((label: string) => {
    dispatch(setHiddenLabels([ ...hiddenLabels, label ]))
  }, [ hiddenLabels ])
  const hideAllLabels = useCallback(() => {
    dispatch(setHiddenLabels(allLabels))
  }, [ allLabels ])
  const showLabel = useCallback((label: string) => {
    dispatch(setHiddenLabels(hiddenLabels.filter(l => l !== label)))
  }, [ hiddenLabels ])
  const showAllLabels = useCallback(() => {
    dispatch(setHiddenLabels([]))
  }, [])

  return {
    allLabels,
    focusedLabel: useAppSelector(state => selectFocus(state.annotator)),

    hiddenLabels,
    hideLabel, hideAllLabels,
    showLabel, showAllLabels,
  }
}