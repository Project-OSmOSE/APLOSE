import { useAppSelector } from "@/service/app.ts";
import { useMemo } from "react";
import { SPECTRO_HEIGHT, SPECTRO_WIDTH } from "../const";
import { useAnnotatorInput } from "./input.hook";

export const useSpectrogram = () => {
  const { zoom } = useAnnotatorInput()
  const { disableSpectrogramResize } = useAppSelector(state => state.settings)


  const ratio = useMemo(() => {
    if (disableSpectrogramResize) return 1;
    const screenRatio = (1920 / (window.screen.width * window.devicePixelRatio))
    return window.devicePixelRatio * screenRatio;
  }, [ window.devicePixelRatio, window.screen, disableSpectrogramResize ]);

  const containerWidth = useMemo(() => SPECTRO_WIDTH / ratio, [ ratio ])

  const width = useMemo(() => containerWidth * zoom, [ containerWidth, zoom ])

  const height = useMemo(() => SPECTRO_HEIGHT / ratio, [ ratio ])

  return { containerWidth, width, height }
}