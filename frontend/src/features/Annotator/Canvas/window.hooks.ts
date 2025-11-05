import { useAppSelector } from '@/features/App';
import { selectZoom } from '@/features/Annotator/Zoom/slice';
import { useMemo } from 'react';

export const SPECTRO_HEIGHT: number = 512;
export const SPECTRO_WIDTH: number = 1813;
export const Y_WIDTH: number = 35;
export const X_HEIGHT: number = 30;

export const useAnnotatorWindow = () => {
  const zoom = useAppSelector(state => selectZoom(state.annotator))

  return useMemo(() => {
    const ratio = window.devicePixelRatio * (1920 / (window.screen.width * window.devicePixelRatio));
    const containerWidth = SPECTRO_WIDTH / ratio;
    return {
      containerWidth,
      width: containerWidth * zoom,
      height: SPECTRO_HEIGHT / ratio,
      xAxisHeight: X_HEIGHT,
      yAxisWidth: Y_WIDTH,
    }
  }, [ zoom ])
}
