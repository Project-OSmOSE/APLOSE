import { useCallback } from 'react';
import { useWindowHeight, useWindowWidth } from '@/features/Annotator/Canvas';
import { useFrequencyScale, useTimeScale } from '@/features/Annotator/Axis';
import { type Position, type TimeFreqPosition } from './context';
import { useAnnotatorCanvasContext } from '@/features/Annotator/Canvas/context';
import type { AnnotationNode } from '@/api';

export const useIsHoverCanvas = () => {
  const width = useWindowWidth()
  const height = useWindowHeight()

  return useCallback((e: Position): boolean => {
    return document.elementsFromPoint(e.clientX, e.clientY).some((element: Element): boolean => {
      return element instanceof HTMLCanvasElement
        && element.height === Math.floor(height)
        && element.width === Math.floor(width)
    });
  }, [ width, height ])
}

export const useGetCoords = () => {
  const { mainCanvasRef } = useAnnotatorCanvasContext()

  return useCallback((e: Position, corrected: boolean = true): { x: number, y: number } | undefined => {
    const canvas = mainCanvasRef?.current;
    if (!canvas) return;
    const bounds = canvas.getBoundingClientRect();
    const x = e.clientX - bounds.x
    const y = e.clientY - bounds.y;
    if (corrected) {
      return {
        x: Math.min(Math.max(0, x), bounds.width),
        y: Math.min(Math.max(0, y), bounds.height),
      }
    } else return { x, y }
  }, [])
}

export const useGetFreqTime = () => {
  const getCoords = useGetCoords()
  const timeScale = useTimeScale()
  const frequencyScale = useFrequencyScale()

  return useCallback((e: Position): TimeFreqPosition | undefined => {
    const coords = getCoords(e);
    if (!coords) return;
    return {
      frequency: +frequencyScale.positionToValue(coords.y)?.toFixed(3),
      time: +timeScale.positionToValue(coords.x)?.toFixed(3),
    }
  }, [ getCoords, timeScale, frequencyScale ]);
}

export const useIsInAnnotation = () => {
  const getFreqTime = useGetFreqTime()

  return useCallback((event: Position, annotation: Pick<AnnotationNode, 'startFrequency' | 'endFrequency' | 'startTime' | 'endTime'>) => {
    const position = getFreqTime(event);
    if (!position) return false;
    if (annotation.startTime && position.time < annotation.startTime) return false
    if (annotation.endTime && position.time > annotation.endTime) return false
    if (annotation.startFrequency && position.frequency < annotation.startFrequency) return false
    return !(annotation.endFrequency && position.frequency > annotation.endFrequency);

  }, [getFreqTime])
}