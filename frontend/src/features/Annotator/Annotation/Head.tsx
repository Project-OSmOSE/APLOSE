import React, { Fragment, useCallback, useMemo } from 'react';
import {
    ChatSquareLinearIcon,
    ChatSquareLineBoldIcon,
    PlayLinearIcon,
    SortHorizontalLinearIcon,
    TrashBinTrashLinearIcon,
} from '@solar-icons/react';
import { useParams } from '@tanstack/react-router';
import { useQuery } from "@tanstack/react-query";
import { Kbd } from '@/components/ui';
import { Dialog, Popover } from '@/components/base';
import { useAudio } from '@/features/Audio';
import { useRemoveAnnotation, useUpdateAnnotation } from '@/features/Annotator/Annotation/hooks';
import { useAppSelector } from '@/features/App';
import { selectFocusLabelId } from '@/features/Annotator/Label';
import { Campaign } from "@/features";
import type { Annotation } from './slice';
import { MxOntology } from "@/features/Mx";

export const AnnotationHeadContent: React.FC<{
    annotation: Annotation,
    index: number;
}> = ({ annotation, index }) => {
    const { campaignID } = useParams({ from: '/_authenticated/annotation-campaign/$campaignID/phase/$phaseType/spectrogram/$spectrogramID' })
    const { data: labels } = useQuery(Campaign.labelsByIdQuery({ id: campaignID }))
    const audio = useAudio()
    const focusedLabelId = useAppSelector(selectFocusLabelId)
    const updateAnnotation = useUpdateAnnotation()
    const removeAnnotation = useRemoveAnnotation()
    const annotationLabel = useMemo(() => {
        return labels?.find(l => l.label.id === (annotation.update?.labelId ?? annotation?.labelId))
    }, [ annotation, labels ])

    const play = useCallback(() => {
        audio.play(annotation.startTime ?? undefined, annotation.endTime ?? undefined)
    }, [ audio, annotation ])

    const updateLabel = useCallback((labelId: string) => {
        updateAnnotation(annotation, { labelId })
    }, [ annotation, updateAnnotation ]);

    const remove = useCallback(() => {
        removeAnnotation(annotation)
    }, [ annotation, removeAnnotation ]);

    return <Fragment>
        {/* Play annotation button */ }
        <Popover.Root>
            <Popover.Trigger annotationColorIndex={ index } onClick={ play }>
                <PlayLinearIcon size={ 20 }/>
            </Popover.Trigger>
            <Popover.Content>Play the audio of the annotation</Popover.Content>
        </Popover.Root>

        {/* Comment info */ }
        { (annotation.comments && annotation.comments.length > 0) ?
            <ChatSquareLineBoldIcon size={ 20 }/> :
            <ChatSquareLinearIcon size={ 20 }/> }

        {/* Label */ }
        <p>{ annotationLabel?.label.preferredDisplay }</p>

        {/* Update label button */ }
        <Dialog.Root>
            <Dialog.Trigger render={ <div/> } nativeButton={ false }>
                <Popover.Root>
                    <Popover.Trigger annotationColorIndex={ index } data-testid="update-box">
                        <SortHorizontalLinearIcon size={ 20 }/>
                    </Popover.Trigger>
                    <Popover.Content>Update the label</Popover.Content>
                </Popover.Root>
            </Dialog.Trigger>
            <Dialog.Portal>
                <MxOntology.UpdateLabelDialogContent availableLabels={ labels?.map(l => l.label) ?? [] }
                                                     selectedID={ focusedLabelId }
                                                     onSelectID={ updateLabel }/>
            </Dialog.Portal>
        </Dialog.Root>

        {/* Remove button */ }
        <Popover.Root>
            <Popover.Trigger annotationColorIndex={ index }
                             data-testid="remove-box"
                             onMouseDown={ e => e.stopPropagation() }
                             onClick={ remove }>
                <TrashBinTrashLinearIcon size={ 20 }/>
            </Popover.Trigger>
            <Popover.Content><Kbd keys="delete"/> Remove the annotation</Popover.Content>
        </Popover.Root>
    </Fragment>
}
