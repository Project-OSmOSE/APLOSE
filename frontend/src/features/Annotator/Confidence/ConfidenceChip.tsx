import React, { useCallback, useMemo } from 'react';
import { IonChip, IonIcon } from '@ionic/react';
import styles from './styles.module.scss';
import { checkmarkOutline } from 'ionicons/icons/index.js';
import { useAnnotatorConfidence } from './hooks';
import { useAnnotatorAnnotation } from '@/features/Annotator/Annotation';

export const ConfidenceChip: React.FC<{ confidence: string }> = ({ confidence }) => {
  const { focusedAnnotation, updateAnnotation } = useAnnotatorAnnotation()
  const { focusedConfidence, focus } = useAnnotatorConfidence()
  const isActive = useMemo<boolean>(() => focusedConfidence === confidence, [ focusedConfidence, confidence ]);

  const select = useCallback(() => {
    if (focusedAnnotation) return updateAnnotation(focusedAnnotation, { confidence })
    focus(confidence)
  }, [ focusedAnnotation, updateAnnotation, confidence, focus ])

  return <IonChip color="primary"
                  onClick={ select }
                  className={ isActive ? styles.active : 'void' }> {/* 'void' className need to be sure the className change when item is not active anymore */ }
    { confidence }
    { isActive && <IonIcon src={ checkmarkOutline } color="light"/> }
  </IonChip>
}
