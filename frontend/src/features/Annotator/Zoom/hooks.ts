import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/features/App';
import { Point, setZoom, setZoomOrigin } from './slice'
import { selectZoom } from './selectors';
import { useAnnotatorAnalysis } from '@/features/Annotator/Analysis/hooks';


export const useZoomOut = () => {
    const zoomOutLevel = useZoomOutLevel()
    const dispatch = useAppDispatch()

    return useCallback((zoomOrigin?: Point) => {
        if (!zoomOutLevel) return;
        dispatch(setZoom(zoomOutLevel))
        dispatch(setZoomOrigin(zoomOrigin))
    }, [ zoomOutLevel, dispatch ])
}


export const useZoomIn = () => {
    const zoomInLevel = useZoomInLevel()
    const dispatch = useAppDispatch()

    return useCallback((zoomOrigin?: Point) => {
        if (!zoomInLevel) return;
        dispatch(setZoom(zoomInLevel))
        dispatch(setZoomOrigin(zoomOrigin))
    }, [ zoomInLevel, dispatch ])
}

export const useZoomOutLevel = () => {
    const zoom = useAppSelector(selectZoom)
    return useMemo(() => zoom / 2 >= 1 ? zoom / 2 : undefined, [ zoom ]);
}

export const useZoomInLevel = () => {
    const analysis = useAnnotatorAnalysis()
    const zoom = useAppSelector(selectZoom)
    return useMemo(() => {
        const max = analysis?.legacyConfiguration?.zoomLevel ?? 0
        return zoom * 2 <= 2 ** max ? zoom * 2 : undefined
    }, [ analysis, zoom ]);
}