import React, { Fragment, MouseEvent, useCallback, useMemo } from 'react';
import { IonChip, IonIcon } from '@ionic/react';
import { checkmarkOutline, closeCircle, eyeOffOutline, eyeOutline } from 'ionicons/icons/index.js';
import styles from './styles.module.scss';
import { Kbd, TooltipOverlay, useAlert } from '@/components/ui';
import { useAnnotatorLabel } from './hooks';
import { useAnnotatorAnnotation } from '@/features/Annotator/Annotation';
import { AnnotationType } from '@/api';

export const AlphanumericKeys = [
  [ '&', 'é', '"', '\'', '(', '-', 'è', '_', 'ç' ],
  [ '1', '2', '3', '4', '5', '6', '7', '8', '9' ],
];

export const LabelChip: React.FC<{
  label: string;
}> = ({ label }) => {
  const {
    allLabels,
    focusedLabel,
    hiddenLabels,
    hideAllLabels,
    hideLabel,
    showLabel,
  } = useAnnotatorLabel()
  const {
    allAnnotations,
    focusedAnnotation,
    updateAnnotation,
    removeAnnotation,
    getAnnotation,
    getAnnotations,
    focus,
    addAnnotation,
  } = useAnnotatorAnnotation()
  const index = useMemo(() => allLabels.indexOf(label), [ allLabels, label ])
  const className = useMemo(() => {
    return focusedLabel === label ? styles.activeLabel : undefined
  }, [ label, focusedLabel ])
  const colorClass = useMemo(() => `ion-color-${ index }`, [ index ])
  const number = useMemo(() => AlphanumericKeys[1][index], [ index ]);
  const key = useMemo(() => AlphanumericKeys[0][index], [ index ]);
  const isUsed = useMemo(() => allAnnotations.some(a => a.label === label), [ label ])
  const color = useMemo(() => (index % 10).toString(), [ index ])
  const isHidden = useMemo(() => hiddenLabels.includes(label), [ hiddenLabels, label ])
  const buttonColor = useMemo(() => focusedLabel === label ? undefined : color, [ color, focusedLabel, label ])
  const alert = useAlert()

  const select = useCallback(() => {
    if (focusedAnnotation) return updateAnnotation(focusedAnnotation, { label })
    const weakProperties = { type: AnnotationType.Weak, label }
    const weak = getAnnotation(weakProperties)
    if (weak) return focus(weak)
    addAnnotation(weakProperties)
  }, [ focusedAnnotation, updateAnnotation, label, getAnnotation, focus, addAnnotation ])

  const show = useCallback((event: MouseEvent) => {
    event.stopPropagation();
    // Hide all but current if ctrlKey pressed
    if (event.ctrlKey) hideAllLabels()
    showLabel(label)
  }, [ label, showLabel, hideAllLabels ])

  const hide = useCallback((event: MouseEvent) => {
    event.stopPropagation();
    // Hide all but current if ctrlKey pressed => show
    if (event.ctrlKey) show(event)
    else hideLabel(label)
  }, [ label, show, hideLabel ])

  const remove = useCallback((event: MouseEvent) => {
    event.stopPropagation();
    if (!isUsed) return;
    // if annotations exists with this label: wait for confirmation
    alert.showAlert({
      type: 'Warning',
      message: `You are about to remove ${ getAnnotations({ label }).length } annotations using "${ label }" label. Are you sure?`,
      actions: [ {
        label: `Remove "${ label }" annotations`,
        callback: () => {
          const weak = getAnnotation({ type: AnnotationType.Weak, label })
          if (weak) removeAnnotation(weak)
        },
      } ],
    })
  }, [ label, isUsed, getAnnotations, getAnnotation, removeAnnotation ])

  return (
    <IonChip outline={ !isUsed }
             className={ className }
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
                            &npsb;Choose this label
                          </p>
                        </Fragment> }>
          <p>{ label }</p>
        </TooltipOverlay>
      }


      { isUsed && <div className={ styles.labelButtons }>
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
              <IonIcon icon={ closeCircle } onClick={ remove } color={ buttonColor }/>
          </TooltipOverlay>
      </div> }
    </IonChip>
  )
}