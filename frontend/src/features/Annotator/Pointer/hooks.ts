import { useCallback, useEffect, useRef } from 'react';
import { useAnnotatorWindow } from '@/features/Annotator/Canvas';
import { useFrequencyAxis, useTimeAxis } from '@/features/Annotator/Axis';
import type { ScaleService } from '@/components/ui';
import { clearPosition, type Position, selectPosition, setPosition, type TimeFreqPosition } from './slice';
import { useAppDispatch, useAppSelector } from '@/features';
import { useAnnotatorCanvasContext } from '@/features/Annotator/Canvas/context';

export const useAnnotatorPointer = () => {
  const { height, width } = useAnnotatorWindow()
  const heightRef = useRef<number>(height);
  const widthRef = useRef<number>(width);
  useEffect(() => {
    heightRef.current = height
    widthRef.current = width
  }, [ height, width ]);
  const { mainCanvas } = useAnnotatorCanvasContext()
  const mainCanvasRef = useRef<HTMLCanvasElement | undefined>(mainCanvas);
  useEffect(() => {
    mainCanvasRef.current = mainCanvas
  }, [ mainCanvas ]);
  const { timeScale } = useTimeAxis()
  const { frequencyScale } = useFrequencyAxis()
  const timeScaleRef = useRef<ScaleService>(timeScale);
  const frequencyScaleRef = useRef<ScaleService>(frequencyScale);
  useEffect(() => {
    timeScaleRef.current = timeScale
    frequencyScaleRef.current = frequencyScale
  }, [ timeScale, frequencyScale ]);
  const dispatch = useAppDispatch()

  const isSpectroCanvas = useCallback((element: Element): boolean => {
    return element instanceof HTMLCanvasElement
      && element.height === Math.floor(heightRef.current)
      && element.width === Math.floor(widthRef.current)
  }, [])
  const isHoverCanvas = useCallback((e: Position): boolean => {
    return document.elementsFromPoint(e.clientX, e.clientY).some(isSpectroCanvas);
  }, [ isSpectroCanvas ])

  const getCoords = useCallback((e: Position, corrected: boolean = true): { x: number, y: number } | undefined => {
    const canvas = mainCanvasRef.current;
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

  const getFreqTime = useCallback((e: Position): TimeFreqPosition | undefined => {
    const coords = getCoords(e);
    if (!coords) return;
    return {
      frequency: frequencyScaleRef.current.positionToValue(coords.y),
      time: timeScaleRef.current.positionToValue(coords.x),
    }
  }, [ getCoords ]);

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
