import { useMemo } from "react";
import { useAnnotatorZoom } from "@/features/Annotator/Zoom";

export const SPECTRO_HEIGHT: number = 512;
export const SPECTRO_WIDTH: number = 1813;
export const Y_WIDTH: number = 35;
export const X_HEIGHT: number = 30;

export const useAnnotatorWindow = () => {
  const { zoom } = useAnnotatorZoom()

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
