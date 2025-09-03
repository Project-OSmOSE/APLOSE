import React, { Fragment, MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './styles.module.scss';
import { Table, TableContent, TableDivider, TableHead } from "@/components/ui";
import { Input, Select } from '@/components/form';
import { IonButton, IonCheckbox, IonIcon, IonNote } from '@ionic/react';
import { IoRemoveCircleOutline } from 'react-icons/io5';
import { createOutline } from 'ionicons/icons';
import { ExtendedDiv } from '@/components/ui/ExtendedDiv';
import { CLICK_EVENT } from '@/service/events';
import { SignalTrends } from '@/service/types';
import { Item } from '@/types/item.ts';
import { useRetrieveCurrentCampaign } from "@/service/api/campaign.ts";
import { useRetrieveCurrentPhase } from "@/service/api/campaign-phase.ts";
import {
  useAnnotatorAnnotations,
  useAnnotatorInput,
  useAnnotatorLabel,
  useAnnotatorPointer,
  useAnnotatorQuery,
  useAnnotatorUI,
  useXAxis
} from "@/features/Annotator";
import { AnnotationType, SignalTrendType } from "@/features/gql/types.generated.ts";

export const AcousticFeatures: React.FC = () => {
  const { focus, annotation, updateFeatures, removeFeatures, update } = useAnnotatorAnnotations()
  const { getWeakAnnotation } = useAnnotatorLabel()
  const { campaign } = useRetrieveCurrentCampaign()
  const { phase } = useRetrieveCurrentPhase()
  const { analysis } = useAnnotatorInput()
  const { data } = useAnnotatorQuery()
  const xAxis = useXAxis();
  const duration = useMemo(() => {
    if (annotation?.type !== AnnotationType.Box) return;
    const minTime = Math.min(annotation.startTime!, annotation.endTime!)
    const maxTime = Math.max(annotation.startTime!, annotation.endTime!)
    return +(maxTime - minTime).toFixed(3)
  }, [ annotation?.startTime, annotation?.endTime ]);

  const initialLeft = useMemo(() => window.innerWidth - 500, [])

  const [ top, setTop ] = useState<number>(128);
  const _top = useRef<number>(128);
  const [ left, setLeft ] = useState<number>(initialLeft);
  const _left = useRef<number>(initialLeft);

  useEffect(() => {
    setTop(_top.current)
  }, [ _top.current ]);
  useEffect(() => {
    setLeft(_left.current)
  }, [ _left.current ]);

  useEffect(() => {
    if (!annotation?.endTime) return;
    const newLeft = xAxis.valueToPosition(annotation.endTime) + 80;
    _left.current = newLeft;
    setLeft(newLeft);
  }, [ annotation ]);

  useEffect(() => {
    if (!annotation?.acousticFeatures?.trend) return;
    if (annotation?.acousticFeatures?.startFrequency) return;
    if (annotation?.acousticFeatures?.endFrequency) return;
    switch (annotation.acousticFeatures.trend) {
      case SignalTrendType.Ascending:
        updateFeatures(annotation, {
          startFrequency: annotation.startFrequency,
          endFrequency: annotation.endFrequency
        });
        break;
      case SignalTrendType.Descending:
        updateFeatures(annotation, {
          startFrequency: annotation.endFrequency,
          endFrequency: annotation.startFrequency
        });
        break;
    }
  }, [ annotation?.acousticFeatures?.trend ]);

  const setGood = useCallback(() => {
    if (!annotation || annotation.acousticFeatures) return;
    updateFeatures(annotation, {})
  }, [ annotation ])

  const updateMinFrequency = useCallback((value: number) => {
    if (annotation?.type !== AnnotationType.Box) return;
    if (analysis) value = Math.min(value, analysis.fft.samplingFrequency)
    value = Math.max(value, 0)
    update(annotation, {
      startFrequency: value,
      endFrequency: Math.max(annotation.endFrequency ?? 0, value),
    })
  }, [ update, annotation, analysis ])

  const updateMaxFrequency = useCallback((value: number) => {
    if (annotation?.type !== AnnotationType.Box) return;
    if (analysis) value = Math.min(value, analysis.fft.samplingFrequency)
    value = Math.max(value, 0)
    update(annotation, {
      startFrequency: Math.min(annotation.startFrequency ?? 0, value),
      endFrequency: value,
    })
  }, [ update, annotation, analysis ])

  const updateDuration = useCallback((value: number) => {
    if (annotation?.type !== AnnotationType.Box || !data?.spectrogramById) return;
    value = Math.min(value, data.spectrogramById.duration)
    update(annotation, {
      endTime: annotation.startTime! + Math.max(value, 0)
    })
  }, [ update, annotation, data ])

  const onTopMove = useCallback((move: number) => {
    setTop(prev => {
      _top.current = prev + move
      return prev + move
    })
  }, [])

  const onLeftMove = useCallback((move: number) => {
    setLeft(prev => {
      _left.current = prev + move
      return prev + move
    })
  }, [])

  const quit = useCallback(() => {
    if (!annotation) return
    const weak = getWeakAnnotation(annotation.label);
    if (weak) focus(weak)
  }, [ getWeakAnnotation, annotation, focus ])

  if (!annotation) return;
  if (!campaign?.labels_with_acoustic_features.includes(annotation.label.name)) return;
  if (annotation.type !== AnnotationType.Box) return;
  // @ts-expect-error: --left isn't recognized
  return <div style={ { top, '--left': `${ left }px` } }
              className={ [ styles.bloc, styles.features ].join(' ') }
              onMouseDown={ e => e.stopPropagation() }>
    <ExtendedDiv draggable={ true } onTopMove={ onTopMove } onLeftMove={ onLeftMove }
                 className={ styles.header }><h6>
      Acoustic features
      <IoRemoveCircleOutline onClick={ quit }/>
    </h6></ExtendedDiv>
    <div className={ styles.body }>

      <div className={ styles.line }>
        <b>Quality</b>
        <div className={ styles.switch }>
          <div className={ !annotation.acousticFeatures ? styles.active : undefined }
               onClick={ () => removeFeatures(annotation) }>
            Bad
          </div>
          <div className={ annotation.acousticFeatures ? styles.active : undefined } onClick={ setGood }>
            Good
          </div>
        </div>
      </div>

      { annotation.acousticFeatures && <Table columns={ 3 } className={ styles.table } size='small'>
          <TableHead isFirstColumn={ true } className={ styles.span2ColsStart }>Feature</TableHead>
          <TableHead>Value</TableHead>

        {/* Frequencies */ }
          <TableDivider/>
          <TableContent isFirstColumn={ true } className={ styles.frequencyCell }>Frequency</TableContent>

          <TableContent>Min</TableContent>
          <TableContent className={ styles.cell }>
              <Input value={ annotation.startFrequency! } type="number"
                     min={ 0 } max={ analysis?.fft.samplingFrequency }
                     disabled={ phase?.phase === 'Verification' }
                     onChange={ e => updateMinFrequency(+e.currentTarget.value) }/>
              <IonNote>Hz</IonNote>
          </TableContent>

          <TableDivider className={ styles.span2ColsEnd }/>
          <TableContent>Max</TableContent>
          <TableContent className={ styles.cell }>
              <Input value={ annotation.endFrequency! } type="number"
                     min={ 0 } max={ analysis?.fft.samplingFrequency }
                     disabled={ phase?.phase === 'Verification' }
                     onChange={ e => updateMaxFrequency(+e.currentTarget.value) }/>
              <IonNote>Hz</IonNote>
          </TableContent>

          <TableDivider className={ styles.span2ColsEnd }/>
          <TableContent>Range</TableContent>
          <TableContent><IonNote>{ annotation.endFrequency! - annotation.startFrequency! } Hz</IonNote></TableContent>

          <SelectableFrequencyRow label='Start'
                                  value={ annotation.acousticFeatures.startFrequency ?? undefined }
                                  max={ analysis?.fft.samplingFrequency }
                                  onChange={ startFrequency => updateFeatures(annotation, { startFrequency }) }/>

          <SelectableFrequencyRow label='End'
                                  value={ annotation.acousticFeatures.endFrequency ?? undefined }
                                  max={ analysis?.fft.samplingFrequency }
                                  onChange={ endFrequency => updateFeatures(annotation, { endFrequency }) }/>

        {/* Time */ }
          <TableDivider/>
          <TableContent isFirstColumn={ true } className={ styles.span2ColsStart }>Duration</TableContent>
          <TableContent className={ styles.cell }>
              <Input value={ duration } type="number"
                     step={ 0.001 }
                     min={ 0.01 } max={ data?.spectrogramById?.duration ?? 0 }
                     disabled={ phase?.phase === 'Verification' }
                     onChange={ e => updateDuration(+e.currentTarget.value) }/>
              <IonNote>s</IonNote>
          </TableContent>

        {/* Trend */ }
          <TableDivider/>
          <TableContent isFirstColumn={ true } className={ styles.trendCell }>Trend</TableContent>

          <TableContent>General</TableContent>
          <TableContent>
              <Select options={ SignalTrends.map(value => ({ label: value, value } satisfies Item)) }
                      placeholder="Select a value"
                      optionsContainer="popover"
                      value={ annotation.acousticFeatures.trend ?? undefined }
                      onValueSelected={ item => updateFeatures(annotation, { trend: (item as SignalTrendType) ?? null }) }/>
          </TableContent>

          <TableDivider className={ styles.span2ColsEnd }/>
          <TableContent>Relative min count</TableContent>
          <TableContent>
              <Input value={ annotation.acousticFeatures.relativeMinFrequencyCount ?? undefined }
                     type="number" min={ 0 } placeholder="0"
                     onChange={ e => updateFeatures(annotation, { relativeMinFrequencyCount: e.currentTarget.valueAsNumber }) }/>
          </TableContent>

          <TableDivider className={ styles.span2ColsEnd }/>
          <TableContent>Relative max count</TableContent>
          <TableContent>
              <Input value={ annotation.acousticFeatures.relativeMaxFrequencyCount ?? undefined }
                     type="number" min={ 0 } placeholder="0"
                     onChange={ e => updateFeatures(annotation, { relativeMaxFrequencyCount: e.currentTarget.valueAsNumber }) }/>
          </TableContent>

          <TableDivider className={ styles.span2ColsEnd }/>
          <TableContent>Inflection count</TableContent>
          <TableContent><IonNote>{ (annotation.acousticFeatures.relativeMinFrequencyCount ?? 0)
            + (annotation.acousticFeatures.relativeMaxFrequencyCount ?? 0) }</IonNote></TableContent>

          <TableDivider className={ styles.span2ColsEnd }/>
          <TableContent>Steps count</TableContent>
          <TableContent>
              <Input value={ annotation.acousticFeatures.stepsCount ?? undefined }
                     type="number" min={ 0 } placeholder="0"
                     onChange={ e => updateFeatures(annotation, { stepsCount: e.currentTarget.valueAsNumber }) }/>
          </TableContent>


          <TableDivider className={ styles.span2ColsEnd }/>
          <TableContent>Has harmonics</TableContent>
          <TableContent>
              <IonCheckbox checked={ !!annotation.acousticFeatures.hasHarmonics }
                           onChange={ e => updateFeatures(annotation, { hasHarmonics: e.currentTarget.checked }) }/>
          </TableContent>

      </Table> }
    </div>
  </div>
}

const SelectableFrequencyRow: React.FC<{
  label: string;
  value: number | undefined;
  max: number | undefined;
  onChange: (value: number | undefined) => void;
}> = ({ label, value, max, onChange }) => {
  const { enableAnnotation, disableAnnotation } = useAnnotatorUI()
  const [ isSelecting, setIsSelecting ] = useState<boolean>(false);

  const pointer = useAnnotatorPointer()

  const onClick = useCallback((event: MouseEvent) => {
    event.stopPropagation()
    const position = pointer.getFreqTime(event)
    if (position) onChange(position.frequency)
    unselect()
  }, [ pointer ]);

  const select = useCallback(() => {
    setTimeout(() => CLICK_EVENT.add(onClick), 500);
    setIsSelecting(true)
    disableAnnotation()
  }, [ disableAnnotation, onClick ])

  const unselect = useCallback(() => {
    CLICK_EVENT.remove(onClick)
    setIsSelecting(false)
    enableAnnotation()
  }, [ enableAnnotation, onClick ])

  const toggleSelection = useCallback(() => {
    if (isSelecting) unselect()
    else select()
  }, [ isSelecting, select, unselect ]);

  return <Fragment>
    <TableDivider className={ styles.span2ColsEnd }/>
    <TableContent>{ label }</TableContent>
    <TableContent className={ styles.cellButton }>
      <Input value={ value ?? '' } type="number" min={ 0 } max={ max }
             onChange={ e => onChange(+e.currentTarget.value) }/>
      <IonNote>Hz</IonNote>
      <IonButton size='small' fill='clear'
                 className={ isSelecting ? styles.selectedButton : undefined }
                 onClick={ toggleSelection }>
        <IonIcon icon={ createOutline } slot='icon-only'/>
      </IonButton>
    </TableContent>
  </Fragment>
}
