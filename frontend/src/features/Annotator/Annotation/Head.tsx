import React, { Fragment, useCallback } from 'react';
import { Kbd, useModal } from '@/components/ui';
import { IoChatbubbleEllipses, IoChatbubbleOutline, IoPlayCircle, IoSwapHorizontal, IoTrashBin } from 'react-icons/io5';
import styles from './styles.module.scss';
import { useAudio } from '@/features/Audio';
import { UpdateLabelModal } from '@/features/Labels';
import type { Annotation } from './slice';
import { useRemoveAnnotation, useUpdateAnnotation } from '@/features/Annotator/Annotation/hooks';
import { useAppSelector } from '@/features/App';
import { selectFocusLabel } from '@/features/Annotator/Label';
import { Popover } from '@/components/base/Popover';

export const AnnotationHeadContent: React.FC<{
    annotation: Annotation,
}> = ({ annotation }) => {
    const audio = useAudio()
    const focusedLabel = useAppSelector(selectFocusLabel)
    const updateAnnotation = useUpdateAnnotation()
    const removeAnnotation = useRemoveAnnotation()

    const play = useCallback(() => {
        audio.play(annotation.startTime ?? undefined, annotation.endTime ?? undefined)
    }, [ audio, annotation ])

    const updateLabel = useCallback((label: string) => {
        updateAnnotation(annotation, { label })
    }, [ annotation, updateAnnotation ]);
    const labelUpdateModal = useModal(UpdateLabelModal, {
        selected: focusedLabel,
        onUpdate: updateLabel,
    })

    const remove = useCallback(() => {
        removeAnnotation(annotation)
    }, [ annotation, removeAnnotation ]);

    return <Fragment>
        {/* Play annotation button */ }
        <Popover.Root>
            <Popover.Trigger>
                <IoPlayCircle className={ styles.button } onClick={ play }/>
            </Popover.Trigger>
            <Popover.Content>Play the audio of the annotation</Popover.Content>
        </Popover.Root>

        {/* Comment info */ }
        { (annotation.comments && annotation.comments.length > 0) ?
            <IoChatbubbleEllipses/> :
            <Popover.Root>
                <Popover.Trigger>
                    <IoChatbubbleOutline className={ styles.outlineIcon }/>
                </Popover.Trigger>
                <Popover.Content>No comments</Popover.Content>
            </Popover.Root> }

        {/* Label */ }
        <p>{ annotation.update?.label ?? annotation.label }</p>

        {/* Update label button */ }
        <Popover.Root>
            <Popover.Trigger>
                <IoSwapHorizontal className={ styles.button }
                                  data-testid="update-box"
                                  onClick={ labelUpdateModal.open }/>
            </Popover.Trigger>
            <Popover.Content>Update the label</Popover.Content>
        </Popover.Root>

        {/* Remove button */ }
        <Popover.Root>
            <Popover.Trigger>
                <IoTrashBin className={ styles.button }
                            data-testid="remove-box"
                            onClick={ remove }/>
            </Popover.Trigger>
            <Popover.Content><Kbd keys="delete"/> Remove the annotation</Popover.Content>
        </Popover.Root>

        { labelUpdateModal.element }
    </Fragment>
}
