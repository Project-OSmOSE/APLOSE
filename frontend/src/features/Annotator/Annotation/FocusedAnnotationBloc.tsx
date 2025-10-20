import React, { Fragment } from 'react';
import { Bloc } from '@/components/ui';
import styles from './styles.module.scss'
import { useAnnotatorAnnotation } from './hooks';
import { AnnotationLabelInfo } from './AnnotationLabelInfo';
import { AnnotationConfidenceInfo } from './AnnotationConfidenceInfo';
import { AnnotationTimeInfo } from './AnnotationTimeInfo';
import { AnnotationFrequencyInfo } from './AnnotationFrequencyInfo';

export const FocusedAnnotationBloc: React.FC = () => {
  const { focusedAnnotation } = useAnnotatorAnnotation()

  return <Bloc className={ styles.focusedBloc }
               header="Selected annotation"
               centerBody={ !!focusedAnnotation }
               smallSpaces
               vertical
               bodyClassName={ styles.content }>
    { focusedAnnotation ? <Fragment>
      <AnnotationLabelInfo annotation={ focusedAnnotation }/>
      <AnnotationConfidenceInfo annotation={ focusedAnnotation }/>
      <AnnotationTimeInfo annotation={ focusedAnnotation }/>
      <AnnotationFrequencyInfo annotation={ focusedAnnotation }/>
    </Fragment> : <p>-</p> }
  </Bloc>
}
