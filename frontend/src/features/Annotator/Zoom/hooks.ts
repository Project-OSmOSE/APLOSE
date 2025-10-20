import { useCallback, useMemo, WheelEvent } from 'react';
import { useAppDispatch, useAppSelector } from '@/features/App';
import { useAnnotatorAnalysis } from '@/features/Annotator/Analysis';
import { Point, selectZoom, selectZoomOrigin, setZoom, setZoomOrigin } from './slice'
import { useAnnotatorPointer } from '@/features/Annotator/Pointer';

export const useAnnotatorZoom = () => {
  const { analysis } = useAnnotatorAnalysis()
  const { getCoords } = useAnnotatorPointer()
  const zoom = useAppSelector(state => selectZoom(state.annotator))
  const zoomOrigin = useAppSelector(state => selectZoomOrigin(state.annotator))
  const dispatch = useAppDispatch()

  const maxZoom = useMemo(() => {
    return analysis?.legacyConfiguration?.zoomLevel ?? 1
  }, [ analysis ])

  const zoomInLevel = useMemo(() => {
    return zoom * 2 <= 2 ** maxZoom ? zoom * 2 : undefined;
  }, [ zoom, maxZoom ])

  const zoomOutLevel = useMemo(() => {
    return zoom / 2 >= 1 ? zoom / 2 : undefined;
  }, [ zoom ])

  const zoomIn = useCallback((zoomOrigin?: Point) => {
    if (!zoomInLevel) return;
    dispatch(setZoom(zoomInLevel))
    dispatch(setZoomOrigin(zoomOrigin))
  }, [ zoomInLevel ])
  const zoomOut = useCallback((zoomOrigin?: Point) => {

    if (!zoomOutLevel) return;
    dispatch(setZoom(zoomOutLevel))
    dispatch(setZoomOrigin(zoomOrigin))
  }, [ zoomOutLevel ])

  const onWheel = useCallback((event: WheelEvent) => {
    // Disable zoom if the user wants horizontal scroll
    if (event.shiftKey) return;
    // Prevent page scrolling
    event.stopPropagation();

    const origin = getCoords(event);
    if (!origin) return;
    if (event.deltaY < 0) zoomIn(origin)
    else if (event.deltaY > 0) zoomOut(origin)
  }, [ zoomIn, zoomOut, getCoords ])

  return {
    zoom, zoomOrigin, maxZoom,
    zoomInLevel, zoomOutLevel,
    zoomIn, zoomOut,
    onWheel,
  }
}