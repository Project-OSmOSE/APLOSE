import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import styles from './styles.module.scss';
import { ExtendedDiv, Table } from '@/components/ui';
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

export const AcousticFeatures: React.FC = () => {
    const focusedAnnotation = useAppSelector(selectAnnotation)
    const getAnnotation = useGetAnnotation()
    const { campaign } = useCurrentCampaign()
    const timeScale = useTimeScale()
    const dispatch = useAppDispatch();

    const initialLeft = useMemo(() => window.innerWidth - 500, [])

    const [ top, setTop ] = useState<number>(128);
    const [ left, setLeft ] = useState<number>(initialLeft);

    const [ prevAnnotationID, setPrevAnnotationID ] = useState<number | undefined>();

    useEffect(() => {
        if (prevAnnotationID === focusedAnnotation?.id) return;
        if (!focusedAnnotation?.endTime) return;
        const newLeft = timeScale.valueToPosition(focusedAnnotation.endTime) + 80;
        setPrevAnnotationID(focusedAnnotation.id);
        setLeft(newLeft);
    }, [ focusedAnnotation ]);

    const onTopMove = useCallback((move: number) => {
        setTop(prev => prev + move)
    }, [ setTop ])

    const onLeftMove = useCallback((move: number) => {
        setLeft(prev => prev + move)
    }, [ setLeft ])

    const quit = useCallback(() => {
        if (!focusedAnnotation) return
        const weak = getAnnotation({
            type: AnnotationType.Weak,
            label: focusedAnnotation.label,
        });
        if (weak) dispatch(focusAnnotation(weak))
    }, [ getAnnotation, focusedAnnotation, dispatch ])

    if (!focusedAnnotation) return <Fragment/>;
    if (!campaign?.labelsWithAcousticFeatures?.find(l => l?.name === focusedAnnotation.label)) return <Fragment/>;
    if (focusedAnnotation.type !== AnnotationType.Box) return <Fragment/>;
    // @ts-expect-error: --left isn't recognized
    return <div style={ { top, '--left': `${ left }px` } }
                className={ styles.features }
                onMouseDown={ e => e.stopPropagation() }>
        <ExtendedDiv draggable={ true }
                     onTopMove={ onTopMove }
                     onLeftMove={ onLeftMove }
                     className={ styles.blocHeader }><h6>
            Acoustic features
            <IoRemoveCircleOutline onClick={ quit }/>
        </h6></ExtendedDiv>
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
}
