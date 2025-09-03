import React, { Fragment, MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from './styles.module.scss';
import { IonButton, IonIcon, IonNote } from "@ionic/react";
import { checkmarkOutline, closeOutline } from "ionicons/icons";
import { IoChatbubbleEllipses, IoChatbubbleOutline } from 'react-icons/io5';
import { RiRobot2Fill, RiUser3Fill } from 'react-icons/ri';
import { Button, Modal, ModalHeader, Table, TableContent, TableDivider } from "@/components/ui";
import { createPortal } from "react-dom";
import { useRetrieveCurrentCampaign } from "@/service/api/campaign.ts";
import { useRetrieveCurrentPhase } from "@/service/api/campaign-phase.ts";
import { UserAPI } from "@/service/api/user.ts";
import { ConfidenceInfo, FrequencyInfo, LabelInfo, TimeInfo } from "./Annotation";
import { AnnotationLabelUpdateModal } from "../modal";
import { Annotation, useAnnotatorAnnotations } from "@/features/Annotator";
import {
  AnnotationLabelNode,
  AnnotationNode,
  AnnotationPhaseType,
  AnnotationType,
  AnnotationValidationNode,
  ConfidenceNode,
  DetectorNode,
  UserNode
} from "@/features/gql/types.generated.ts";
import { useCommentsForAnnotator } from "@/features/Annotator/hooks/comments.hook.ts";


export const Annotations: React.FC<{
  onSelect: (annotation: Annotation) => void;
}> = ({ onSelect }) => {
  const { annotations } = useAnnotatorAnnotations();

  const sortedAnnotations = useMemo(() => {
    // Need the spread to sort this readonly array
    return [ ...(annotations ?? []) ].sort((a, b) => {
      if (a.label.name !== b.label.name) {
        return a.label.name.localeCompare(b.label.name);
      }
      return (a.startTime ?? 0) - (b.startTime ?? 0);
    })
  }, [ annotations ])

  // 'results' class is for playwright tests
  return <div className={ [ styles.bloc, styles.results, 'results' ].join(' ') }>
    <h6 className={ styles.header }>Annotations</h6>
    <div className={ [ styles.body, styles.vertical ].join(' ') }>

      { sortedAnnotations.length > 0 && <Table columns={ 10 }>
        { sortedAnnotations.map((a, index) => <Fragment key={ index }>
          { index > 0 && <TableDivider/> }
          <AnnotationRow annotation={ a } onSelect={ onSelect }/>
        </Fragment>) }
      </Table> }

      { sortedAnnotations.length === 0 && <IonNote color="medium">No results</IonNote> }
    </div>
  </div>
}

const AnnotationRow: React.FC<{
  annotation: Annotation;
  onSelect: (annotation: Annotation) => void;
}> = ({ annotation, onSelect }) => {
  const { annotationID, focus } = useAnnotatorAnnotations();
  const isActive = useMemo(() => annotation.id === annotationID ? styles.active : undefined, [ annotation.id, annotationID ])
  const onClick = useCallback(() => {
    focus(annotation)
    onSelect(annotation)
  }, [ focus, annotation ])

  const params: ResultItemProps = { className: [ styles.item, isActive ].join(' '), onClick }
  return <Fragment>
    <ResultLabelInfo { ...annotation } { ...params }/>
    <ResultTimeInfo { ...annotation } { ...params }/>
    <ResultFrequencyInfo { ...annotation } { ...params }/>
    <ResultConfidenceInfo { ...annotation } { ...params }/>
    <ResultDetectorInfo { ...annotation } { ...params }/>
    <ResultCommentInfo { ...annotation } { ...params }/>
    <ResultValidationButton { ...annotation } { ...params }/>
  </Fragment>
}

type ResultItemProps = {
  className?: string;
  onClick: () => void;
}

const ResultTimeInfo: React.FC<Pick<AnnotationNode, 'id' | 'type' | 'startTime' | 'endTime'> & ResultItemProps> = ({
                                                                                                                     className,
                                                                                                                     onClick,
                                                                                                                     ...annotation
                                                                                                                   }) => {
  if (annotation.type === AnnotationType.Weak) return <Fragment/>
  return <TableContent className={ className } onClick={ onClick }>
    <TimeInfo { ...annotation }/>
  </TableContent>
}

const ResultFrequencyInfo: React.FC<Pick<AnnotationNode, 'id' | 'type' | 'startFrequency' | 'endFrequency'> & ResultItemProps> = ({
                                                                                                                                    className,
                                                                                                                                    onClick,
                                                                                                                                    ...annotation
                                                                                                                                  }) => {
  if (annotation.type === AnnotationType.Weak) return <Fragment/>
  return <TableContent className={ className } onClick={ onClick }>
    <FrequencyInfo { ...annotation }/>
  </TableContent>
}

const ResultLabelInfo: React.FC<Pick<AnnotationNode, 'id' | 'type'> & {
  label: Pick<AnnotationLabelNode, 'name'>
} & ResultItemProps> = ({ className, onClick, ...annotation }) => (
  <TableContent
    className={ [ className, annotation.type === AnnotationType.Weak ? styles.presenceLabel : styles.strongLabel ].join(' ') }
    isFirstColumn={ true }
    onClick={ onClick }>
    <LabelInfo { ...annotation }/>
  </TableContent>
)

const ResultConfidenceInfo: React.FC<{
  confidence?: Pick<ConfidenceNode, 'label'> | null
} & ResultItemProps> = ({ className, onClick, ...annotation }) => {
  const { campaign } = useRetrieveCurrentCampaign()
  if (!campaign?.confidence_set) return <Fragment/>
  return (
    <TableContent className={ className } onClick={ onClick }>
      <ConfidenceInfo { ...annotation }/>
    </TableContent>
  )
}

const ResultDetectorInfo: React.FC<{
  annotator?: Pick<UserNode, 'id' | 'displayName'> | null,
  detectorConfiguration?: {
    detector: Pick<DetectorNode, 'name'>
  } | null,
} & ResultItemProps> = ({ className, onClick, detectorConfiguration, annotator }) => {
  const { phaseType } = useRetrieveCurrentPhase()
  const { data: user } = UserAPI.endpoints.getCurrentUser.useQuery()
  if (phaseType === AnnotationPhaseType.Annotation) return <Fragment/>
  if (detectorConfiguration) return <TableContent className={ className } onClick={ onClick }>
    <RiRobot2Fill/>
    <p>{ detectorConfiguration.detector.name }</p>
  </TableContent>
  return <TableContent className={ [ className, annotator === user?.id ? 'disabled' : '' ].join(' ') }
                       onClick={ onClick }>
    <RiUser3Fill/>
    <p>{ user?.display_name }</p>
  </TableContent>
}

const ResultCommentInfo: React.FC<Pick<AnnotationNode, 'id'> & ResultItemProps> = ({ id, className, onClick }) => {
  const { allComments } = useCommentsForAnnotator()
  const comments = useMemo(() => {
    return allComments.filter(c => c.annotationId === id) ?? []
  }, [ allComments, id ])
  return (
    <TableContent className={ className } onClick={ onClick }>
      { comments.length > 0 ? <IoChatbubbleEllipses/> : <IoChatbubbleOutline/> }
    </TableContent>
  )
}

const ResultValidationButton: React.FC<Pick<AnnotationNode, 'id' | 'type'> & {
  label: Pick<AnnotationLabelNode, 'name'>;
  confidence?: Pick<ConfidenceNode, 'label'> | null;
  annotator?: Pick<UserNode, 'id'> | null,
  validations?: {
    results: Array<Pick<AnnotationValidationNode, 'id' | 'isValid'> | null>
  } | null,
} & ResultItemProps> = ({ className, onClick, ...annotation }) => {
  const [ isModalOpen, setIsModalOpen ] = useState<boolean>(false);
  const [ isLabelModalOpen, setIsLabelModalOpen ] = useState<boolean>(false);
  const { phaseType } = useRetrieveCurrentPhase()
  const { data: user } = UserAPI.endpoints.getCurrentUser.useQuery()
  const validation = useMemo(() => {
    if (!annotation.validations?.results || annotation.validations.results.filter(v => v !== null).length === 0) return true;
    else return annotation.validations.results.some(v => v?.isValid);
  }, [ annotation.validations ]);
  const { validate, invalidate, focus } = useAnnotatorAnnotations()

  const annotationRef = useRef(annotation)
  useEffect(() => {
    annotationRef.current = annotation;
  }, [ annotation ]);

  const onValidate = useCallback((event: MouseEvent) => {
    event.stopPropagation()
    validate(annotation);
  }, [ annotation ]);

  const move = useCallback(() => {
    setIsModalOpen(false);
    focus(annotationRef.current)
  }, [ setIsModalOpen, focus ]);

  const updateLabel = useCallback(() => {
    setIsModalOpen(false);
    focus(annotation);
    setIsLabelModalOpen(true)
  }, [ setIsModalOpen, focus, annotation, setIsLabelModalOpen ]);

  const remove = useCallback(() => {
    setIsModalOpen(false);
    invalidate(annotationRef.current)
  }, [ setIsModalOpen, invalidate ]);

  const onInvalidate = useCallback((event: MouseEvent) => {
    event.stopPropagation()
    if (annotation.type === 'Weak') remove()
    else setIsModalOpen(true)
  }, [ annotation, remove ]);

  if (phaseType !== AnnotationPhaseType.Verification) return <Fragment/>
  if (annotation.annotator?.id === user?.id) return <TableContent className={ className } onClick={ onClick }/>
  return <TableContent className={ className } onClick={ onClick }>
    <IonButton className="validate"
               color={ validation ? 'success' : 'medium' }
               fill={ validation ? 'solid' : 'outline' }
               onClick={ onValidate }>
      <IonIcon slot="icon-only" icon={ checkmarkOutline }/>
    </IonButton>
    <IonButton className="invalidate"
               color={ validation ? 'medium' : 'danger' }
               fill={ validation ? 'outline' : 'solid' }
               onClick={ onInvalidate }>
      <IonIcon slot="icon-only" icon={ closeOutline }/>
    </IonButton>

    { isModalOpen && createPortal(<Modal className={ styles.invalidateModal } onClose={ () => setIsModalOpen(false) }>
      <ModalHeader title="Invalidate a result" onClose={ () => setIsModalOpen(false) }/>
      <h5>Why do you want to invalidate this result?</h5>

      <div>
        { annotation.type !== AnnotationType.Weak && <Fragment>
            <p>The position or dimension of the annotation is incorrect</p>
            <Button fill='outline' onClick={ move }>
                Move or resize
            </Button>
        </Fragment> }
      </div>
      <div>
        <p>The label is incorrect</p>
        <Button fill='outline' onClick={ updateLabel }>
          Change the label
        </Button>
      </div>
      <div>
        <p>The annotation shouldn't exist</p>
        <Button fill='outline' onClick={ remove }>
          Remove
        </Button>
      </div>

    </Modal>, document.body) }

    { isLabelModalOpen && <AnnotationLabelUpdateModal isModalOpen={ isLabelModalOpen }
                                                      setIsModalOpen={ setIsLabelModalOpen }/> }
  </TableContent>
}
