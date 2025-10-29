import { useAppDispatch, useAppSelector } from '@/features/App';
import { MouseEvent, PointerEvent, useCallback, useEffect, useRef } from 'react';
import { selectTempAnnotation, setTempAnnotation, type TempAnnotation } from './slice';
import { useFrequencyAxis, useTimeAxis } from '@/features/Annotator/Axis';
import { AnnotationType, useCurrentCampaign } from '@/api';
import { MOUSE_DOWN_EVENT, MOUSE_MOVE_EVENT, MOUSE_UP_EVENT, useEvent } from '@/features/UX/Events';
import { useAnnotatorPointer } from '@/features/Annotator/Pointer';
import { useAnnotatorUX } from '@/features/Annotator/UX';
import { formatTime } from '@/service/function';
import { useAnnotatorLabel } from '@/features/Annotator/Label';
import { useAnnotatorConfidence } from '@/features/Annotator/Confidence';
import { useToast } from '@/components/ui';
import { useAnnotatorAnnotation } from '@/features/Annotator/Annotation';

export const useAnnotatorTempAnnotation = () => {
  const { campaign } = useCurrentCampaign()
  const { isHoverCanvas, getFreqTime, setPosition, clearPosition } = useAnnotatorPointer()
  const tempAnnotation = useAppSelector(state => selectTempAnnotation(state.annotator))
  const tempAnnotationRef = useRef<TempAnnotation | undefined>(tempAnnotation)
  useEffect(() => {
    tempAnnotationRef.current = tempAnnotation
  }, [ tempAnnotation ]);
  const { isDrawingEnabled } = useAnnotatorUX()
  const isDrawingEnabledRef = useRef<boolean>(isDrawingEnabled)
  useEffect(() => {
    isDrawingEnabledRef.current = isDrawingEnabled
  }, [ isDrawingEnabled ]);
  const { focusedLabel } = useAnnotatorLabel()
  const focusLabelRef = useRef<string | undefined>(focusedLabel)
  useEffect(() => {
    focusLabelRef.current = focusedLabel
  }, [ focusedLabel ]);
  const { focusedConfidence } = useAnnotatorConfidence()
  const focusConfidenceRef = useRef<string | undefined>(focusedConfidence)
  useEffect(() => {
    focusConfidenceRef.current = focusedConfidence
  }, [ focusedConfidence ]);
  const { addAnnotation } = useAnnotatorAnnotation()
  const dispatch = useAppDispatch();
  const toast = useToast()

  const { timeScale } = useTimeAxis()
  const { frequencyScale } = useFrequencyAxis()

  const drawTempAnnotation = useCallback((context: CanvasRenderingContext2D) => {
    if (!tempAnnotation) return;
    context.strokeStyle = 'blue';
    context.strokeRect(
        timeScale.valueToPosition(Math.min(tempAnnotation.startTime!, tempAnnotation.endTime!)),
        frequencyScale.valueToPosition(Math.max(tempAnnotation.startFrequency!, tempAnnotation.endFrequency!)),
        Math.floor(timeScale.valuesToPositionRange(tempAnnotation.startTime!, tempAnnotation.endTime!)),
        frequencyScale.valuesToPositionRange(tempAnnotation.startFrequency!, tempAnnotation.endFrequency!),
    );
  }, [ tempAnnotation, timeScale, frequencyScale ])

  const onStartTempAnnotation = useCallback((e: MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingEnabledRef.current) return;
    if (!isHoverCanvas(e)) return;
    const data = getFreqTime(e);
    if (!data) return;

    dispatch(setTempAnnotation({
      type: AnnotationType.Box,
      startTime: data.time,
      endTime: data.time,
      startFrequency: data.frequency,
      endFrequency: data.frequency,
    }))
  }, [ isHoverCanvas, getFreqTime ])
  useEvent(MOUSE_DOWN_EVENT, onStartTempAnnotation);

  const onUpdateTempAnnotation = useCallback((e: PointerEvent<HTMLDivElement>) => {
    const isHover = isHoverCanvas(e)
    const data = getFreqTime(e);
    if (data) {
      if (isHover) setPosition(data)
      if (tempAnnotationRef.current) {
        dispatch(setTempAnnotation({
          ...tempAnnotationRef.current,
          endTime: data.time,
          endFrequency: data.frequency,
        }))
      }
    }
    if (!isHover || !data) clearPosition()
  }, [ isHoverCanvas, getFreqTime, setPosition, clearPosition ])
  useEvent(MOUSE_MOVE_EVENT, onUpdateTempAnnotation);

  const onEndNewAnnotation = useCallback((e: PointerEvent<HTMLDivElement>) => {
    if (tempAnnotationRef.current && focusLabelRef.current) {
      const data = getFreqTime(e);
      if (data) {
        tempAnnotationRef.current.endTime = data.time;
        tempAnnotationRef.current.endFrequency = data.frequency;
      }
      if (tempAnnotationRef.current.type !== AnnotationType.Box) return;
      const start_time = Math.min(tempAnnotationRef.current.startTime!, tempAnnotationRef.current.endTime!);
      const end_time = Math.max(tempAnnotationRef.current.startTime!, tempAnnotationRef.current.endTime!);
      const start_frequency = Math.min(tempAnnotationRef.current.startFrequency!, tempAnnotationRef.current.endFrequency!);
      const end_frequency = Math.max(tempAnnotationRef.current.startFrequency!, tempAnnotationRef.current.endFrequency!);
      tempAnnotationRef.current.startTime = start_time;
      tempAnnotationRef.current.endTime = end_time;
      tempAnnotationRef.current.startFrequency = start_frequency;
      tempAnnotationRef.current.endFrequency = end_frequency;

      if (!frequencyScale.isRangeContinuouslyOnScale(start_frequency, end_frequency)) {
        toast.raiseError({
          message: `Be careful, your annotation overlaps a void in the frequency scale.
         Are you sure your annotation goes from ${ start_frequency.toFixed(0) }Hz to ${ end_frequency.toFixed(0) }Hz?`,
        })
      }
      if (!timeScale.isRangeContinuouslyOnScale(start_time, end_time)) {
        toast.raiseError({
          message: `Be careful, your annotation overlaps a void in the time scale.
         Are you sure your annotation goes from ${ formatTime(start_time) } to ${ formatTime(end_time) }?`,
        })
      }
      const width = timeScale.valuesToPositionRange(tempAnnotationRef.current.startTime, tempAnnotationRef.current.endTime);
      const height = frequencyScale.valuesToPositionRange(tempAnnotationRef.current.startFrequency, tempAnnotationRef.current.endFrequency);
      if (width > 2 && height > 2) {
        addAnnotation({
          type: AnnotationType.Box,
          startTime: tempAnnotationRef.current.startTime,
          startFrequency: tempAnnotationRef.current.startFrequency,
          endTime: tempAnnotationRef.current.endTime,
          endFrequency: tempAnnotationRef.current.endFrequency,
          label: focusLabelRef.current,
          confidence: focusConfidenceRef.current ?? undefined,
        })
      } else if (campaign?.allowPointAnnotation) {
        addAnnotation({
          type: AnnotationType.Point,
          startTime: tempAnnotationRef.current.startTime,
          startFrequency: tempAnnotationRef.current.endFrequency,
          label: focusLabelRef.current,
          confidence: focusConfidenceRef.current ?? undefined,
        })
      }
    }
    tempAnnotationRef.current = undefined;
    if (!isHoverCanvas(e)) clearPosition()
  }, [ clearPosition, addAnnotation, getFreqTime, timeScale, frequencyScale, campaign ])
  useEvent(MOUSE_UP_EVENT, onEndNewAnnotation);

  return {
    tempAnnotation,
    drawTempAnnotation,
    onStartTempAnnotation,
  }
}
