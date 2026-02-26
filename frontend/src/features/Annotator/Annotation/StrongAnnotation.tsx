import React, { Fragment, useCallback, useMemo, useRef, useState, type MouseEvent, useEffect } from 'react';
import { Annotation, focusAnnotation } from './slice';
import { AnnotationType, useAnnotationTask } from '@/api';
import { useAppDispatch, useAppSelector } from '@/features/App';
import { selectAllLabels, selectHiddenLabels } from '@/features/Annotator/Label';
import {
    selectTaskIsEditionAuthorized,
} from '@/features/Annotator/selectors';
import { selectAnnotation } from '@/features/Annotator/Annotation/selectors';
import { selectIsDrawingEnabled, selectIsSelectingPositionForAnnotation } from '@/features/Annotator/UX';
import { type ExtendedDivPosition, useExtendedDiv } from '@/components/ui/ExtendedDiv';
import { useFrequencyScale, useTimeScale } from '@/features/Annotator/Axis';

import styles from './styles.module.scss'
import { formatTime } from '@/service/function';
import { useUpdateAnnotation } from '@/features/Annotator/Annotation/hooks';
import { AnnotationHeadContent } from '@/features/Annotator/Annotation/Head';
import { MOUSE_DOWN_EVENT } from '@/features/UX';
import { useSpectrogramDimensions } from '@/features/Spectrogram/Display/dimension.hook';
import { selectZoom } from '@/features/Annotator/Zoom';

const POINT_RADIUS = 16; // px

export const StrongAnnotation: React.FC<{
    annotation: Annotation
}> = ({ annotation }) => {
    const dispatch = useAppDispatch();
    const { spectrogram } = useAnnotationTask()
    const zoom = useAppSelector(selectZoom)
    const { width: windowWidth, height: windowHeight } = useSpectrogramDimensions(zoom)

    const isEditionAuthorized = useAppSelector(selectTaskIsEditionAuthorized)
    const isDrawingEnabled = useAppSelector(selectIsDrawingEnabled)
    const isSelectingAnnotationFrequency = useAppSelector(selectIsSelectingPositionForAnnotation)

    const focusedAnnotation = useAppSelector(selectAnnotation)
    const updateAnnotation = useUpdateAnnotation()
    const focus = useCallback((e: MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        dispatch(focusAnnotation(annotation))
    }, [ annotation, dispatch ])

    const allLabels = useAppSelector(selectAllLabels)
    const hiddenLabels = useAppSelector(selectHiddenLabels)

    const [ isMouseHover, setIsMouseHover ] = useState<boolean>(false);

    const timeScale = useTimeScale()
    const frequencyScale = useFrequencyScale()

    const divRef = useRef<HTMLDivElement | null>(null);
    const annotationPosition = useMemo(() => {
        let delta = 0
        if (annotation.type === AnnotationType.Point) delta = POINT_RADIUS
        return {
            x: timeScale.valueToPosition(annotation.update?.startTime ?? annotation.startTime!) - delta,
            y: frequencyScale.valueToPosition(
                annotation.type === AnnotationType.Box ?
                    annotation.update?.endFrequency ?? annotation.endFrequency! :
                    annotation.update?.startFrequency ?? annotation.startFrequency!,
            ) - delta,
            width: annotation.type === AnnotationType.Box ? timeScale.valuesToPositionRange(
                annotation.update?.startTime ?? annotation.startTime!,
                annotation.update?.endTime ?? annotation.endTime!,
            ) : undefined,
            height: annotation.type === AnnotationType.Box ? frequencyScale.valuesToPositionRange(
                annotation.update?.startFrequency ?? annotation.startFrequency!,
                annotation.update?.endFrequency ?? annotation.endFrequency!,
            ) : undefined,
        }satisfies ExtendedDivPosition
    }, [ annotation, timeScale, frequencyScale ])
    const onUpdated = useCallback(({ x, y, width, height }: ExtendedDivPosition) => {
        if (annotation.type === AnnotationType.Point) {
            x += POINT_RADIUS
            y += POINT_RADIUS
        }
        let newStartTime = timeScale.positionToValue(x);
        let newEndTime = timeScale.positionToValue(x + (width ?? 0));
        let newEndFrequency = frequencyScale.positionToValue(y);
        let newStartFrequency = frequencyScale.positionToValue(y + (height ?? 0));
        const _startTime = annotation.update?.startTime ?? annotation.startTime;
        const _endTime = annotation.update?.endTime ?? annotation.endTime;
        const _endFrequency = annotation.update?.endFrequency ?? annotation.endFrequency;
        const _startFrequency = annotation.update?.startFrequency ?? annotation.startFrequency;
        if (_startTime && formatTime(newStartTime, true) === formatTime(_startTime, true)) newStartTime = _startTime;
        if (_endTime && formatTime(newEndTime, true) === formatTime(_endTime, true)) newEndTime = _endTime;
        if (_startFrequency && _startFrequency.toFixed(2) === newStartFrequency.toFixed(2)) newStartFrequency = _startFrequency;
        if (_endFrequency && _endFrequency.toFixed(2) === newEndFrequency.toFixed(2)) newEndFrequency = _endFrequency;
        switch (annotation.type) {
            case AnnotationType.Box:
                updateAnnotation(annotation, {
                    startTime: newStartTime,
                    endTime: newEndTime,
                    startFrequency: newStartFrequency,
                    endFrequency: newEndFrequency,
                })
                break;
            case AnnotationType.Point:
                updateAnnotation(annotation, {
                    startTime: newStartTime,
                    startFrequency: newStartFrequency,
                })
                break;
        }
    }, [ annotation, updateAnnotation, timeScale, frequencyScale ])

    const {
        className: extendedClassName,
        handles,
        handleMouseDown,
        initPosition,
    } = useExtendedDiv({
        divRef, initialPosition: annotationPosition, onUpdated,
        minX: 0, minY: 0, maxX: windowWidth, maxY: windowHeight,
    })
    useEffect(() => {
        initPosition()
    }, [ timeScale, frequencyScale ]);

    return useMemo(() => {
        if (!spectrogram) return <Fragment/>
        if (annotation.type === AnnotationType.Weak) return <Fragment/>
        if (hiddenLabels.includes(annotation.label)) return <Fragment/>
        if (!annotation.update && annotation.validation?.isValid == false) return <Fragment/>

        // State
        const isActive = isEditionAuthorized && annotation.id === focusedAnnotation?.id

        // Style
        const colorClass = `ion-color-${ allLabels.indexOf(annotation.update?.label ?? annotation.label) % 10 }`
        const classes = [ styles.strongAnnotation, colorClass, extendedClassName ]
        if (!isActive) classes.push(styles.disabled)
        if (!isDrawingEnabled) classes.push(styles.editDisabled)
        if (isActive && isSelectingAnnotationFrequency) classes.push(styles.pointerSelect)
        if (annotation.type === AnnotationType.Box) classes.push(styles.box)
        if (annotation.type === AnnotationType.Point) classes.push(styles.point)
        const headerClasses = [ styles.header ]
        const start = annotation.update?.startTime ?? annotation.startTime!
        const end = annotation.type === 'Box' ? annotation.update?.endTime ?? annotation.endTime! : start
        if (start < (spectrogram.duration * 0.1)) headerClasses.push(styles.stickLeft)
        else if (end > (spectrogram.duration * 0.9)) headerClasses.push(styles.stickRight)
        if (annotationPosition.y < 24) headerClasses.push(styles.bellow)
        else headerClasses.push(styles.over)

        return <div ref={ divRef }
                    className={ classes.join(' ') }
                    onMouseEnter={ () => setIsMouseHover(true) }
                    onMouseMove={ () => setIsMouseHover(true) }
                    onMouseLeave={ () => setIsMouseHover(false) }>

            <div className={ styles.void }
                 onMouseDown={ MOUSE_DOWN_EVENT.emit.bind(MOUSE_DOWN_EVENT) }/>

            {/* Header */ }
            { (isMouseHover || isActive) && <div className={ headerClasses.join(' ') }
                                                 onClick={ focus }
                                                 onMouseDown={ e => isActive && isDrawingEnabled && handleMouseDown(e, 'drag') }
                                                 onMouseEnter={ () => setIsMouseHover(true) }
                                                 onMouseMove={ () => setIsMouseHover(true) }
                                                 onMouseLeave={ () => setIsMouseHover(false) }>
                <AnnotationHeadContent annotation={ annotation }/>
            </div> }

            {/* Point cross */ }
            { annotation.type === AnnotationType.Point && <Fragment>
                <div className={ styles.vertical }/>
                <div className={ styles.horizontal }/>
            </Fragment> }

            {/* Handles */ }
            { isActive && isDrawingEnabled && annotation.type === AnnotationType.Box && handles }
        </div>
    }, [
        isEditionAuthorized, isDrawingEnabled, isSelectingAnnotationFrequency, isMouseHover,
        extendedClassName, annotationPosition,
        annotation, hiddenLabels, allLabels, focusedAnnotation, spectrogram,
        focus, handleMouseDown,
    ])
}