import React, { Fragment, MouseEvent, useCallback, useMemo, useState } from 'react';
import { TableContent } from '@/components/ui';
import { Input } from '@/components/form';
import { IonButton, IonCheckbox, IonIcon, IonNote } from '@ionic/react';
import styles from './styles.module.scss';
import { createOutline } from 'ionicons/icons';
import { useAppDispatch, useAppSelector } from '@/features/App';
import { endPositionSelection, selectIsSelectingPositionForAnnotation, selectPosition } from '@/features/Annotator/UX';
import { useGetFreqTime, useIsInAnnotation } from '@/features/Annotator/Pointer';
import { CLICK_EVENT, useEvent } from '@/features/UX';
import type { Annotation } from '@/features/Annotator/Annotation';


export const InputRow: React.FC<{
    label: string,
    value?: number | null,
    unit?: string,
    max?: number,
    columnSpan?: boolean,
    disabled?: boolean,
    onUpdate: (value: number) => void,
} & (
    {
        clickable?: never,
        annotation?: never
    } | {
    clickable: true,
    annotation: Annotation
}
    )> = ({ label, clickable, value, max, columnSpan, onUpdate, annotation, disabled, unit }) => {
    const className = useMemo(() => {
        const classes = [styles.inputCell]
        if (clickable) classes.push(styles.cellButton)
        if (columnSpan) classes.push(styles.span2ColsEnd)
        return classes.join(' ')
    }, [ clickable, columnSpan ])

    const update = useCallback((value: number) => {
        if (max) value = Math.min(value, max)
        value = Math.max(value, 0)
        onUpdate(value)
    }, [ onUpdate, max ])

    const dispatch = useAppDispatch()

    const [ isSelecting, setIsSelecting ] = useState<boolean>(false);
    const select = useCallback(() => {
        if (!clickable) return
        setTimeout(() => setIsSelecting(true), 100);
        dispatch(selectPosition(annotation))
    }, [ dispatch, clickable, annotation ])
    const unselect = useCallback(() => {
        setIsSelecting(false)
        dispatch(endPositionSelection())
    }, [ dispatch ])
    const toggleSelection = useCallback(() => {
        if (isSelecting) unselect()
        else select()
    }, [ isSelecting, select, unselect ]);

    const isSelectingAnnotationFrequency = useAppSelector(selectIsSelectingPositionForAnnotation)
    const isInAnnotation = useIsInAnnotation()
    const getFreqTime = useGetFreqTime()
    const onClick = useCallback((event: MouseEvent) => {
        if (!clickable) return;
        if (!isSelecting) return;
        event.stopPropagation()
        if (!isSelectingAnnotationFrequency) return;
        if (!annotation) return;
        if (!isInAnnotation(event, annotation)) return;
        const position = getFreqTime(event)
        if (position) update(position.frequency)
        unselect()
    }, [ getFreqTime, clickable, isSelecting, isInAnnotation, isSelectingAnnotationFrequency, update ]);
    useEvent(CLICK_EVENT, onClick)

    return <Fragment>
        <TableContent>{ label }</TableContent>
        <TableContent className={ className }>
            <Input className={styles.input}
                   value={ value ?? '' } type="number" min={ 0 } max={ max } disabled={ disabled }
                   onChange={ e => update(e.target.valueAsNumber) }/>
            { unit && <IonNote>{ unit }</IonNote> }
            { clickable && <IonButton size="small" fill="clear"
                                      className={ isSelecting ? styles.selectedButton : undefined }
                                      onClick={ toggleSelection }>
                <IonIcon icon={ createOutline } slot="icon-only"/>
            </IonButton> }
        </TableContent>
    </Fragment>
}

export const BooleanRow: React.FC<{
    label: string,
    checked?: boolean | null,
    columnSpan?: boolean,
    toggle: () => void,
} & (
    {
        value?: number | null,
        onValueChange: (value: number) => void,
    } | {
    value?: never,
    onValueChange?: never
}
    )> = ({ label, checked, columnSpan, toggle, value, onValueChange }) => {
    const className = useMemo(() => {
        const classes = [ styles.checkCell ]
        if (onValueChange) classes.push(styles.inputCell)
        if (columnSpan) classes.push(styles.span2ColsEnd)
        return classes.join(' ')
    }, [ columnSpan, onValueChange ])

    return <Fragment>
        <TableContent>{ label }</TableContent>
        <TableContent className={ className }>
            <IonCheckbox checked={ checked ?? undefined } onClick={ toggle }/>
            { onValueChange && <Input value={ value ?? '' } type="number" min={ 0 }
                                      className={styles.input} disabled={ !checked }
                                      onChange={ e => onValueChange(e.target.valueAsNumber) }/> }
        </TableContent>
    </Fragment>
}

export const NoteRow: React.FC<{
    label: string;
    note: string | number;
}> = ({ label, note }) => {
    return <Fragment>
        <TableContent>{ label }</TableContent>
        <TableContent><IonNote>{ note }</IonNote></TableContent>
    </Fragment>
}