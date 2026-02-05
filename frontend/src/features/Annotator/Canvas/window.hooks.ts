import { useAppSelector } from '@/features/App';
import { selectZoom } from '@/features/Annotator/Zoom';
import { useMemo } from 'react';
import { useWindowRatio } from '@/components/ui';

const SPECTRO_HEIGHT: number = 512;
const SPECTRO_WIDTH: number = 1813;
export const Y_AXIS_WIDTH: number = 35;
export const X_AXIS_HEIGHT: number = 30;


export const useWindowContainerWidth = () => {
  const ratio = useWindowRatio()
  return useMemo(() => SPECTRO_WIDTH / ratio, [ ratio ])
}

export const useWindowWidth = () => {
  const zoom = useAppSelector(selectZoom)
  const containerWidth = useWindowContainerWidth()

  return useMemo(() => containerWidth * zoom, [ containerWidth, zoom ])
}

export const useWindowHeight = () => {
  const ratio = useWindowRatio()

  return useMemo(() => SPECTRO_HEIGHT / ratio, [ ratio ])
}
