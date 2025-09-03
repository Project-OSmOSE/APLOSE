import React, { Fragment, MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from '../../styles.module.scss';
import { ExtendedDiv } from '@/components/ui/ExtendedDiv';
import { IoChatbubbleEllipses, IoChatbubbleOutline, IoPlayCircle, IoSwapHorizontal, IoTrashBin } from 'react-icons/io5';
import { Kbd, TooltipOverlay } from "@/components/ui";
import { KEY_DOWN_EVENT, useEvent } from "@/service/events";
import { AnnotationLabelUpdateModal } from "../../modal";
import {
  Annotation,
  useAnnotatorAnnotations,
  useAnnotatorAudio,
  useAnnotatorQuery,
  useCommentsForAnnotator
} from "@/features/Annotator";

export const AnnotationHeader: React.FC<{
  active: boolean;
  top: number;
  onTopMove?(value: number): void;
  onLeftMove?(value: number): void;
  onValidateMove?(): void;
  setIsMouseHover?: (isMouseHover: boolean) => void;
  className?: string;
  annotation: Annotation,
  audioPlayer: MutableRefObject<HTMLAudioElement | null>;
}> = ({ active, top, onTopMove, onLeftMove, setIsMouseHover, onValidateMove, className, annotation, audioPlayer }) => {
  const { data } = useAnnotatorQuery();
  const { focus, getAnnotationUpdate } = useAnnotatorAnnotations()

  const _setIsMouseHover = useCallback((value: boolean) => {
    if (!setIsMouseHover) return;
    setIsMouseHover(value);
  }, [ setIsMouseHover, ])
  const finalAnnotation = useMemo(() => getAnnotationUpdate(annotation) ?? annotation, [ annotation, getAnnotationUpdate ])

  const headerStickSideClass = useMemo(() => {
    if (!data?.spectrogramById || annotation.type === 'Weak') return ''
    const end = annotation.type === 'Box' ? annotation.endTime! : annotation.startTime!;
    if (end > (data.spectrogramById.duration! * 0.9))
      return styles.stickRight
    if (annotation.startTime! < (data.spectrogramById.duration! * 0.1))
      return styles.stickLeft
    return ''
  }, [ annotation, data ])

  return <ExtendedDiv draggable={ active }
                      onTopMove={ onTopMove } onLeftMove={ onLeftMove }
                      onUp={ onValidateMove }
                      onMouseEnter={ () => _setIsMouseHover(true) }
                      onMouseMove={ () => _setIsMouseHover(true) }
                      onMouseLeave={ () => _setIsMouseHover(false) }
                      className={ [ styles.header, headerStickSideClass, className, top < 24 ? styles.bellow : styles.over ].join(' ') }
                      innerClassName={ styles.inner }
                      onClick={ () => focus(annotation) }>

    <PlayButton annotation={ annotation } audioPlayer={ audioPlayer }/>

    <CommentInfo annotation={ annotation }/>

    <p>{ finalAnnotation.label.name }</p>

    <UpdateLabelButton annotation={ annotation }/>

    <TrashButton annotation={ annotation }/>

  </ExtendedDiv>
}

export const PlayButton: React.FC<{
  audioPlayer: MutableRefObject<HTMLAudioElement | null>;
  annotation: Annotation;
}> = ({ annotation, audioPlayer }) => {
  const { play } = useAnnotatorAudio(audioPlayer);
  return (
    <TooltipOverlay tooltipContent={ <p>Play the audio of the annotation</p> }>
      <IoPlayCircle className={ styles.button } onClick={ () => play(annotation) }/>
    </TooltipOverlay>
  )
}

export const CommentInfo: React.FC<{ annotation: Annotation; }> = ({ annotation }) => {
  const { getCommentForAnnotation } = useCommentsForAnnotator()
  const comment = useMemo(() => getCommentForAnnotation(annotation), [ getCommentForAnnotation, annotation ]);
  if (comment) return <IoChatbubbleEllipses/>
  else return (
    <TooltipOverlay tooltipContent={ <p>No comments</p> }><IoChatbubbleOutline
      className={ styles.outlineIcon }/></TooltipOverlay>
  )
}

export const UpdateLabelButton: React.FC<{ annotation: Annotation; }> = ({ annotation }) => {
  const [ isModalOpen, setIsModalOpen ] = useState<boolean>(false);
  const { focus } = useAnnotatorAnnotations()

  const updateLabel = useCallback(() => {
    focus(annotation);
    setIsModalOpen(true)
  }, [ annotation, focus, setIsModalOpen ])

  return (<Fragment>
      <TooltipOverlay tooltipContent={ <p>Update the label</p> }>
        {/* 'update-box' class is for playwright tests*/ }
        <IoSwapHorizontal className={ [ styles.button, 'update-box' ].join(' ') }
                          onClick={ updateLabel }/>
      </TooltipOverlay>

      <AnnotationLabelUpdateModal isModalOpen={ isModalOpen }
                                  setIsModalOpen={ setIsModalOpen }/>
    </Fragment>
  )
}

export const TrashButton: React.FC<{ annotation: Annotation; }> = ({ annotation }) => {
  const { remove } = useAnnotatorAnnotations()

  const annotationRef = useRef<Annotation>(annotation);
  useEffect(() => {
    annotationRef.current = annotation;
  }, [ annotation ]);

  const onKbdEvent = useCallback((event: KeyboardEvent) => {
    switch (event.code) {
      case 'Delete':
        remove(annotationRef.current)
        break;
    }
  }, [ remove ])
  useEvent(KEY_DOWN_EVENT, onKbdEvent);

  return (
    <TooltipOverlay tooltipContent={ <p><Kbd keys='delete'/> Remove the annotation</p> }>
      {/* 'remove-box' class is for playwright tests*/ }
      <IoTrashBin className={ [ styles.button, 'remove-box' ].join(' ') } onClick={ () => remove(annotation) }/>
    </TooltipOverlay>
  )
}
