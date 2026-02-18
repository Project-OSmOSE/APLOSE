import React, { Fragment, useCallback } from 'react';
import { Kbd, TooltipOverlay, useModal } from '@/components/ui';
import { IoChatbubbleEllipses, IoChatbubbleOutline, IoPlayCircle, IoSwapHorizontal, IoTrashBin } from 'react-icons/io5';
import styles from './styles.module.scss';
import { useAudio } from '@/features/Audio';
import { UpdateLabelModal } from '@/features/Labels';
import type { Annotation } from './slice';
import { useRemoveAnnotation, useUpdateAnnotation } from '@/features/Annotator/Annotation/hooks';
import { useAppSelector } from '@/features/App';
import { selectFocusLabel } from '@/features/Annotator/Label';

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
        <TooltipOverlay tooltipContent={ <p>Play the audio of the annotation</p> }>
            <IoPlayCircle className={ styles.button } onClick={ play }/>
        </TooltipOverlay>

        {/* Comment info */ }
        { (annotation.comments && annotation.comments.length > 0) ?
            <IoChatbubbleEllipses/> :
            <TooltipOverlay tooltipContent={ <p>No comments</p> }>
                <IoChatbubbleOutline className={ styles.outlineIcon }/>
            </TooltipOverlay> }

        {/* Label */ }
        <p>{ annotation.update?.label ?? annotation.label }</p>

        {/* Update label button */ }
        <TooltipOverlay tooltipContent={ <p>Update the label</p> }>
            <IoSwapHorizontal className={ styles.button }
                              data-testid="update-box"
                              onClick={ labelUpdateModal.open }/>
        </TooltipOverlay>

        {/* Remove button */ }
        <TooltipOverlay tooltipContent={ <p><Kbd keys="delete"/> Remove the annotation</p> }>
            <IoTrashBin className={ styles.button }
                        data-testid="remove-box"
                        onClick={ remove }/>
        </TooltipOverlay>

        { labelUpdateModal.element }
    </Fragment>
}
