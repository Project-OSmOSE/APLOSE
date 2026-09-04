import React, {
    createContext,
    type Dispatch,
    type HTMLProps,
    type SetStateAction,
    useCallback,
    useContext,
    useMemo,
    useState,
} from 'react';
import { type Colormap, COLORMAPS, createColormap } from '@/features/Colormap';

type ImageSettingsContext = {
    allowColormapChange: boolean,
    allowImageTuning: boolean,

    colormap: Colormap | null,
    setColormap: (color: Colormap | null) => void,

    isColormapInverted: boolean,
    setIsColormapInverted: Dispatch<SetStateAction<boolean>>,
    revertColormap: () => void,

    brightness: number;
    setBrightness: (value: number) => void,
    resetBrightness: () => void,

    contrast: number;
    setContrast: (value: number) => void,
    resetContrast: () => void,

    canvasFilter: string;
    applyImageToCanvas: (canvas: HTMLCanvasElement, image: HTMLImageElement, dx: number, dy: number, width: number, height: number) => Promise<void>,

    isUpdating: boolean,
    setIsUpdating: Dispatch<SetStateAction<boolean>>,
}
const ImageSettingsContext = createContext<ImageSettingsContext>({
    allowColormapChange: false,
    allowImageTuning: false,

    colormap: null,
    setColormap: () => null,

    isColormapInverted: false,
    setIsColormapInverted: () => null,
    revertColormap: () => null,

    brightness: 50,
    setBrightness: () => null,
    resetBrightness: () => null,

    contrast: 50,
    setContrast: () => null,
    resetContrast: () => null,

    canvasFilter: '',
    applyImageToCanvas: async () => undefined,

    isUpdating: false,
    setIsUpdating: () => null,
})

/** Zoom.useContext
 *
 * Use within Zoom.Root
 */
export const useImageSettingsContext = () => {
    const context = useContext(ImageSettingsContext);
    if (!context) {
        throw new Error('ImageSettings.useContext must be used within a ImageSettings.Root');
    }
    return context;
}

function interpolate(value: number, minSource: number, maxSource: number, minTarget: number, maxTarget: number): number {
    const ratio: number = (maxTarget - minTarget) / (maxSource - minSource);
    const offset: number = minTarget - minSource * ratio;
    return ratio * value + offset;
}

type Props = Pick<HTMLProps<HTMLDivElement>, 'children'> & {
    allowColormapChange: boolean
    allowImageTuning: boolean
}
export const ImageSettingsRoot: React.FC<Props> = ({ children, allowColormapChange, allowImageTuning }) => {
    const [ colormap, _setColormap ] = useState<Colormap | null>(null);
    const setColormap = useCallback((colormap: Colormap | null) => {
        if (!allowColormapChange) return;
        _setColormap(colormap);
    }, [ allowColormapChange ])
    const [ isColormapInverted, setIsColormapInverted ] = useState<boolean>(false);
    const [ brightness, setBrightness ] = useState<number>(50);
    const [ contrast, setContrast ] = useState<number>(50);
    const [ isUpdating, setIsUpdating ] = useState<boolean>(false)

    const revertColormap = useCallback(() => setIsColormapInverted(prev => !prev), [])
    const resetBrightness = useCallback(() => setBrightness(50), [])
    const resetContrast = useCallback(() => setContrast(50), [])

    const canvasFilter = useMemo(() => {
        const compBrightness: number = Math.round(interpolate(brightness, 0, 100, 50, 150));
        const compContrast: number = Math.round(interpolate(contrast, 0, 100, 50, 150));
        return `brightness(${ compBrightness.toFixed() }%) contrast(${ compContrast.toFixed() }%)`;
    }, [ brightness, contrast ])

    // TODO: try optimize process using WebGL (GPU instead of CPU) to process the image
    const applyImageToCanvas = useCallback(async (canvas: HTMLCanvasElement, image: HTMLImageElement, dx: number, dy: number, width: number, height: number) => {
        const context = canvas.getContext('2d', { alpha: false });
        if (!context) return;
        let finalImage = image;
        if (allowColormapChange && colormap) {
            // 1. Get ImageData from HTMLImageElement
            const imgCanvas = document.createElement('canvas');
            const imgContext = imgCanvas.getContext('2d')!
            imgCanvas.width = width;
            imgCanvas.height = height;
            imgContext.drawImage(image, 0, 0, width, height);
            const imgData = imgContext.getImageData(0, 0, width, height);

            //  2. Apply new colormap
            const colormapObj = createColormap({ colormap: COLORMAPS[colormap], nshades: 256 });
            for (let i = 0; i < imgData.data.length; i += 4) {
                const newColor = isColormapInverted ? colormapObj[255 - imgData.data[i]] : colormapObj[imgData.data[i]];
                imgData.data[i] = newColor[0];
                imgData.data[i + 1] = newColor[1];
                imgData.data[i + 2] = newColor[2];
            }

            // 3. Recover HTMLImageElement from ImageData
            const coloredImgCanvas = document.createElement('canvas');
            const coloredImgContext = coloredImgCanvas.getContext('2d')!
            coloredImgCanvas.width = width;
            coloredImgCanvas.height = height;
            coloredImgContext.putImageData(imgData, 0, 0)
            finalImage = new Image()
            const loadPromise = new Promise((resolve, reject) => {
                finalImage.onload = () => resolve(finalImage);
                finalImage.onerror = () => reject(`Could not resolve dataURL: ${ colormap }`);
            });
            finalImage.src = coloredImgCanvas.toDataURL();
            await loadPromise
        }
        context.drawImage(finalImage, dx, dy, width, height)
        context.filter = canvasFilter
    }, [ allowColormapChange, colormap, isColormapInverted, canvasFilter ])

    return <ImageSettingsContext.Provider value={ {
        allowColormapChange, allowImageTuning,
        colormap, setColormap,
        isColormapInverted, setIsColormapInverted, revertColormap,
        brightness, setBrightness, resetBrightness,
        contrast, setContrast, resetContrast,
        canvasFilter, applyImageToCanvas,
        isUpdating, setIsUpdating,
    } } children={ children }/>
}