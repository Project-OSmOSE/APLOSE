import React, { Fragment, useMemo } from "react";
import styles from "./styles.module.scss";
import { IoAnalyticsOutline, IoChevronForwardOutline, IoPricetagOutline, IoTimeOutline } from "react-icons/io5";
import { formatTime } from "@/service/function";
import { FaHandshake } from "react-icons/fa6";
import { useAnnotatorAnnotations } from "@/features/Annotator";
import { AnnotationLabelNode, AnnotationNode, AnnotationType, ConfidenceNode } from "@/features/_utils_/gql/types.generated.ts";

export const LabelInfo: React.FC<Pick<AnnotationNode, 'pk' | 'type'> & {
  label: Pick<AnnotationLabelNode, 'name'>
}> = ({ pk, type, label }) => {
  const { getAnnotationUpdate } = useAnnotatorAnnotations()

  const correctedLabel = useMemo(() => {
    if (getAnnotationUpdate({ pk })?.label.name !== label.name) return getAnnotationUpdate({ pk })?.label.name;
    return undefined
  }, [ getAnnotationUpdate, pk, label ])

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

export const TimeInfo: React.FC<Pick<AnnotationNode, 'pk' | 'type' | 'startTime' | 'endTime'>> = ({
                                                                                                    pk,
                                                                                                    type,
                                                                                                    startTime,
                                                                                                    endTime
                                                                                                  }) => {
  const { getAnnotationUpdate } = useAnnotatorAnnotations()

  const correctedStartTime = useMemo(() => {
    if (getAnnotationUpdate({ pk })?.startTime !== startTime) return getAnnotationUpdate({ pk })?.startTime;
    return undefined
  }, [ getAnnotationUpdate, pk, startTime ])

  const correctedEndTime = useMemo(() => {
    if (getAnnotationUpdate({ pk })?.endTime !== endTime) return getAnnotationUpdate({ pk })?.endTime;
    return undefined
  }, [ getAnnotationUpdate, pk, endTime ])

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

export const FrequencyInfo: React.FC<Pick<AnnotationNode, 'pk' | 'type' | 'startFrequency' | 'endFrequency'>> = ({
                                                                                                                   pk,
                                                                                                                   type,
                                                                                                                   startFrequency,
                                                                                                                   endFrequency
                                                                                                                 }) => {
  const { getAnnotationUpdate } = useAnnotatorAnnotations()

  const correctedStartFrequency = useMemo(() => {
    if (getAnnotationUpdate({ pk })?.startFrequency !== startFrequency) return getAnnotationUpdate({ pk })?.startFrequency;
    return undefined
  }, [ getAnnotationUpdate, pk, startFrequency ])
  const correcteEndFrequency = useMemo(() => {
    if (getAnnotationUpdate({ pk })?.endFrequency !== endFrequency) return getAnnotationUpdate({ pk })?.endFrequency;
    return undefined
  }, [ getAnnotationUpdate, pk, endFrequency ])

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
