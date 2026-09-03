import React, {
    createContext, type Dispatch,
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
    applyColormap: (context: CanvasRenderingContext2D) => void,
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
    applyColormap: () => undefined,
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

    const revertColormap = useCallback(() => setIsColormapInverted(prev => !prev), [])
    const resetBrightness = useCallback(() => setBrightness(50), [])
    const resetContrast = useCallback(() => setContrast(50), [])

    const canvasFilter = useMemo(() => {
        const compBrightness: number = Math.round(interpolate(brightness, 0, 100, 50, 150));
        const compContrast: number = Math.round(interpolate(contrast, 0, 100, 50, 150));
        return `brightness(${ compBrightness.toFixed() }%) contrast(${ compContrast.toFixed() }%)`;
    }, [ brightness, contrast ])

    const applyColormap = useCallback((context: CanvasRenderingContext2D) => {
        if (!allowColormapChange || !colormap) return;

        const imgData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
        const data = imgData.data;
        const colormapObj = createColormap({ colormap: COLORMAPS[colormap], nshades: 256 });

        for (let i = 0; i < data.length; i += 4) {
            const newColor = isColormapInverted ? colormapObj[255 - data[i]] : colormapObj[data[i]];
            data[i] = newColor[0];
            data[i + 1] = newColor[1];
            data[i + 2] = newColor[2];
        }
        context.putImageData(imgData, 0, 0);
    }, [ allowColormapChange, colormap, isColormapInverted ])

    return <ImageSettingsContext.Provider value={ {
        allowColormapChange, allowImageTuning,
        colormap, setColormap,
        isColormapInverted, setIsColormapInverted, revertColormap,
        brightness, setBrightness, resetBrightness,
        contrast, setContrast, resetContrast,
        canvasFilter, applyColormap,
    } } children={ children }/>
}