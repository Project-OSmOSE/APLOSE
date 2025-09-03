import React, { useCallback, useEffect, useImperativeHandle, useRef } from "react";
import { formatTime } from "@/service/function";
import { useAnnotatorQuery, useSpectrogram, useXAxis, X_HEIGHT } from "@/features/Annotator";

export type AxisRef = {
  toDataURL(type?: string, quality?: any): string | undefined;
}

export const XAxis = React.forwardRef<AxisRef, {
  className?: string;
}>(({ className }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { width } = useSpectrogram()
  const { data } = useAnnotatorQuery()

  useImperativeHandle(ref, () => ({
    toDataURL: (type?: string, quality?: any) => canvasRef.current?.toDataURL(type, quality)
  }), [ canvasRef.current ]);

  const xAxis = useXAxis()

  useEffect(() => {
    display()
  }, [ canvasRef, width ]);

  const getTimeSteps = useCallback(() => {
    if (!data?.spectrogramById || data.spectrogramById.duration <= 60) return { step: 1, bigStep: 5 }
    else if (data.spectrogramById.duration > 60 && data.spectrogramById.duration <= 120) return { step: 2, bigStep: 5 }
    else if (data.spectrogramById.duration > 120 && data.spectrogramById.duration <= 500) return { step: 4, bigStep: 5 }
    else if (data.spectrogramById.duration > 500 && data.spectrogramById.duration <= 1000) return {
      step: 10,
      bigStep: 60
    }
    else return { step: 30, bigStep: 120 }
  }, [ data ])

  const display = useCallback((): void => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d');
    if (!canvas || !context || !width || !data?.spectrogramById) return;

    context.clearRect(0, 0, width, X_HEIGHT);

    const steps = getTimeSteps();

    context.fillStyle = 'rgba(0, 0, 0)';
    context.font = "500 10px 'Exo 2'";

    for (let i = 0; i <= data.spectrogramById.duration; i++) {
      if (i % steps.step === 0) {
        const x: number = xAxis.valueToPosition(i);

        if (i % steps.bigStep === 0) {
          // Bar
          context.fillRect(x <= canvas.width - 2 ? x : canvas.width - 2, 0, 2, 15);

          // Text
          const timeText: string = formatTime(i);
          let xTxt: number = x;
          if (xTxt === 0) {
            context.textAlign = "left"
          } else if (xTxt > (width - timeText.length * 8)) {
            context.textAlign = "right"
            xTxt -= 8;
          } else {
            context.textAlign = "center"
          }
          context.fillText(timeText, xTxt, 25);
        } else {
          // Bar only
          context.fillRect(x, 0, 1, 10);
        }
      }
    }
  }, [ width, data, getTimeSteps, xAxis ])

  return <canvas ref={ canvasRef }
                 width={ width }
                 height={ X_HEIGHT }
                 className={ className }/>
})
