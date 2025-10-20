import React, { ChangeEvent, Fragment, MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './styles.module.scss';
import { ExtendedDiv, Table, TableContent, TableDivider, TableHead } from '@/components/ui';
import { Input, type Item, Select } from '@/components/form';
import { IonButton, IonCheckbox, IonIcon, IonNote } from '@ionic/react';
import { IoRemoveCircleOutline } from 'react-icons/io5';
import { createOutline } from 'ionicons/icons';
import { CLICK_EVENT } from '@/features/UX/Events';
import { SignalTrends } from '@/service/types';
import { AnnotationType, SignalTrendType, useAnnotationTask, useCurrentCampaign, useCurrentPhase } from '@/api';
import { useAnnotatorPointer } from '@/features/Annotator/Pointer';
import { useAnnotatorUX } from '@/features/Annotator/UX';
import { useAnnotatorAnnotation } from './hooks';
import { useAnnotatorAnalysis } from '@/features/Annotator/Analysis';
import { useTimeAxis } from '@/features/Annotator/Axis';

export const AcousticFeatures: React.FC = () => {
  const {
    focusedAnnotation,
    focus,
    getAnnotation,
    updateAnnotation,
    updateFeatures,
    removeFeatures,
  } = useAnnotatorAnnotation()
  const { campaign } = useCurrentCampaign()
  const { phase } = useCurrentPhase()
  const { task } = useAnnotationTask()
  const { analysis } = useAnnotatorAnalysis()
  const { timeScale } = useTimeAxis()

  const duration = useMemo(() => {
    if (focusedAnnotation?.type !== AnnotationType.Box) return;
    const minTime = Math.min(focusedAnnotation.start_time!, focusedAnnotation.end_time!)
    const maxTime = Math.max(focusedAnnotation.start_time!, focusedAnnotation.end_time!)
    return +(maxTime - minTime).toFixed(3)
  }, [ focusedAnnotation?.start_time, focusedAnnotation?.end_time ]);

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
    if (!focusedAnnotation?.end_time) return;
    const newLeft = timeScale.valueToPosition(focusedAnnotation.end_time) + 80;
    _left.current = newLeft;
    setLeft(newLeft);
  }, [ focusedAnnotation ]);

  useEffect(() => {
    if (!focusedAnnotation?.acoustic_features?.trend) return;
    if (focusedAnnotation?.acoustic_features?.start_frequency) return;
    if (focusedAnnotation?.acoustic_features?.end_frequency) return;
    switch (focusedAnnotation.acoustic_features.trend) {
      case SignalTrendType.Ascending:
        updateFeatures(focusedAnnotation, {
          start_frequency: focusedAnnotation.start_frequency,
          end_frequency: focusedAnnotation.end_frequency,
        });
        break;
      case SignalTrendType.Descending:
        updateFeatures(focusedAnnotation, {
          start_frequency: focusedAnnotation.end_frequency,
          end_frequency: focusedAnnotation.start_frequency,
        });
        break;
    }
  }, [ focusedAnnotation?.acoustic_features?.trend ]);

  const setGood = useCallback(() => {
    if (!focusedAnnotation || focusedAnnotation.acoustic_features) return;
    updateFeatures(focusedAnnotation, {})
  }, [ focusedAnnotation ])

  const updateMinFrequency = useCallback((value: number) => {
    if (focusedAnnotation?.type !== AnnotationType.Box) return;
    if (analysis) value = Math.min(value, analysis.fft.samplingFrequency)
    value = Math.max(value, 0)
    updateAnnotation(focusedAnnotation, {
      start_frequency: value,
      end_frequency: Math.max(focusedAnnotation.end_frequency ?? 0, value),
    })
  }, [ updateAnnotation, focusedAnnotation, analysis ])

  const updateMaxFrequency = useCallback((value: number) => {
    if (focusedAnnotation?.type !== AnnotationType.Box) return;
    if (analysis) value = Math.min(value, analysis.fft.samplingFrequency)
    value = Math.max(value, 0)
    updateAnnotation(focusedAnnotation, {
      start_frequency: Math.min(focusedAnnotation.start_frequency ?? 0, value),
      end_frequency: value,
    })
  }, [ updateAnnotation, focusedAnnotation, analysis ])

  const updateDuration = useCallback((value: number) => {
    if (focusedAnnotation?.type !== AnnotationType.Box || !task?.spectrogram) return;
    value = Math.min(value, task.spectrogram.duration)
    updateAnnotation(focusedAnnotation, {
      end_time: focusedAnnotation.start_time! + Math.max(value, 0),
    })
  }, [ updateAnnotation, focusedAnnotation, task ])

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
    if (!focusedAnnotation) return
    const weak = getAnnotation({
      type: AnnotationType.Weak,
      label: focusedAnnotation.label,
    });
    if (weak) focus(weak)
  }, [ getAnnotation, focusedAnnotation, focus ])

  if (!focusedAnnotation) return <Fragment/>;
  if (!campaign?.labelsWithAcousticFeatures?.find(l => l?.name === focusedAnnotation.label)) return <Fragment/>;
  if (focusedAnnotation.type !== AnnotationType.Box) return <Fragment/>;
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
          <div className={ !focusedAnnotation.acoustic_features ? styles.active : undefined }
               onClick={ () => removeFeatures(focusedAnnotation) }>
            Bad
          </div>
          <div className={ focusedAnnotation.acoustic_features ? styles.active : undefined } onClick={ setGood }>
            Good
          </div>
        </div>
      </div>

      { focusedAnnotation.acoustic_features && <Table columns={ 3 } className={ styles.table } size="small">
          <TableHead isFirstColumn={ true } className={ styles.span2ColsStart }>Feature</TableHead>
          <TableHead>Value</TableHead>

        {/* Frequencies */ }
          <TableDivider/>
          <TableContent isFirstColumn={ true } className={ styles.frequencyCell }>Frequency</TableContent>

          <TableContent>Min</TableContent>
          <TableContent className={ styles.cell }>
              <Input value={ focusedAnnotation.start_frequency! } type="number"
                     min={ 0 } max={ analysis?.fft.samplingFrequency }
                     disabled={ phase?.phase === 'Verification' }
                     onChange={ e => updateMinFrequency(+e.currentTarget.value) }/>
              <IonNote>Hz</IonNote>
          </TableContent>

          <TableDivider className={ styles.span2ColsEnd }/>
          <TableContent>Max</TableContent>
          <TableContent className={ styles.cell }>
              <Input value={ focusedAnnotation.end_frequency! } type="number"
                     min={ 0 } max={ analysis?.fft.samplingFrequency }
                     disabled={ phase?.phase === 'Verification' }
                     onChange={ e => updateMaxFrequency(+e.currentTarget.value) }/>
              <IonNote>Hz</IonNote>
          </TableContent>

          <TableDivider className={ styles.span2ColsEnd }/>
          <TableContent>Range</TableContent>
          <TableContent><IonNote>{ focusedAnnotation.end_frequency! - focusedAnnotation.start_frequency! } Hz</IonNote></TableContent>

          <SelectableFrequencyRow label="Start"
                                  value={ focusedAnnotation.acoustic_features.start_frequency ?? undefined }
                                  max={ analysis?.fft.samplingFrequency }
                                  onChange={ start_frequency => updateFeatures(focusedAnnotation, { start_frequency }) }/>

          <SelectableFrequencyRow label="End"
                                  value={ focusedAnnotation.acoustic_features.end_frequency ?? undefined }
                                  max={ analysis?.fft.samplingFrequency }
                                  onChange={ end_frequency => updateFeatures(focusedAnnotation, { end_frequency }) }/>

        {/* Time */ }
          <TableDivider/>
          <TableContent isFirstColumn={ true } className={ styles.span2ColsStart }>Duration</TableContent>
          <TableContent className={ styles.cell }>
              <Input value={ duration } type="number"
                     step={ 0.001 }
                     min={ 0.01 } max={ task?.spectrogram?.duration ?? 0 }
                     disabled={ phase?.phase === 'Verification' }
                     onChange={ e => updateDuration(+e.currentTarget.value) }/>
              <IonNote>s</IonNote>
          </TableContent>

        {/* Trend */ }
          <TableDivider/>
          <TableContent isFirstColumn={ true } className={ styles.trendCell }>Trend</TableContent>

          <TableContent>General</TableContent>
          <TableContent>
              <Select options={ SignalTrends.map(value => ({ label: value, value } as Item)) }
                      placeholder="Select a value"
                      optionsContainer="popover"
                      value={ focusedAnnotation.acoustic_features.trend ?? undefined }
                      onValueSelected={ value => updateFeatures(focusedAnnotation, { trend: (value as SignalTrendType) ?? null }) }/>
          </TableContent>

          <TableDivider className={ styles.span2ColsEnd }/>
          <TableContent>Relative min count</TableContent>
          <TableContent>
              <Input value={ focusedAnnotation.acoustic_features.relative_min_frequency_count ?? undefined }
                     type="number" min={ 0 } placeholder="0"
                     onChange={ (e: ChangeEvent<HTMLInputElement>) => updateFeatures(focusedAnnotation, { relative_min_frequency_count: e.currentTarget.valueAsNumber }) }/>
          </TableContent>

          <TableDivider className={ styles.span2ColsEnd }/>
          <TableContent>Relative max count</TableContent>
          <TableContent>
              <Input value={ focusedAnnotation.acoustic_features.relative_max_frequency_count ?? undefined }
                     type="number" min={ 0 } placeholder="0"
                     onChange={ (e: ChangeEvent<HTMLInputElement>) => updateFeatures(focusedAnnotation, { relative_max_frequency_count: e.currentTarget.valueAsNumber }) }/>
          </TableContent>

          <TableDivider className={ styles.span2ColsEnd }/>
          <TableContent>Inflection count</TableContent>
          <TableContent><IonNote>{ (focusedAnnotation.acoustic_features.relative_min_frequency_count ?? 0)
            + (focusedAnnotation.acoustic_features.relative_max_frequency_count ?? 0) }</IonNote></TableContent>

          <TableDivider className={ styles.span2ColsEnd }/>
          <TableContent>Steps count</TableContent>
          <TableContent>
              <Input value={ focusedAnnotation.acoustic_features.steps_count ?? undefined }
                     type="number" min={ 0 } placeholder="0"
                     onChange={ (e: ChangeEvent<HTMLInputElement>) => updateFeatures(focusedAnnotation, { steps_count: e.currentTarget.valueAsNumber }) }/>
          </TableContent>


          <TableDivider className={ styles.span2ColsEnd }/>
          <TableContent>Has harmonics</TableContent>
          <TableContent>
              <IonCheckbox checked={ !!focusedAnnotation.acoustic_features.has_harmonics }
                           onChange={ e => updateFeatures(focusedAnnotation, { has_harmonics: e.currentTarget.checked }) }/>
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
  const { getFreqTime } = useAnnotatorPointer()
  const { enableDrawing, disableDrawing } = useAnnotatorUX()
  const [ isSelecting, setIsSelecting ] = useState<boolean>(false);

  const onClick = useCallback((event: MouseEvent) => {
    event.stopPropagation()
    const position = getFreqTime(event)
    if (position) onChange(position.frequency)
    unselect()
  }, [ getFreqTime ]);

  const select = useCallback(() => {
    setTimeout(() => CLICK_EVENT.add(onClick), 500);
    setIsSelecting(true)
    disableDrawing()
  }, [ disableDrawing, onClick ])

  const unselect = useCallback(() => {
    CLICK_EVENT.remove(onClick)
    setIsSelecting(false)
    enableDrawing()
  }, [ enableDrawing, onClick ])

  const toggleSelection = useCallback(() => {
    if (isSelecting) unselect()
    else select()
  }, [ isSelecting, select, unselect ]);

  return <Fragment>
    <TableDivider className={ styles.span2ColsEnd }/>
    <TableContent>{ label }</TableContent>
    <TableContent className={ styles.cellButton }>
      <Input value={ value ?? '' } type="number" min={ 0 } max={ max }
             onChange={ (e: ChangeEvent<HTMLInputElement>) => onChange(+e.currentTarget.value) }/>
      <IonNote>Hz</IonNote>
      <IonButton size="small" fill="clear"
                 className={ isSelecting ? styles.selectedButton : undefined }
                 onClick={ toggleSelection }>
        <IonIcon icon={ createOutline } slot="icon-only"/>
      </IonButton>
    </TableContent>
  </Fragment>
}
