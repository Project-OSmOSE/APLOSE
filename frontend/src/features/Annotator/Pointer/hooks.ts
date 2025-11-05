import { useCallback } from 'react';
import { useAnnotatorWindow } from '@/features/Annotator/Canvas';
import { useFrequencyAxis, useTimeAxis } from '@/features/Annotator/Axis';
import { clearPosition, type Position, selectPosition, setPosition, type TimeFreqPosition } from './slice';
import { useAppDispatch, useAppSelector } from '@/features/App';
import { useAnnotatorCanvasContext } from '@/features/Annotator/Canvas/context';

export const useAnnotatorPointer = () => {
  const { height, width } = useAnnotatorWindow()
  const { mainCanvas } = useAnnotatorCanvasContext()
  const { timeScale } = useTimeAxis()
  const { frequencyScale } = useFrequencyAxis()
  const dispatch = useAppDispatch()

  const isSpectroCanvas = useCallback((element: Element): boolean => {
    return element instanceof HTMLCanvasElement
      && element.height === Math.floor(height)
      && element.width === Math.floor(width)
  }, [ height, width ])
  const isHoverCanvas = useCallback((e: Position): boolean => {
    return document.elementsFromPoint(e.clientX, e.clientY).some(isSpectroCanvas);
  }, [ isSpectroCanvas ])

  const getCoords = useCallback((e: Position, corrected: boolean = true): { x: number, y: number } | undefined => {
    const canvas = mainCanvas;
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
  }, [ mainCanvas ])

  const getFreqTime = useCallback((e: Position): TimeFreqPosition | undefined => {
    const coords = getCoords(e);
    if (!coords) return;
    return {
      frequency: frequencyScale.positionToValue(coords.y),
      time: timeScale.positionToValue(coords.x),
    }
  }, [ getCoords, timeScale, frequencyScale ]);

  return {
    isHoverCanvas,
    getCoords,
    getFreqTime,
    position: useAppSelector(state => selectPosition(state.annotator)),
    setPosition: useCallback((position: TimeFreqPosition) => {
      dispatch(setPosition(position))
    }, []),
    clearPosition: useCallback(() => {
      dispatch(clearPosition())
    }, []),
  }
}
