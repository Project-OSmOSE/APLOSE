import React, { Fragment, useMemo } from "react";
import styles from "./styles.module.scss";
import { IoAnalyticsOutline, IoChevronForwardOutline, IoPricetagOutline, IoTimeOutline } from "react-icons/io5";
import { formatTime } from "@/service/function";
import { FaHandshake } from "react-icons/fa6";
import { useAnnotatorAnnotations } from "@/features/Annotator";
import { AnnotationLabelNode, AnnotationNode, AnnotationType, ConfidenceNode } from "@/features/gql/types.generated.ts";

export const LabelInfo: React.FC<Pick<AnnotationNode, 'id' | 'type'> & {
  label: Pick<AnnotationLabelNode, 'name'>
}> = ({ id, type, label }) => {
  const { correctedAnnotation } = useAnnotatorAnnotations(id)

  const correctedLabel = useMemo(() => {
    if (correctedAnnotation?.label.name !== label.name) return correctedAnnotation?.label.name;
    return undefined
  }, [ correctedAnnotation, id, label ])

  return <div className={ styles.bounds }>
    <IoPricetagOutline className={ styles.mainIcon }/>

    <p className={ correctedLabel ? 'disabled' : undefined }>
      { label.name }
      <span>{ type === AnnotationType.Weak ? ` (Weak)` : '' }</span>
    </p>

    { correctedLabel && <p>{ correctedLabel }</p> }
  </div>
}

export const ConfidenceInfo: React.FC<{
  confidence?: Pick<ConfidenceNode, 'label'> | null
}> = ({ confidence }) => (
  <div className={ styles.bounds }>
    <FaHandshake className={ styles.mainIcon }/>
    <p>{ confidence ? confidence.label : '-' }</p>
  </div>
)

export const TimeInfo: React.FC<Pick<AnnotationNode, 'id' | 'type' | 'startTime' | 'endTime'>> = ({
                                                                                                    id,
                                                                                                    type,
                                                                                                    startTime,
                                                                                                    endTime
                                                                                                  }) => {
  const { correctedAnnotation } = useAnnotatorAnnotations(id)

  const correctedStartTime = useMemo(() => {
    if (correctedAnnotation?.startTime !== correctedAnnotation) return correctedAnnotation?.startTime;
    return undefined
  }, [ correctedAnnotation, id, startTime ])
  const correctedEndTime = useMemo(() => {
    if (correctedAnnotation?.endTime !== endTime) return correctedAnnotation?.endTime;
    return undefined
  }, [ correctedAnnotation, id, endTime ])
  const isCorrected = useMemo(() => correctedStartTime || correctedEndTime, [ correctedStartTime, correctedEndTime ])

  if (type === AnnotationType.Weak) return <Fragment/>
  return <div className={ styles.bounds }>
    <IoTimeOutline className={ styles.mainIcon }/>

    <p className={ isCorrected ? 'disabled' : undefined }>
      { formatTime(startTime!, true) }
      { type === AnnotationType.Box && <Fragment>
          &nbsp;<IoChevronForwardOutline/> { formatTime(endTime!, true) }
      </Fragment> }
    </p>

    { isCorrected && <p>
      { formatTime(correctedStartTime ?? startTime!, true) }
      { type === AnnotationType.Box && <Fragment>
          &nbsp;<IoChevronForwardOutline/> { formatTime(correctedEndTime ?? endTime!, true) }
      </Fragment> }
    </p> }
  </div>
}

export const FrequencyInfo: React.FC<Pick<AnnotationNode, 'id' | 'type' | 'startFrequency' | 'endFrequency'>> = ({
                                                                                                                   id,
                                                                                                                   type,
                                                                                                                   startFrequency,
                                                                                                                   endFrequency
                                                                                                                 }) => {
  const { correctedAnnotation } = useAnnotatorAnnotations(id)

  const correctedStartFrequency = useMemo(() => {
    if (correctedAnnotation?.startFrequency !== startFrequency) return correctedAnnotation?.startFrequency;
    return undefined
  }, [ correctedAnnotation, id, startFrequency ])
  const correcteEndFrequency = useMemo(() => {
    if (correctedAnnotation?.endFrequency !== endFrequency) return correctedAnnotation?.endFrequency;
    return undefined
  }, [ correctedAnnotation, id, endFrequency ])

  const isCorrected = useMemo(() => correctedStartFrequency || correcteEndFrequency, [ correctedStartFrequency, correcteEndFrequency ])

  if (type === AnnotationType.Weak) return <Fragment/>
  return <div className={ styles.bounds }>
    <IoAnalyticsOutline className={ styles.mainIcon }/>

    <p className={ isCorrected ? 'disabled' : undefined }>
      { startFrequency!.toFixed(2) }Hz
      { type === AnnotationType.Box && <Fragment>
          &nbsp;<IoChevronForwardOutline/> { endFrequency!.toFixed(2) }Hz
      </Fragment> }
    </p>

    { isCorrected && <p>
      { (correctedStartFrequency ?? startFrequency!).toFixed(2) }Hz
      { type === AnnotationType.Box && <Fragment>
          &nbsp;<IoChevronForwardOutline/> { (correcteEndFrequency ?? endFrequency!).toFixed(2) }Hz
      </Fragment> }
    </p> }
  </div>
}
