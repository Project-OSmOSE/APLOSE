import React, { ChangeEvent, Fragment, MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';
import styles from './styles.module.scss';
import { ExtendedDiv, Table, TableContent, TableDivider, TableHead } from '@/components/ui';
import { Input, type Item, Select } from '@/components/form';
import { IonButton, IonCheckbox, IonIcon, IonNote } from '@ionic/react';
import { IoRemoveCircleOutline } from 'react-icons/io5';
import { createOutline } from 'ionicons/icons/index.js';
import { CLICK_EVENT, useEvent } from '@/features/UX/Events';
import { AnnotationType, SignalTrendType, useAnnotationTask, useCurrentCampaign, useCurrentPhase } from '@/api';
import { useGetFreqTime, useIsInAnnotation } from '@/features/Annotator/Pointer';
import {
  useGetAnnotation,
  useRemoveAnnotationFeatures,
  useUpdateAnnotation,
  useUpdateAnnotationFeatures,
} from './hooks';
import { selectAnalysis } from '@/features/Annotator/Analysis';
import { useTimeScale } from '@/features/Annotator/Axis';
import { useAppDispatch, useAppSelector } from '@/features/App';
import { endPositionSelection, selectIsSelectingPositionForAnnotation, selectPosition } from '@/features/Annotator/UX';
import { selectAnnotation } from '@/features/Annotator/Annotation/selectors';
import { focusAnnotation } from '@/features/Annotator/Annotation/slice';

export const AcousticFeatures: React.FC = () => {
  const analysis = useAppSelector(selectAnalysis)
  const focusedAnnotation = useAppSelector(selectAnnotation)
  const updateAnnotation = useUpdateAnnotation()
  const getAnnotation = useGetAnnotation()
  const updateFeatures = useUpdateAnnotationFeatures()
  const removeFeatures = useRemoveAnnotationFeatures()
  const { campaign } = useCurrentCampaign()
  const { phase } = useCurrentPhase()
  const { spectrogram } = useAnnotationTask()
  const timeScale = useTimeScale()
  const dispatch = useAppDispatch();

  const duration = useMemo(() => {
    if (focusedAnnotation?.type !== AnnotationType.Box) return;
    const minTime = Math.min(focusedAnnotation.startTime!, focusedAnnotation.endTime!)
    const maxTime = Math.max(focusedAnnotation.startTime!, focusedAnnotation.endTime!)
    return +(maxTime - minTime).toFixed(3)
  }, [ focusedAnnotation?.startTime, focusedAnnotation?.endTime ]);

  const initialLeft = useMemo(() => window.innerWidth - 500, [])

  const [ top, setTop ] = useState<number>(128);
  const [ left, setLeft ] = useState<number>(initialLeft);

  const [ prevAnnotationID, setPrevAnnotationID ] = useState<number | undefined>();

  useEffect(() => {
    if (prevAnnotationID === focusedAnnotation?.id) return;
    if (!focusedAnnotation?.endTime) return;
    const newLeft = timeScale.valueToPosition(focusedAnnotation.endTime) + 80;
    setPrevAnnotationID(focusedAnnotation.id);
    setLeft(newLeft);
  }, [ focusedAnnotation ]);

  useEffect(() => {
    if (!focusedAnnotation?.acousticFeatures?.trend) return;
    if (focusedAnnotation?.acousticFeatures?.startFrequency) return;
    if (focusedAnnotation?.acousticFeatures?.endFrequency) return;
    switch (focusedAnnotation.acousticFeatures.trend) {
      case SignalTrendType.Ascending:
        updateFeatures(focusedAnnotation, {
          startFrequency: focusedAnnotation.startFrequency,
          endFrequency: focusedAnnotation.endFrequency,
        });
        break;
      case SignalTrendType.Descending:
        updateFeatures(focusedAnnotation, {
          startFrequency: focusedAnnotation.startFrequency,
          endFrequency: focusedAnnotation.endFrequency,
        });
        break;
    }
  }, [ focusedAnnotation?.acousticFeatures?.trend ]);

  const setGood = useCallback(() => {
    if (!focusedAnnotation || focusedAnnotation.acousticFeatures) return;
    updateFeatures(focusedAnnotation, {})
  }, [ focusedAnnotation ])

  const updateMinFrequency = useCallback((value: number) => {
    if (focusedAnnotation?.type !== AnnotationType.Box) return;
    if (analysis) value = Math.min(value, analysis.fft.samplingFrequency)
    value = Math.max(value, 0)
    updateAnnotation(focusedAnnotation, {
      startFrequency: value,
      endFrequency: Math.max(focusedAnnotation.endFrequency ?? 0, value),
    })
  }, [ updateAnnotation, focusedAnnotation, analysis ])

  const updateMaxFrequency = useCallback((value: number) => {
    if (focusedAnnotation?.type !== AnnotationType.Box) return;
    if (analysis) value = Math.min(value, analysis.fft.samplingFrequency)
    value = Math.max(value, 0)
    updateAnnotation(focusedAnnotation, {
      startFrequency: Math.min(focusedAnnotation.startFrequency ?? 0, value),
      endFrequency: value,
    })
  }, [ updateAnnotation, focusedAnnotation, analysis ])

  const updateDuration = useCallback((value: number) => {
    if (focusedAnnotation?.type !== AnnotationType.Box || !spectrogram) return;
    value = Math.min(value, spectrogram.duration)
    updateAnnotation(focusedAnnotation, {
      endTime: focusedAnnotation.startTime! + Math.max(value, 0),
    })
  }, [ updateAnnotation, focusedAnnotation, spectrogram ])

  const onTopMove = useCallback((move: number) => {
    setTop(prev => prev + move)
  }, [ setTop ])

  const onLeftMove = useCallback((move: number) => {
    setLeft(prev => prev + move)
  }, [ setLeft ])

  const quit = useCallback(() => {
    if (!focusedAnnotation) return
    const weak = getAnnotation({
      type: AnnotationType.Weak,
      label: focusedAnnotation.label,
    });
    if (weak) dispatch(focusAnnotation(weak))
  }, [ getAnnotation, focusedAnnotation, dispatch ])

  if (!focusedAnnotation) return <Fragment/>;
  if (!campaign?.labelsWithAcousticFeatures?.find(l => l?.name === focusedAnnotation.label)) return <Fragment/>;
  if (focusedAnnotation.type !== AnnotationType.Box) return <Fragment/>;
  // @ts-expect-error: --left isn't recognized
  return <div style={ { top, '--left': `${ left }px` } }
              className={ styles.features }
              onMouseDown={ e => e.stopPropagation() }>
    <ExtendedDiv draggable={ true }
                 onTopMove={ onTopMove }
                 onLeftMove={ onLeftMove }
                 className={ styles.blocHeader }><h6>
      Acoustic features
      <IoRemoveCircleOutline onClick={ quit }/>
    </h6></ExtendedDiv>
    <div className={ styles.body }>

      <div className={ styles.line }>
        <b>Quality</b>
        <div className={ styles.switch }>
          <div className={ !focusedAnnotation.acousticFeatures ? styles.active : undefined }
               onClick={ () => removeFeatures(focusedAnnotation) }>
            Bad
          </div>
          <div className={ focusedAnnotation.acousticFeatures ? styles.active : undefined } onClick={ setGood }>
            Good
          </div>
        </div>
      </div>

      { focusedAnnotation.acousticFeatures && <Table columns={ 3 } className={ styles.table } size="small">
          <TableHead isFirstColumn={ true } className={ styles.span2ColsStart }>Feature</TableHead>
          <TableHead>Value</TableHead>

        {/* Frequencies */ }
          <TableDivider/>
          <TableContent isFirstColumn={ true } className={ styles.frequencyCell }>Frequency</TableContent>

          <TableContent>Min</TableContent>
          <TableContent className={ styles.cell }>
              <Input value={ focusedAnnotation.startFrequency! } type="number"
                     min={ 0 } max={ analysis?.fft.samplingFrequency }
                     disabled={ phase?.phase === 'Verification' }
                     onChange={ e => updateMinFrequency(+e.currentTarget.value) }/>
              <IonNote>Hz</IonNote>
          </TableContent>

          <TableDivider className={ styles.span2ColsEnd }/>
          <TableContent>Max</TableContent>
          <TableContent className={ styles.cell }>
              <Input value={ focusedAnnotation.endFrequency! } type="number"
                     min={ 0 } max={ analysis?.fft.samplingFrequency }
                     disabled={ phase?.phase === 'Verification' }
                     onChange={ e => updateMaxFrequency(+e.currentTarget.value) }/>
              <IonNote>Hz</IonNote>
          </TableContent>

          <TableDivider className={ styles.span2ColsEnd }/>
          <TableContent>Range</TableContent>
          <TableContent><IonNote>{ focusedAnnotation.endFrequency! - focusedAnnotation.startFrequency! } Hz</IonNote></TableContent>

          <SelectableFrequencyRow label="Start"
                                  value={ focusedAnnotation.acousticFeatures.startFrequency ?? undefined }
                                  max={ (analysis?.fft.samplingFrequency ?? 0) / 2 }
                                  onChange={ startFrequency => updateFeatures(focusedAnnotation, { startFrequency }) }/>

          <SelectableFrequencyRow label="End"
                                  value={ focusedAnnotation.acousticFeatures.endFrequency ?? undefined }
                                  max={ (analysis?.fft.samplingFrequency ?? 0) / 2 }
                                  onChange={ endFrequency => updateFeatures(focusedAnnotation, { endFrequency }) }/>

        {/* Time */ }
          <TableDivider/>
          <TableContent isFirstColumn={ true } className={ styles.span2ColsStart }>Duration</TableContent>
          <TableContent className={ styles.cell }>
              <Input value={ duration } type="number"
                     step={ 0.001 }
                     min={ 0.01 } max={ spectrogram?.duration ?? 0 }
                     disabled={ phase?.phase === 'Verification' }
                     onChange={ e => updateDuration(+e.currentTarget.value) }/>
              <IonNote>s</IonNote>
          </TableContent>

        {/* Trend */ }
          <TableDivider/>
          <TableContent isFirstColumn={ true } className={ styles.trendCell }>Trend</TableContent>

          <TableContent>General</TableContent>
          <TableContent>
              <Select options={ Object.values(SignalTrendType).map(value => ({ label: value, value } as Item)) }
                      placeholder="Select a value"
                      optionsContainer="popover"
                      value={ focusedAnnotation.acousticFeatures.trend ?? undefined }
                      onValueSelected={ value => updateFeatures(focusedAnnotation, { trend: (value as SignalTrendType) ?? null }) }/>
          </TableContent>

          <TableDivider className={ styles.span2ColsEnd }/>
          <TableContent>Relative min count</TableContent>
          <TableContent>
              <Input value={ focusedAnnotation.acousticFeatures.relativeMinFrequencyCount ?? undefined }
                     type="number" min={ 0 } placeholder="0"
                     onChange={ (e: ChangeEvent<HTMLInputElement>) => updateFeatures(focusedAnnotation, { relativeMinFrequencyCount: e.currentTarget.valueAsNumber }) }/>
          </TableContent>

          <TableDivider className={ styles.span2ColsEnd }/>
          <TableContent>Relative max count</TableContent>
          <TableContent>
              <Input value={ focusedAnnotation.acousticFeatures.relativeMaxFrequencyCount ?? undefined }
                     type="number" min={ 0 } placeholder="0"
                     onChange={ (e: ChangeEvent<HTMLInputElement>) => updateFeatures(focusedAnnotation, { relativeMaxFrequencyCount: e.currentTarget.valueAsNumber }) }/>
          </TableContent>

          <TableDivider className={ styles.span2ColsEnd }/>
          <TableContent>Inflection count</TableContent>
          <TableContent><IonNote>{ (focusedAnnotation.acousticFeatures.relativeMinFrequencyCount ?? 0)
            + (focusedAnnotation.acousticFeatures.relativeMaxFrequencyCount ?? 0) }</IonNote></TableContent>

          <TableDivider className={ styles.span2ColsEnd }/>
          <TableContent>Steps count</TableContent>
          <TableContent>
              <Input value={ focusedAnnotation.acousticFeatures.stepsCount ?? undefined }
                     type="number" min={ 0 } placeholder="0"
                     onChange={ (e: ChangeEvent<HTMLInputElement>) => updateFeatures(focusedAnnotation, { stepsCount: e.currentTarget.valueAsNumber }) }/>
          </TableContent>


          <TableDivider className={ styles.span2ColsEnd }/>
          <TableContent>Has harmonics</TableContent>
          <TableContent>
              <IonCheckbox checked={ !!focusedAnnotation.acousticFeatures.hasHarmonics }
                           onIonChange={ (e: CustomEvent) => updateFeatures(focusedAnnotation, { hasHarmonics: e.detail.checked }) }/>
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
  const getFreqTime = useGetFreqTime()
  const isInAnnotation = useIsInAnnotation()
  const [ isSelecting, setIsSelecting ] = useState<boolean>(false);
  const dispatch = useAppDispatch()
  const focusedAnnotation = useAppSelector(selectAnnotation)
  const isSelectingAnnotationFrequency = useAppSelector(selectIsSelectingPositionForAnnotation)

  const onClick = useCallback((event: MouseEvent) => {
    if (!isSelecting) return;
    event.stopPropagation()
    if (!isSelectingAnnotationFrequency) return;
    if (!focusedAnnotation) return;
    if (!isInAnnotation(event, focusedAnnotation)) return;
    const position = getFreqTime(event)
    if (position) onChange(position.frequency)
    unselect()
  }, [ getFreqTime, isSelecting, isInAnnotation, isSelectingAnnotationFrequency, focusedAnnotation ]);
  useEvent(CLICK_EVENT, onClick)

  const select = useCallback(() => {
    setTimeout(() => setIsSelecting(true), 100);
    if (focusedAnnotation) dispatch(selectPosition(focusedAnnotation))
  }, [ dispatch, focusedAnnotation ])

  const unselect = useCallback(() => {
    setIsSelecting(false)
    dispatch(endPositionSelection())
  }, [ dispatch ])

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
