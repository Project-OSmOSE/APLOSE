import { useAppDispatch, useAppSelector } from '@/features/App';
import { MouseEvent, PointerEvent, useCallback } from 'react';
import { clearTempAnnotation, setTempAnnotation } from './slice';
import { selectTempAnnotation } from './selectors';
import { useFrequencyScale, useTimeScale } from '@/features/Annotator/Axis';
import { AnnotationType, useCurrentCampaign } from '@/api';
import { MOUSE_DOWN_EVENT, MOUSE_MOVE_EVENT, MOUSE_UP_EVENT, useEvent } from '@/features/UX/Events';
import { clearPosition, setPosition, useGetFreqTime, useIsHoverCanvas } from '@/features/Annotator/Pointer';
import { formatTime } from '@/service/function';
import { selectFocusLabel } from '@/features/Annotator/Label';
import { selectFocusConfidence } from '@/features/Annotator/Confidence';
import { useToast } from '@/components/ui';
import { useAddAnnotation } from '@/features/Annotator/Annotation';
import { selectIsDrawingEnabled } from '@/features/Annotator/UX';


export const useDrawTempAnnotation = () => {
  const tempAnnotation = useAppSelector(selectTempAnnotation)
  const timeScale = useTimeScale()
  const frequencyScale = useFrequencyScale()

  return useCallback((context: CanvasRenderingContext2D) => {
    if (!tempAnnotation) return;
    context.strokeStyle = 'blue';
    context.strokeRect(
      timeScale.valueToPosition(Math.min(tempAnnotation.startTime!, tempAnnotation.endTime!)),
      frequencyScale.valueToPosition(Math.max(tempAnnotation.startFrequency!, tempAnnotation.endFrequency!)),
      Math.floor(timeScale.valuesToPositionRange(tempAnnotation.startTime!, tempAnnotation.endTime!)),
      frequencyScale.valuesToPositionRange(tempAnnotation.startFrequency!, tempAnnotation.endFrequency!),
    );
  }, [ tempAnnotation, timeScale, frequencyScale ])
}

export const useTempAnnotationsEvents = () => {
  const tempAnnotation = useAppSelector(selectTempAnnotation)
  const isDrawingEnabled = useAppSelector(selectIsDrawingEnabled);
  const timeScale = useTimeScale()
  const frequencyScale = useFrequencyScale()
  const focusedLabel = useAppSelector(selectFocusLabel)
  const focusedConfidence = useAppSelector(selectFocusConfidence)
  const { campaign } = useCurrentCampaign()

  const addAnnotation = useAddAnnotation()
  const getFreqTime = useGetFreqTime()
  const isHoverCanvas = useIsHoverCanvas()
  const dispatch = useAppDispatch();
  const toast = useToast()

  const onStartTempAnnotation = useCallback((e: MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingEnabled) return;
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
  }, [ isHoverCanvas, getFreqTime, isDrawingEnabled ])
  useEvent(MOUSE_DOWN_EVENT, onStartTempAnnotation);

  const onUpdateTempAnnotation = useCallback((e: PointerEvent<HTMLDivElement>) => {
    const isHover = isHoverCanvas(e)
    const data = getFreqTime(e);
    if (data) {
      if (isHover) dispatch(setPosition(data))
      if (tempAnnotation) {
        dispatch(setTempAnnotation({
          ...tempAnnotation,
          endTime: data.time,
          endFrequency: data.frequency,
        }))
      }
    }
    if (!isHover || !data) dispatch(clearPosition())
  }, [ isHoverCanvas, getFreqTime, dispatch, tempAnnotation ])
  useEvent(MOUSE_MOVE_EVENT, onUpdateTempAnnotation);

  const onEndNewAnnotation = useCallback((e: PointerEvent<HTMLDivElement>) => {
    if (tempAnnotation && focusedLabel) {
      const annotation = { ...tempAnnotation }
      const data = getFreqTime(e);
      if (data) {
        annotation.endTime = data.time;
        annotation.endFrequency = data.frequency;
      }
      if (annotation.type !== AnnotationType.Box) return;
      const start_time = Math.min(annotation.startTime!, annotation.endTime!);
      const end_time = Math.max(annotation.startTime!, annotation.endTime!);
      const start_frequency = Math.min(annotation.startFrequency!, annotation.endFrequency!);
      const end_frequency = Math.max(annotation.startFrequency!, annotation.endFrequency!);
      annotation.startTime = start_time;
      annotation.endTime = end_time;
      annotation.startFrequency = start_frequency;
      annotation.endFrequency = end_frequency;

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
      const width = timeScale.valuesToPositionRange(annotation.startTime, annotation.endTime);
      const height = frequencyScale.valuesToPositionRange(annotation.startFrequency, annotation.endFrequency);
      if (width > 2 && height > 2) {
        addAnnotation({
          type: AnnotationType.Box,
          startTime: annotation.startTime,
          startFrequency: annotation.startFrequency,
          endTime: annotation.endTime,
          endFrequency: annotation.endFrequency,
          label: focusedLabel,
          confidence: focusedConfidence ?? undefined,
        })
      } else if (campaign?.allowPointAnnotation) {
        addAnnotation({
          type: AnnotationType.Point,
          startTime: annotation.startTime,
          startFrequency: annotation.endFrequency,
          label: focusedLabel,
          confidence: focusedConfidence ?? undefined,
        })
      }
    }
    dispatch(clearTempAnnotation())
    if (!isHoverCanvas(e)) dispatch(clearPosition())
  }, [ dispatch, addAnnotation, getFreqTime, timeScale, frequencyScale, campaign, focusedLabel, focusedConfidence, tempAnnotation ])
  useEvent(MOUSE_UP_EVENT, onEndNewAnnotation);

  return { onStartTempAnnotation }
}
