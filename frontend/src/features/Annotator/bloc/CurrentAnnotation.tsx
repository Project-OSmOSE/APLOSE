import React, { Fragment, useMemo } from "react";
import styles from './styles.module.scss';
import { IonNote } from "@ionic/react";
import { ConfidenceInfo, FrequencyInfo, LabelInfo, TimeInfo } from "./Annotation";
import { selectAnnotationID, selectAnnotations, useAnnotatorAnnotations } from "@/features/Annotator";
import { useAppSelector } from "@/service/app.ts";


export const CurrentAnnotation: React.FC = () => {
  const annotations = useAppSelector(selectAnnotations);
  const annotationID = useAppSelector(selectAnnotationID);
  const { annotation } = useAnnotatorAnnotations()

  const isRemoved = useMemo(() => {
    if (!annotationID) return false;
    if (!annotation?.validations) return false;
    if (annotations.some(a => a.isUpdateOfId === annotationID)) return false;
    return annotation.validations?.results.some(v => !v?.isValid)
  }, [ annotationID, annotation, annotations ])

  return (
    <div className={ [ styles.bloc, styles.current ].join(' ') }>
      <h6 className={ styles.header }>Selected annotation</h6>
      <div
        className={ [ styles.body, styles.small, styles.vertical, annotation ? styles.currentAnnotation : styles.empty ].join(' ') }>
        { !annotation && <p>-</p> }

        { annotation && <Fragment>

          { isRemoved && <IonNote>You removed this annotation</IonNote> }

            <LabelInfo { ...annotation }/>
            <ConfidenceInfo { ...annotation }/>
            <TimeInfo { ...annotation }/>
            <FrequencyInfo { ...annotation }/>

        </Fragment> }
      </div>
    </div>
  )
}
