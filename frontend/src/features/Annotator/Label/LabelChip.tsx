import React, { Fragment, MouseEvent, useCallback, useMemo } from 'react';
import styles from './styles.module.scss';
import { Kbd } from '@/components/ui';
import {
    focusAnnotation,
    selectAllAnnotations,
    selectAnnotation,
    useAddAnnotation,
    useGetAnnotation,
    useRemoveAnnotation,
    useUpdateAnnotation,
    useValidateAnnotation,
} from '@/features/Annotator/Annotation';
import { AnnotationType } from '@/api';
import { selectDefaultConfidence } from '@/features/Annotator/Confidence';
import { useAppDispatch, useAppSelector } from '@/features/App';
import { setHiddenLabelIds } from './slice';
import { selectFocusLabelId, selectHiddenLabelIds } from './selectors';
import { NBSP } from '@/service/type';
import { useLoaderData } from '@tanstack/react-router';
import { Popover } from '@/components/base/Popover';
import { Chip, type ChipProps, ChipRemove } from '@/components/base';
import { EyeClosedLinearIcon, EyeLinearIcon, UnreadLinearIcon } from '@solar-icons/react';
import { useHotkeySequence } from '@tanstack/react-hotkeys';
import type { Hotkey } from '@tanstack/hotkeys/src/hotkey';
import { LabelFragment } from "@/features/Mx/Ontology/api";

export const AlphanumericKeys = [ 'à', '&', 'é', '"', '\'', '(', '-', 'è', '_', 'ç' ]

export const LabelChip: React.FC<{
    label: LabelFragment;
}> = ({ label }) => {
    const { labels } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })
    const focusedLabelId = useAppSelector(selectFocusLabelId)
    const hiddenLabelIds = useAppSelector(selectHiddenLabelIds)
    const defaultConfidence = useAppSelector(selectDefaultConfidence);
    const addAnnotation = useAddAnnotation()
    const updateAnnotation = useUpdateAnnotation()
    const validateAnnotation = useValidateAnnotation()
    const focusedAnnotation = useAppSelector(selectAnnotation)
    const allAnnotations = useAppSelector(selectAllAnnotations)
    const getAnnotation = useGetAnnotation()
    const removeAnnotation = useRemoveAnnotation()
    const index = useMemo(() => labels.map(l => l.id).indexOf(label.id), [ labels, label ])
    const numberShortcuts = useMemo(() => (index + 1).toString()?.split('') as Hotkey[], [ index ]);
    const keyShortcuts = useMemo(() => (index + 1).toString()?.split('').map(i => AlphanumericKeys[+i]) as Hotkey[], [ index ]);
    const isUsed = useMemo(() => allAnnotations.some(a => {
        if (a.labelId !== label.id) return false
        if (!a.validation) return true
        return a.validation.isValid
    }), [ allAnnotations, label ])
    const isHidden = useMemo(() => hiddenLabelIds.includes(label.id), [ hiddenLabelIds, label ])
    const dispatch = useAppDispatch()

    const select = useCallback(() => {
        const weakProperties = {
            type: AnnotationType.Weak,
            labelId: label.id,
        }

        const weak = getAnnotation(weakProperties)
        if (!weak) {
            // Create weak if it doesn't exist
            addAnnotation({ ...weakProperties, confidence: defaultConfidence })
        }

        if (focusedAnnotation) {
            // If focused annotation exists
            if (focusedAnnotation.type !== AnnotationType.Weak) {
                // If focused annotation is strong => update its label
                updateAnnotation(focusedAnnotation, { labelId: label.id })
            } else if (focusedAnnotation.labelId === label.id) {
                // If focused annotation is weak and has selected label => remove weak annotation
                removeAnnotation(focusedAnnotation)
                return
            }
        }
        if (weak) {
            // If there is no focused strong annotation
            if (!weak.validation?.isValid) validateAnnotation(weak)
            dispatch(focusAnnotation(weak))
        }
    }, [ focusedAnnotation, updateAnnotation, validateAnnotation, label, getAnnotation, dispatch, addAnnotation, defaultConfidence, removeAnnotation ])
    useHotkeySequence(numberShortcuts, () => select())
    useHotkeySequence(keyShortcuts, () => select())

    const show = useCallback((event: MouseEvent) => {
        event.stopPropagation();
        // Hide all but current if ctrlKey pressed
        if (event.ctrlKey) dispatch(setHiddenLabelIds(labels.map(l => l.id).filter(id => id !== label.id)))
        else dispatch(setHiddenLabelIds(hiddenLabelIds.filter(id => id !== label.id)))
    }, [ label, hiddenLabelIds, dispatch, labels ])

    const hide = useCallback((event: MouseEvent) => {
        event.stopPropagation();
        // Hide all but current if ctrlKey pressed => show
        if (event.ctrlKey) show(event)
        else dispatch(setHiddenLabelIds([ ...hiddenLabelIds, label.id ]))
    }, [ label, show, dispatch, hiddenLabelIds ])

    const remove = useCallback(() => {
        const annotation = getAnnotation({ labelId: label.id, type: AnnotationType.Weak })
        if (!annotation) return;
        removeAnnotation(annotation)
    }, [ label, getAnnotation, removeAnnotation ])

    return (
        <Chip data-testid="label-chip"
              onClick={ select }
              { ...(isUsed ? { annotationColorIndex: index } : { color: 'medium' }) as Partial<ChipProps> }>

            { focusedLabelId === label.id && <UnreadLinearIcon size={ 20 }/> }

            <div className={ styles['colorIndicator-' + index%10] }/>

            <Popover.Root>
                <Popover.Trigger render={ <span/> } nativeButton={ false }>
                    { label.displayName }
                </Popover.Trigger>
                <Popover.Content>
                    <Popover.Title>Shortcut</Popover.Title>
                    <Kbd keys={ numberShortcuts } annotationColorIndex={ index }/>:
                    { NBSP }Choose this label
                </Popover.Content>
            </Popover.Root>


            { isUsed && <Fragment>
                <Popover.Root>
                    <Popover.Trigger render={ <div/> } nativeButton={ false } className={ styles.button }>
                        { isHidden ?
                            <EyeClosedLinearIcon size={ 20 } onClick={ show }/> :
                            <EyeLinearIcon size={ 20 } onClick={ hide }/> }
                    </Popover.Trigger>
                    <Popover.Content>
                        <p>{ isHidden ? 'Show' : 'Hide' } corresponding annotations on spectrogram</p>
                        <p>Press <Kbd keys={ 'ctrl' }/> to show only this labels annotations</p>
                    </Popover.Content>
                </Popover.Root>

                <Popover.Root>
                    <Popover.Trigger render={ <div/> } nativeButton={ false } className={ styles.button }>
                        <ChipRemove onClick={ remove } data-testid="remove-label"/>
                    </Popover.Trigger>
                    <Popover.Content>Remove corresponding annotations</Popover.Content>
                </Popover.Root>
            </Fragment> }
        </Chip>
    )
}