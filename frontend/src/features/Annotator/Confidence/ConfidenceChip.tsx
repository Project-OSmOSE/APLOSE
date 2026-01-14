import React, { useCallback, useMemo } from 'react';
import { IonChip, IonIcon } from '@ionic/react';
import styles from './styles.module.scss';
import { checkmarkOutline } from 'ionicons/icons/index.js';
import { selectAnnotation, useUpdateAnnotation } from '@/features/Annotator/Annotation';
import { useAppDispatch, useAppSelector } from '@/features/App';
import { selectFocusConfidence } from '@/features/Annotator/Confidence/selectors';
import { focusConfidence } from '@/features/Annotator/Confidence/slice';

export const ConfidenceChip: React.FC<{ confidence: string }> = ({ confidence }) => {
  const focusedAnnotation = useAppSelector(selectAnnotation)
  const updateAnnotation = useUpdateAnnotation()
  const focusedConfidence = useAppSelector(selectFocusConfidence)
  const isActive = useMemo<boolean>(() => focusedConfidence === confidence, [ focusedConfidence, confidence ]);
  const dispatch = useAppDispatch();

  const select = useCallback(() => {
    if (focusedAnnotation) return updateAnnotation(focusedAnnotation, { confidence })
    dispatch(focusConfidence(confidence))
  }, [ focusedAnnotation, updateAnnotation, confidence, dispatch ])

  return <IonChip color="primary"
                  onClick={ select }
                  data-testid="confidence-chip"
                  className={ isActive ? styles.active : 'void' }> {/* 'void' className need to be sure the className change when item is not active anymore */ }
    { confidence }
    { isActive && <IonIcon src={ checkmarkOutline } color="light"/> }
  </IonChip>
}
