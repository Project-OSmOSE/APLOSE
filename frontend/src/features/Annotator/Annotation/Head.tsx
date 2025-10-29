import React, { Fragment, useCallback, useEffect, useRef } from 'react';
import { Kbd, TooltipOverlay, useModal } from '@/components/ui';
import { IoChatbubbleEllipses, IoChatbubbleOutline, IoPlayCircle, IoSwapHorizontal, IoTrashBin } from 'react-icons/io5';
import styles from './styles.module.scss';
import { useAudio } from '@/features/Audio';
import { UpdateLabelModal } from '@/features/Labels';
import { KEY_DOWN_EVENT, useEvent } from '@/features/UX/Events';
import type { Annotation } from './slice';
import { useAnnotatorLabel } from '@/features/Annotator/Label';
import { useAnnotatorAnnotation } from '@/features/Annotator/Annotation/hooks';

export const AnnotationHeadContent: React.FC<{
  annotation: Annotation,
}> = ({ annotation }) => {
  const audio = useAudio()
  const labelUpdateModal = useModal()
  const { focusedLabel } = useAnnotatorLabel()
  const { updateAnnotation, removeAnnotation } = useAnnotatorAnnotation()
  const annotationRef = useRef<Annotation>(annotation);
  useEffect(() => {
    annotationRef.current = annotation;
  }, [ annotation ]);

  const play = useCallback(() => {
    audio.play(annotation.startTime ?? undefined, annotation.endTime ?? undefined)
  }, [ audio.play, annotation ])

  const updateLabel = useCallback((label: string) => {
    if (!annotation) return;
    updateAnnotation(annotation, { label })
  }, [ annotation, updateAnnotation ]);

  const remove = useCallback(() => {
    if (!annotation) return;
    removeAnnotation(annotation)
  }, [ annotation, removeAnnotation ]);

  const onKbdEvent = useCallback((event: KeyboardEvent) => {
    switch (event.code) {
      case 'Delete':
        removeAnnotation(annotationRef.current)
        break;
    }
  }, [ removeAnnotation ])
  useEvent(KEY_DOWN_EVENT, onKbdEvent);

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
      {/* 'update-box' class is for playwright tests*/ }
      <IoSwapHorizontal className={ [ styles.button, 'update-box' ].join(' ') }
                        onClick={ labelUpdateModal.open }/>
    </TooltipOverlay>
    <UpdateLabelModal isModalOpen={ labelUpdateModal.isOpen }
                      onClose={ labelUpdateModal.close }
                      selected={ focusedLabel }
                      onUpdate={ updateLabel }/>

    {/* Remove button */ }
    <TooltipOverlay tooltipContent={ <p><Kbd keys="delete"/> Remove the annotation</p> }>
      {/* 'remove-box' class is for playwright tests*/ }
      <IoTrashBin className={ [ styles.button, 'remove-box' ].join(' ') } onClick={ remove }/>
    </TooltipOverlay>

  </Fragment>
}
