import React, { Fragment, useCallback } from 'react';
import { Kbd } from '@/components/ui';
import { useAudio } from '@/features/Audio';
import { LabelDialog } from '@/features/Labels';
import type { Annotation } from './slice';
import { useRemoveAnnotation, useUpdateAnnotation } from '@/features/Annotator/Annotation/hooks';
import { useAppSelector } from '@/features/App';
import { selectFocusLabel } from '@/features/Annotator/Label';
import { Dialog, Popover } from '@/components/base';
import { useLoaderData } from '@tanstack/react-router';
import type { LabelFragment } from '@/features/Labels/api';
import { ChatLine, ChatSquare, Play, SortHorizontal, TrashBinTrash } from '@solar-icons/react';

export const AnnotationHeadContent: React.FC<{
    annotation: Annotation,
    index: number;
}> = ({ annotation, index }) => {
    const { labels } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })
    const audio = useAudio()
    const focusedLabel = useAppSelector(selectFocusLabel)
    const updateAnnotation = useUpdateAnnotation()
    const removeAnnotation = useRemoveAnnotation()

    const play = useCallback(() => {
        audio.play(annotation.startTime ?? undefined, annotation.endTime ?? undefined)
    }, [ audio, annotation ])

    const updateLabel = useCallback((label: LabelFragment) => {
        updateAnnotation(annotation, { label: label.name })
    }, [ annotation, updateAnnotation ]);

    const remove = useCallback(() => {
        removeAnnotation(annotation)
    }, [ annotation, removeAnnotation ]);

    return <Fragment>
        {/* Play annotation button */ }
        <Popover.Root>
            <Popover.Trigger annotationColorIndex={ index } onClick={ play }>
                <Play weight="Linear" size={ 20 }/>
            </Popover.Trigger>
            <Popover.Content>Play the audio of the annotation</Popover.Content>
        </Popover.Root>

        {/* Comment info */ }
        { (annotation.comments && annotation.comments.length > 0) ?
            <ChatLine weight="Bold" size={ 20 }/> :
            <ChatSquare weight="Linear" size={ 20 }/> }

        {/* Label */ }
        <p>{ annotation.update?.label ?? annotation.label }</p>

        {/* Update label button */ }
        <Dialog.Root>
            <Dialog.Trigger render={ <div/> } nativeButton={ false }>
                <Popover.Root>
                    <Popover.Trigger annotationColorIndex={ index } data-testid="update-box">
                        <SortHorizontal weight="Linear" size={ 20 }/>
                    </Popover.Trigger>
                    <Popover.Content>Update the label</Popover.Content>
                </Popover.Root>
            </Dialog.Trigger>
            <Dialog.Portal>
                <LabelDialog.Update availableLabels={ labels }
                                    selected={ labels.find(l => l.name === focusedLabel) }
                                    onSelect={ updateLabel }/>
            </Dialog.Portal>
        </Dialog.Root>

        {/* Remove button */ }
        <Popover.Root>
            <Popover.Trigger annotationColorIndex={ index }
                             data-testid="remove-box"
                             onMouseDown={ e => e.stopPropagation() }
                             onClick={ remove }>
                <TrashBinTrash weight="Linear" size={ 20 }/>
            </Popover.Trigger>
            <Popover.Content><Kbd keys="delete"/> Remove the annotation</Popover.Content>
        </Popover.Root>
    </Fragment>
}
