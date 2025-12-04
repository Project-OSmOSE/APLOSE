import { useCallback } from 'react';
import { useAppSelector } from '@/features/App';
import { selectBrightness, selectColormap, selectContrast, selectIsColormapReversed } from './selectors'
import { COLORMAPS, createColormap } from './colormaps'
import { useWindowHeight, useWindowWidth } from '@/features/Annotator/Canvas';


function interpolate(value: number, minSource: number, maxSource: number, minTarget: number, maxTarget: number): number {
  const ratio: number = (maxTarget - minTarget) / (maxSource - minSource);
  const offset: number = minTarget - minSource * ratio;
  return ratio * value + offset;
}

export const useApplyFilter = () => {
  const brightness = useAppSelector(selectBrightness);
  const contrast = useAppSelector(selectContrast);

  return useCallback((context: CanvasRenderingContext2D) => {
    const compBrightness: number = Math.round(interpolate(brightness, 0, 100, 50, 150));
    const compContrast: number = Math.round(interpolate(contrast, 0, 100, 50, 150));
    context.filter = `brightness(${ compBrightness.toFixed() }%) contrast(${ compContrast.toFixed() }%)`;
  }, [ brightness, contrast ])
}

export const useApplyColormap = () => {
  const colormap = useAppSelector(selectColormap);
  const isColormapReversed = useAppSelector(selectIsColormapReversed);
  const width = useWindowWidth()
  const height = useWindowHeight()

  return useCallback((context: CanvasRenderingContext2D) => {
    if (!colormap) return;
    const imgData = context.getImageData(0, 0, width, height);
    const data = imgData.data;
    const colormapObj = createColormap({ colormap: COLORMAPS[colormap], nshades: 256 });

    for (let i = 0; i < data.length; i += 4) {
      const newColor = isColormapReversed ? colormapObj[255 - data[i]] : colormapObj[data[i]];
      data[i] = newColor[0];
      data[i + 1] = newColor[1];
      data[i + 2] = newColor[2];
    }
    context.putImageData(imgData, 0, 0);
  }, [ colormap, isColormapReversed, width, height ])
}