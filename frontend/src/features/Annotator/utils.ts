import { useMemo } from "react";

export const useAnnotatorUtils = () => {

  const ratio = useMemo(() => {
    const screenRatio = (1920 / (window.screen.width * window.devicePixelRatio))
    return window.devicePixelRatio * screenRatio;
  }, [ window.devicePixelRatio, window.screen, ]);

  return { ratio }
}