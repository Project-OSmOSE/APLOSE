import { useAppDispatch, useAppSelector } from '@/features/App';
import {
  selectAllFileIsSeen,
  selectIsDrawingEnabled,
  selectStart,
  selectUpdated,
  setAllFileAsSeen,
  setIsDrawingEnabled,
} from './slice';
import { UIEvent, useCallback, useMemo } from 'react';
import { useAnnotatorLabel } from '@/features/Annotator/Label';
import { useAnnotationTask } from '@/api';

export const useAnnotatorUX = () => {
  const { focusedLabel } = useAnnotatorLabel()
  const { isEditionAuthorized } = useAnnotationTask()
  const isDrawingEnabled = useAppSelector(state => selectIsDrawingEnabled(state.annotator));
  const dispatch = useAppDispatch()

  const onFileScrolled = useCallback((event: UIEvent<HTMLDivElement>) => {
    if (event.type !== 'scroll') return;
    const div = event.currentTarget;
    const left = div.scrollWidth - div.scrollLeft - div.clientWidth;
    if (left <= 0) dispatch(setAllFileAsSeen())
  }, [])

  return {
    start: useAppSelector(state => selectStart(state.annotator)),

    isDrawingEnabled,
    enableDrawing: useCallback(() => {
      dispatch(setIsDrawingEnabled(true))
    }, []),
    disableDrawing: useCallback(() => {
      dispatch(setIsDrawingEnabled(false))
    }, []),

    canDraw: useMemo(() => isEditionAuthorized && isDrawingEnabled && !!focusedLabel, [ isEditionAuthorized, isDrawingEnabled, focusedLabel ]),
    onFileScrolled,

    isUpdated: useAppSelector(state => selectUpdated(state.annotator)),
    allFileIsSeen: useAppSelector(state => selectAllFileIsSeen(state.annotator)),
  }
}
