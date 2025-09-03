import React, { Fragment, MutableRefObject, useMemo } from "react";
import { Box } from "./Box";
import { Point } from './Point';
import { Annotation as _Annotation, useAnnotatorAnnotations, useAnnotatorUI } from "@/features/Annotator";
import { AnnotationType } from "@/features/gql/types.generated.ts";

export const Annotation: React.FC<{
  annotation: _Annotation,
  audioPlayer: MutableRefObject<HTMLAudioElement | null>;
}> = ({ annotation, audioPlayer }) => {
  const { hiddenLabels } = useAnnotatorUI()
  const { getAnnotationUpdate } = useAnnotatorAnnotations()

  const isHidden = useMemo(() => {
    if (hiddenLabels.includes(annotation.label.name)) return true
    // Hide invalidated annotations that hasn't been corrected
    if (getAnnotationUpdate(annotation)) return false;
    return annotation.validations?.results.some(v => v?.isValid)
  }, [ hiddenLabels, annotation, getAnnotationUpdate ])
  if (isHidden) return <Fragment/>
  return <Fragment>
    { annotation.type === AnnotationType.Box && <Box annotation={ annotation } audioPlayer={ audioPlayer }/> }
    { annotation.type === AnnotationType.Point && <Point annotation={ annotation } audioPlayer={ audioPlayer }/> }
  </Fragment>
}