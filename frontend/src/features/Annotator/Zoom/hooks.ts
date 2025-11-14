import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/features/App';
import { Point, setZoom, setZoomOrigin } from './slice'
import { selectZoomInLevel, selectZoomOutLevel } from './selectors';


export const useZoomOut = () => {
  const zoomOutLevel = useAppSelector(selectZoomOutLevel)
  const dispatch = useAppDispatch()

  return useCallback((zoomOrigin?: Point) => {
    if (!zoomOutLevel) return;
    dispatch(setZoom(zoomOutLevel))
    dispatch(setZoomOrigin(zoomOrigin))
  }, [ zoomOutLevel ])
}


export const useZoomIn = () => {
  const zoomInLevel = useAppSelector(selectZoomInLevel)
  const dispatch = useAppDispatch()

  return useCallback((zoomOrigin?: Point) => {
    if (!zoomInLevel) return;
    dispatch(setZoom(zoomInLevel))
    dispatch(setZoomOrigin(zoomOrigin))
  }, [ zoomInLevel ])
}
