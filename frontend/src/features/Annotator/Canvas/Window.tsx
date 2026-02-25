import React, { MouseEvent, UIEvent, useCallback, useEffect, useRef, WheelEvent } from 'react';
import styles from './styles.module.scss';
import { FrequencyAxis, TimeAxis } from '@/features/Annotator/Axis';
import { TimeBar } from './TimeBar';
import {
    selectAllAnnotations,
    selectTempAnnotation,
    StrongAnnotation,
    useTempAnnotationsEvents,
} from '@/features/Annotator/Annotation';
import { useWindowContainerWidth, useWindowHeight, useWindowWidth, Y_AXIS_WIDTH } from './window.hooks';
import { useGetCoords, useGetFreqTime, useIsHoverCanvas, usePointer } from '@/features/Annotator/Pointer';
import { selectZoom, selectZoomOrigin, useZoomIn, useZoomOut } from '@/features/Annotator/Zoom';
import { selectCanDraw } from '@/features/Annotator/UX';
import { useAudio } from '@/features/Audio';
import { useAnnotatorCanvasContext } from '@/features/Annotator/Canvas/context';
import { useAppDispatch, useAppSelector } from '@/features/App';
import { setAllFileAsSeen } from '@/features/Annotator/UX/slice';
import { useDrawCanvas } from '@/features/Annotator/Canvas/hooks';
import { useAnnotationTask } from '@/api';
import {
    selectBrightness,
    selectColormap,
    selectContrast,
    selectIsColormapReversed,
} from '@/features/Annotator/VisualConfiguration';
import { selectAnalysis } from '@/features/Annotator/Analysis';
import { AcousticFeatures } from '@/features/Annotator/AcousticFeatures';

export const AnnotatorCanvasWindow: React.FC = () => {
    const width = useWindowWidth()
    const height = useWindowHeight()
    const containerWidth = useWindowContainerWidth()
    const { mainCanvasRef, windowCanvasRef } = useAnnotatorCanvasContext()
    const { onStartTempAnnotation } = useTempAnnotationsEvents()
    const getFreqTime = useGetFreqTime()
    const getCoords = useGetCoords()
    const zoomIn = useZoomIn()
    const zoomOut = useZoomOut()
    const canDraw = useAppSelector(selectCanDraw)
    const { seek } = useAudio()
    const allAnnotations = useAppSelector(selectAllAnnotations)
    const draw = useDrawCanvas()
    const dispatch = useAppDispatch()
    const pointer = usePointer()

    const clearPointer = useCallback(() => {
        pointer.clearPosition()
    }, [ pointer ]);

    const onFileScrolled = useCallback((event: UIEvent<HTMLDivElement>) => {
        if (event.type !== 'scroll') return;
        const div = event.currentTarget;
        const left = div.scrollWidth - div.scrollLeft - div.clientWidth;
        if (left <= 0) dispatch(setAllFileAsSeen())
    }, [dispatch])

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

    const seekAudio = useCallback((event: MouseEvent<HTMLCanvasElement>) => {
        seek(getFreqTime(event)?.time ?? 0)
    }, [ seek, getFreqTime ])

    // Global updates
    const tempAnnotation = useAppSelector(selectTempAnnotation)
    const analysis = useAppSelector(selectAnalysis)
    const { spectrogram } = useAnnotationTask()
    const brightness = useAppSelector(selectBrightness);
    const contrast = useAppSelector(selectContrast);
    const colormap = useAppSelector(selectColormap);
    const isColormapReversed = useAppSelector(selectIsColormapReversed);
    useEffect(() => {
        draw()
    }, [
        // On current newAnnotation changed
        tempAnnotation?.endTime, tempAnnotation?.endFrequency, tempAnnotation,
        // On Spectrogram or analysis changed
        spectrogram, analysis,
        // On colormap changed
        colormap, isColormapReversed, brightness, contrast,
    ])


    // Time update
    const { time } = useAudio()
    const oldTime = useRef<number>(0)
    useEffect(() => {
        // Scroll if progress bar reach the right edge of the screen
        if (!windowCanvasRef?.current || !spectrogram) return;
        const oldX: number = Math.floor(width * oldTime.current / spectrogram.duration);
        const newX: number = Math.floor(width * time / spectrogram.duration);

        if ((oldX - windowCanvasRef.current.scrollLeft) < containerWidth && (newX - windowCanvasRef.current.scrollLeft) >= containerWidth) {
            windowCanvasRef.current.scrollLeft += containerWidth;
        }
        oldTime.current = time
    }, [
        // On time changed
        time, spectrogram?.duration,
    ])


    // Zoom update
    const zoom = useAppSelector(selectZoom)
    const zoomOrigin = useAppSelector(selectZoomOrigin)
    const oldZoom = useRef<number>(1)
    const isHoverCanvas = useIsHoverCanvas()
    useEffect(() => {
        const mainBounds = mainCanvasRef?.current?.getBoundingClientRect()
        if (!window || !spectrogram || !mainBounds) return;

        // If zoom factor has changed
        if (zoom === oldZoom.current) return;
        // New timePxRatio
        const newTimePxRatio: number = containerWidth * zoom / spectrogram.duration;

        // Compute new center (before resizing)
        let newCenter: number;
        if (zoomOrigin) {
            // x-coordinate has been given, center on it
            newCenter = (zoomOrigin.x - mainBounds.left) * zoom / oldZoom.current;
            const coords = {
                clientX: zoomOrigin.x,
                clientY: zoomOrigin.y,
            }
            if (isHoverCanvas(coords)) {
                const data = getFreqTime(coords);
                if (data) pointer.setPosition(data)
            }
        } else {
            // If no x-coordinate: center on currentTime
            newCenter = oldTime.current * newTimePxRatio;
        }
        window.scrollTo({ left: Math.floor(newCenter - containerWidth / 2) })
        oldZoom.current = zoom;
        draw()
    }, [
        // On zoom updated
        zoom, spectrogram?.duration,
    ]);

    return <div className={ styles.spectrogramWindow }
                ref={ windowCanvasRef }
                onScroll={ onFileScrolled }
                style={ { width: `${ Y_AXIS_WIDTH + containerWidth }px` } }>

        <TimeAxis/>
        <FrequencyAxis/>

        <div className={ styles.spectrogram }
             onWheel={ onWheel }
             onPointerLeave={ clearPointer }
             onMouseDown={ e => e.stopPropagation() }>

            <canvas className={ canDraw ? styles.drawable : '' }
                    data-testid="drawable-canvas"
                    ref={ mainCanvasRef }
                    height={ height }
                    width={ width }
                    onMouseDown={ onStartTempAnnotation }
                    onClick={ seekAudio }/>

            <TimeBar/>

            { allAnnotations.map(annotation => <StrongAnnotation key={ annotation.id } annotation={ annotation }/>) }
        </div>

        <AcousticFeatures/>

    </div>
}
