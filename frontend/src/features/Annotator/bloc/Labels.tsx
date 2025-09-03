import React, { Fragment, MouseEvent, ReactElement, useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from './styles.module.scss';
import { IonChip, IonIcon } from '@ionic/react';
import { checkmarkOutline, closeCircle, eyeOffOutline, eyeOutline } from 'ionicons/icons';
import { useAlert } from "@/service/ui";
import { KEY_DOWN_EVENT, useEvent } from "@/service/events";
import { AlphanumericKeys } from "@/consts/shorcuts.const.tsx";
import { Button, Kbd, TooltipOverlay } from "@/components/ui";
import { AnnotationPhase } from "@/service/types";
import { useRetrieveCurrentPhase } from "@/service/api/campaign-phase.ts";
import { useAnnotatorAnnotations, useAnnotatorLabel, useAnnotatorUI } from "@/features/Annotator";
import { AnnotationLabelNode } from "@/features/gql/types.generated.ts";


export const Labels: React.FC = () => {
  const {
    selected,
    select,
    labels,
    presenceLabelNames,
  } = useAnnotatorLabel()
  const {
    hiddenLabels,
    showLabels
  } = useAnnotatorUI()
  //
  const { phase } = useRetrieveCurrentPhase()
  const phaseRef = useRef<AnnotationPhase | undefined>(phase)
  useEffect(() => {
    phaseRef.current = phase
  }, [ phase ]);

  const _selected = useRef<string | undefined>(selected);
  useEffect(() => {
    _selected.current = selected;
  }, [ selected ]);

  const _labels = useRef<Pick<AnnotationLabelNode, 'name'>[]>(labels);
  useEffect(() => {
    _labels.current = labels;
  }, [ labels ]);


  const _presenceLabelNames = useRef<string[]>(presenceLabelNames);
  useEffect(() => {
    _presenceLabelNames.current = presenceLabelNames;
  }, [ presenceLabelNames ]);

  function onKbdEvent(event: KeyboardEvent) {
    if (!_labels.current || !phaseRef.current) return;
    const active_alphanumeric_keys = AlphanumericKeys[0].slice(0, _labels.current.length);

    if (event.key === "'") {
      event.preventDefault();
    }

    for (const i in active_alphanumeric_keys) {
      if (event.key !== AlphanumericKeys[0][i] && event.key !== AlphanumericKeys[1][i]) continue;

      const label = _labels.current[i];
      if (_selected.current === label.name) continue;
      select(label)
    }
  }

  useEvent(KEY_DOWN_EVENT, onKbdEvent);

  // 'label' class is for playwright tests
  return (
    <div className={ [ styles.bloc, styles.labels, 'label' ].join(' ') }>
      <h6 className={ styles.header }>
        Labels
        { hiddenLabels.length > 0 && <Button onClick={ () => showLabels(labels) }
                                             fill="clear"
                                             className={ styles.showButton }>Show all</Button> }
      </h6>
      <div className={ styles.body }>
        { labels.map((label, key) => <LabelItem label={ label } key={ key } index={ key }/>) }
      </div>
    </div>
  )
}

export const LabelItem: React.FC<{ label: Pick<AnnotationLabelNode, 'name'>, index: number }> = ({ label, index }) => {
  const {
    labels,
    presenceLabelNames,
    selected, select,
    getWeakAnnotation
  } = useAnnotatorLabel()
  const {
    hiddenLabels, showLabels, hideLabels
  } = useAnnotatorUI()
  const {
    annotations,
    remove: _remove
  } = useAnnotatorAnnotations()
  const isUsed = useMemo(() => presenceLabelNames.includes(label.name), [ presenceLabelNames, label ])
  const isHidden = useMemo(() => hiddenLabels.includes(label.name), [ hiddenLabels, label ])
  const color = useMemo(() => (index % 10).toString(), [ index ])
  const buttonColor = useMemo(() => selected === label.name ? undefined : color, [ color, selected, label ])
  const [ className, setClassName ] = useState<string>('');
  const alert = useAlert();

  useEffect(() => {
    if (selected !== label.name) setClassName('')
    else setClassName(styles.activeLabel)
  }, [ selected, label ])


  const show = useCallback((event: MouseEvent) => {
    event.stopPropagation();
    if (event.ctrlKey) {
      // Hide all but current
      hideLabels(labels)
    }
    showLabels([ label ])
  }, [ label, showLabels, hideLabels, labels ])

  const hide = useCallback((event: MouseEvent) => {
    event.stopPropagation();
    if (event.ctrlKey) {
      // Hide all but current
      hideLabels(labels)
      showLabels([ label ])
    } else hideLabels([ label ])
  }, [ label, hideLabels, labels ])

  const remove = useCallback((event: MouseEvent) => {
    event.stopPropagation();
    if (!isUsed) return;
    // if annotations exists with this label: wait for confirmation
    alert.showAlert({
      type: 'Warning',
      message: `You are about to remove ${ annotations.filter(a => a.label.name === label.name).length } annotations using "${ label.name }" label. Are you sure?`,
      actions: [ {
        label: `Remove "${ label.name }" annotations`,
        callback: () => {
          const weak = getWeakAnnotation(label)
          if (weak) _remove(weak)
        },
      } ]
    })
  }, [ label, isUsed, annotations ])

  return (
    <IonChip outline={ !isUsed }
             className={ className }
             onClick={ () => select(label) }
             color={ color }>
      { selected === label.name && <IonIcon src={ checkmarkOutline }/> }
      <LabelTooltipOverlay id={ index }><p>{ label.name }</p></LabelTooltipOverlay>

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

export const LabelTooltipOverlay: React.FC<{ id: number, children: ReactElement }> = ({ id, children }) => {
  const number = AlphanumericKeys[1][id];
  const key = AlphanumericKeys[0][id];
  if (id >= 9) return children;
  return (
    <TooltipOverlay title='Shortcut'
                    children={ children }
                    tooltipContent={ <Fragment>
                      <p>
                        <Kbd keys={ number }
                             className={ `ion-color-${ id }` }/> or <Kbd keys={ key }
                                                                         className={ `ion-color-${ id }` }/> : Choose
                        this
                        label
                      </p>
                    </Fragment> }/>
  )
}
