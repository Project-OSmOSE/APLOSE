import React, { Fragment, MouseEvent, useCallback, useMemo } from 'react';
import { IonChip, IonIcon } from '@ionic/react';
import { checkmarkOutline, closeCircle, eyeOffOutline, eyeOutline } from 'ionicons/icons/index.js';
import styles from './styles.module.scss';
import { Kbd, TooltipOverlay } from '@/components/ui';
import {
  focusAnnotation,
  selectAllAnnotations,
  selectAnnotation,
  useAddAnnotation,
  useGetAnnotation,
  useRemoveAnnotation,
  useUpdateAnnotation,
} from '@/features/Annotator/Annotation';
import { AnnotationType } from '@/api';
import { useKeyDownEvent } from '@/features/UX';
import { selectFocusConfidence } from '@/features/Annotator/Confidence';
import { useAppDispatch, useAppSelector } from '@/features/App';
import { setHiddenLabels } from './slice';
import { selectAllLabels, selectFocusLabel, selectHiddenLabels } from './selectors';

export const AlphanumericKeys = [
  [ '&', 'é', '"', '\'', '(', '-', 'è', '_', 'ç' ],
  [ '1', '2', '3', '4', '5', '6', '7', '8', '9' ],
];

export const LabelChip: React.FC<{
  label: string;
}> = ({ label }) => {
  const allLabels = useAppSelector(selectAllLabels)
  const focusedLabel = useAppSelector(selectFocusLabel)
  const hiddenLabels = useAppSelector(selectHiddenLabels)
  const focusedConfidence = useAppSelector(selectFocusConfidence)
  const addAnnotation = useAddAnnotation()
  const updateAnnotation = useUpdateAnnotation()
  const focusedAnnotation = useAppSelector(selectAnnotation)
  const allAnnotations = useAppSelector(selectAllAnnotations)
  const getAnnotation = useGetAnnotation()
  const removeAnnotation = useRemoveAnnotation()
  const index = useMemo(() => allLabels.indexOf(label), [ allLabels, label ])
  const className = useMemo(() => {
    return focusedLabel === label ? styles.activeLabel : undefined
  }, [ label, focusedLabel ])
  const colorClass = useMemo(() => `ion-color-${ index }`, [ index ])
  const number = useMemo(() => AlphanumericKeys[1][index], [ index ]);
  const key = useMemo(() => AlphanumericKeys[0][index], [ index ]);
  const isUsed = useMemo(() => allAnnotations.some(a => a.label === label), [ allAnnotations, label ])
  const color = useMemo(() => (index % 10).toString(), [ index ])
  const isHidden = useMemo(() => hiddenLabels.includes(label), [ hiddenLabels, label ])
  const buttonColor = useMemo(() => focusedLabel === label ? undefined : color, [ color, focusedLabel, label ])
  const dispatch = useAppDispatch()

  const select = useCallback(() => {
    const weakProperties = {
      type: AnnotationType.Weak,
      label,
      confidence: focusedConfidence,
    }
    const weak = getAnnotation(weakProperties)
    if (weak) return dispatch(focusAnnotation(weak))
    addAnnotation(weakProperties)
  }, [ focusedAnnotation, updateAnnotation, label, getAnnotation, dispatch, addAnnotation, focusedConfidence ])
  useKeyDownEvent([ number, key ], select)

  const show = useCallback((event: MouseEvent) => {
    event.stopPropagation();
    // Hide all but current if ctrlKey pressed
    if (event.ctrlKey) dispatch(setHiddenLabels(allLabels))
    dispatch(setHiddenLabels(hiddenLabels.filter(l => l !== label)))
  }, [ label, hiddenLabels, dispatch ])

  const hide = useCallback((event: MouseEvent) => {
    event.stopPropagation();
    // Hide all but current if ctrlKey pressed => show
    if (event.ctrlKey) show(event)
    else dispatch(setHiddenLabels([ ...hiddenLabels, label ]))
  }, [ label, show, dispatch, hiddenLabels ])

  const remove = useCallback((event: MouseEvent) => {
    event.stopPropagation();
    const annotation = getAnnotation({ label, type: AnnotationType.Weak })
    if (!annotation) return;
    removeAnnotation(annotation)
  }, [ label, getAnnotation, removeAnnotation ])

  return (
    <IonChip outline={ !isUsed }
             className={ className }
             data-testid="label-chip"
             onClick={ select }
             color={ color }>
      { focusedLabel === label && <IonIcon src={ checkmarkOutline }/> }

      { index >= 9 ?
        <p>{ label }</p> :
        <TooltipOverlay title="Shortcut"
                        tooltipContent={ <Fragment>
                          <p>
                            <Kbd keys={ number } className={ colorClass }/>
                            &npsb;or&npsb;
                            <Kbd keys={ key } className={ colorClass }/>:
                            { '\u00A0' }Choose this label
                          </p>
                        </Fragment> }>
          <p>{ label }</p>
        </TooltipOverlay>
      }


      { isUsed && <div className={ styles.labelsButtons }>
          <TooltipOverlay
              tooltipContent={ <Fragment>
                <p>{ isHidden ? 'Show' : 'Hide' } corresponding annotations on spectrogram</p>
                <p>Press <Kbd keys={ 'ctrl' }/> to show only this labels annotations</p>
              </Fragment> }>
            { isHidden ?
              <IonIcon icon={ eyeOffOutline } onClick={ show } color={ buttonColor }/> :
              <IonIcon icon={ eyeOutline } onClick={ hide } color={ buttonColor }/> }
          </TooltipOverlay>

          <TooltipOverlay
              tooltipContent={ <p>Remove corresponding annotations</p> }>
              <IonIcon icon={ closeCircle }
                       onClick={ remove }
                       data-testid="remove-label"
                       color={ buttonColor }/>
          </TooltipOverlay>
      </div> }
    </IonChip>
  )
}