import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/features';
import {
  resetBrightness,
  resetContrast,
  revertColormap,
  selectBrightness,
  selectColormap,
  selectContrast,
  selectIsColormapReversed,
  setBrightness,
  setColormap,
  setContrast,
} from './slice'
import { Colormap, COLORMAPS, createColormap } from './colormaps'
import { useCurrentCampaign } from '@/api';
import { useAnnotatorAnalysis } from '@/features/Annotator/Analysis';
import { useAnnotatorWindow } from '@/features/Annotator/Canvas';


function interpolate(value: number, minSource: number, maxSource: number, minTarget: number, maxTarget: number): number {
  const ratio: number = (maxTarget - minTarget) / (maxSource - minSource);
  const offset: number = minTarget - minSource * ratio;
  return ratio * value + offset;
}

export const useAnnotatorVisualConfiguration = () => {
  const { campaign } = useCurrentCampaign()
  const { analysis } = useAnnotatorAnalysis()
  const brightness = useAppSelector(state => selectBrightness(state.annotator));
  const contrast = useAppSelector(state => selectContrast(state.annotator));
  const colormap = useAppSelector(state => selectColormap(state.annotator));
  const isColormapReversed = useAppSelector(state => selectIsColormapReversed(state.annotator));
  const dispatch = useAppDispatch();
  const { width, height } = useAnnotatorWindow()

  const applyFilter = useCallback((context: CanvasRenderingContext2D) => {
    const compBrightness: number = Math.round(interpolate(brightness, 0, 100, 50, 150));
    const compContrast: number = Math.round(interpolate(contrast, 0, 100, 50, 150));
    context.filter = `brightness(${ compBrightness.toFixed() }%) contrast(${ compContrast.toFixed() }%)`;
  }, [ brightness, contrast ])

  const applyColormap = useCallback((context: CanvasRenderingContext2D) => {
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

  return {
    brightness,
    setBrightness: useCallback((value: number) => dispatch(setBrightness(value)), []),
    resetBrightness: useCallback(() => dispatch(resetBrightness()), []),

    contrast,
    setContrast: useCallback((value: number) => dispatch(setContrast(value)), []),
    resetContrast: useCallback(() => dispatch(resetContrast()), []),

    canChangeColormap: useMemo(() => {
      return !!campaign?.allowColormapTuning && !!analysis && analysis.colormap.name === 'Greys' as Colormap
    }, [ campaign, analysis ]),
    colormap,
    setColormap: useCallback((value?: Colormap) => dispatch(setColormap(value)), []),

    isColormapReversed,
    revertColormap: useCallback(() => dispatch(revertColormap()), []),

    applyFilter,
    applyColormap,
  }
}