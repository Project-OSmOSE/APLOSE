import React, { Fragment, useCallback, useEffect, useMemo, useRef } from 'react';
import styles from './styles.module.scss';
import { type ExtendedDivPosition, Table, useExtendedDiv } from '@/components/ui';
import { IoRemoveCircleOutline } from 'react-icons/io5';
import { AnnotationType, useCurrentCampaign } from '@/api';
import { useTimeScale } from '@/features/Annotator/Axis';
import { useAppDispatch, useAppSelector } from '@/features/App';
import { selectAnnotation } from '@/features/Annotator/Annotation/selectors';
import { focusAnnotation } from '@/features/Annotator/Annotation/slice';
import { useGetAnnotation } from '@/features/Annotator/Annotation';
import { QuantitySwitch } from './Quantity';
import { Frequency } from './Frequency';
import { Trend } from './Trend';
import { Duration } from '@/features/Annotator/AcousticFeatures/Duration';
import { NonLinearPhenomena } from '@/features/Annotator/AcousticFeatures/NonLinearPhenomena';
import { Checks } from '@/features/Annotator/AcousticFeatures/Checks';
import { useWindowWidth } from '@/features/Annotator/Canvas';

export const AcousticFeatures: React.FC = () => {
    const focusedAnnotation = useAppSelector(selectAnnotation)
    const getAnnotation = useGetAnnotation()
    const { campaign } = useCurrentCampaign()
    const timeScale = useTimeScale()
    const dispatch = useAppDispatch();

    const quit = useCallback(() => {
        if (!focusedAnnotation) return
        const weak = getAnnotation({
            type: AnnotationType.Weak,
            label: focusedAnnotation.label,
        });
        if (weak) dispatch(focusAnnotation(weak))
    }, [ getAnnotation, focusedAnnotation, dispatch ])

    const divRef = useRef<HTMLDivElement | null>(null)
    const windowWidth = useWindowWidth()
    const initialPosition = useMemo(() => {
        const initialLeft = window.innerWidth - 500
        const position: ExtendedDivPosition ={
            x: initialLeft,
            y: 128,
        }
        if (!focusedAnnotation?.endTime) return position
        position.x = timeScale.valueToPosition(focusedAnnotation.endTime) + 80;
        if (position.x > initialLeft) {
            const otherSideLeft = timeScale.valueToPosition(focusedAnnotation.endTime) - 80 - 500;
            if (otherSideLeft > 0) position.x = otherSideLeft
        }
        return position
    }, [focusedAnnotation, timeScale])

    const {
        className: extendedClassName,
        initPosition,
        handleMouseDown,
    } = useExtendedDiv({
        divRef, initialPosition,
        minX: 0, maxX: windowWidth - 16 * 26,
    })
    useEffect(() => {
        initPosition()
    }, [timeScale]);
    const prevAnnotationID = useRef<number | undefined>();
    useEffect(() => {
        if (prevAnnotationID.current === focusedAnnotation?.id) return;
        initPosition()
        prevAnnotationID.current = focusedAnnotation?.id
    }, [ focusedAnnotation ]);

    return useMemo(() => {
        if (!focusedAnnotation) return <Fragment/>;
        if (!campaign?.labelsWithAcousticFeatures?.find(l => l?.name === focusedAnnotation.label)) return <Fragment/>;
        if (focusedAnnotation.type !== AnnotationType.Box) return <Fragment/>;
        return <div ref={ divRef }
                    className={ styles.features }
                    onMouseDown={ e => e.stopPropagation() }>
            <div onMouseDown={ e => handleMouseDown(e, 'drag') }
                 className={ [ styles.blocHeader, extendedClassName ].join(' ') }><h6>
                Acoustic features
                <IoRemoveCircleOutline onClick={ quit }/>
            </h6></div>
            <div className={ styles.body }>

                <QuantitySwitch annotation={ focusedAnnotation }/>

                { focusedAnnotation.acousticFeatures && <Fragment>
                    <Checks annotation={ focusedAnnotation }/>

                    <Table columns={ 3 } className={ styles.table } size="small">
                        <Frequency annotation={ focusedAnnotation }/>
                        <Trend annotation={ focusedAnnotation }/>
                        <Duration annotation={ focusedAnnotation }/>
                        <NonLinearPhenomena annotation={ focusedAnnotation }/>
                    </Table>
                </Fragment> }
            </div>
        </div>
    }, [ focusedAnnotation, campaign, handleMouseDown, extendedClassName, quit ])
}
