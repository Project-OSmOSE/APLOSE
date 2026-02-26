import { useWindowRatio } from '@/components/ui';
import { useMemo } from 'react';

export const SpectrogramDimensions = {
  height: 512,
  width: 1813,
}

export const useSpectrogramDimensions = (zoomLevel: number = 0) => {
  const ratio = useWindowRatio()
  const width = useMemo(() => {
    return (SpectrogramDimensions.width / ratio) * Math.pow(2, zoomLevel)
  }, [ ratio, zoomLevel ])
  const height = useMemo(() => {
    return SpectrogramDimensions.height / ratio
  }, [ ratio ])

  return {
    originalWidth: SpectrogramDimensions.width,
    originalHeight: SpectrogramDimensions.height,
    width,
    height,
  }
}
