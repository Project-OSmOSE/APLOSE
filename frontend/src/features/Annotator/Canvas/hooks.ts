import { useAnnotatorCanvasContext } from './context';
import { useCallback } from 'react';
import { useWindowContainerWidth, useWindowHeight, Y_AXIS_WIDTH } from '@/features/Annotator/Canvas/window.hooks';
import { useTimeScale } from '@/features/Annotator/Axis';


export const useFocusCanvasOnTime = () => {
    const timeScale = useTimeScale()
    const containerWidth = useWindowContainerWidth()
    const { windowCanvasRef } = useAnnotatorCanvasContext()

    return useCallback((time: number) => {
        const left = timeScale.valueToPosition(time) - containerWidth / 2;
        windowCanvasRef?.current?.scrollTo({ left })
    }, [ timeScale, containerWidth, windowCanvasRef ])
} 

export const useDownloadCanvas = () => {
    const height = useWindowHeight()

    const { displayCanvasRef, xAxisCanvasRef, yAxisCanvasRef } = useAnnotatorCanvasContext()

    return useCallback(async (filename: string) => {
        const link = document.createElement('a');
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Cannot get fake canvas 2D context');

        // Get spectro images
        const spectroDataURL = displayCanvasRef?.current?.toDataURL('image/png');
        if (!spectroDataURL) throw new Error('Cannot recover spectro dataURL');
        const spectroImg = new Image();

        // Get frequency scale
        const freqDataURL = yAxisCanvasRef?.current?.toDataURL('image/png');
        if (!freqDataURL) throw new Error('Cannot recover frequency dataURL');
        const freqImg = new Image();

        // Get timescale
        const timeDataURL = xAxisCanvasRef?.current?.toDataURL('image/png');
        if (!timeDataURL) throw new Error('Cannot recover time dataURL');
        const timeImg = new Image();

        // Compute global canvas
        /// Load images
        await new Promise((resolve, reject) => {
            let isSpectroLoaded = false;
            let isFreqLoaded = false;
            let isTimeLoaded = false;
            spectroImg.onerror = e => reject(e)
            freqImg.onerror = e => reject(e)
            timeImg.onerror = e => reject(e)

            spectroImg.onload = () => {
                isSpectroLoaded = true;
                if (isFreqLoaded && isTimeLoaded) resolve(true);
            }
            freqImg.onload = () => {
                isFreqLoaded = true;
                if (isSpectroLoaded && isTimeLoaded) resolve(true);
            }
            timeImg.onload = () => {
                isTimeLoaded = true;
                if (isSpectroLoaded && isFreqLoaded) resolve(true);
            }

            spectroImg.src = spectroDataURL;
            freqImg.src = freqDataURL;
            timeImg.src = timeDataURL;
        });
        canvas.height = timeImg.height + spectroImg.height;
        canvas.width = freqImg.width + spectroImg.width;

        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height)

        context.drawImage(spectroImg, Y_AXIS_WIDTH, 0, spectroImg.width, spectroImg.height);
        context.drawImage(freqImg, 0, 0, freqImg.width, freqImg.height);
        context.drawImage(timeImg, Y_AXIS_WIDTH, height, timeImg.width, timeImg.height);

        const canvasData = canvas.toDataURL('image/png')

        if (!canvasData) return;
        link.href = canvasData;
        link.target = '_blank';
        link.download = filename;
        link.click();
    }, [ height, displayCanvasRef, xAxisCanvasRef, yAxisCanvasRef ])
}
