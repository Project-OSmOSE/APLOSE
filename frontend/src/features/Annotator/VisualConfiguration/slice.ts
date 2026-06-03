import { createSlice } from '@reduxjs/toolkit';
import { Colormap } from './colormaps';
import { Analysis, setAnalysis } from '@/features/Annotator/Analysis/slice';


type VisualConfigurationState = {
    brightness: number; // 0-100
    contrast: number; // 0-100
    colormap?: Colormap;
    isColormapReversed: boolean;

    _campaignDefaultColormap?: Colormap
    _campaignDefaultReversedColormap?: boolean
    _allowConfiguration?: boolean
}
const initialState: VisualConfigurationState = {
    brightness: 50,
    contrast: 50,
    colormap: undefined,
    isColormapReversed: false,

    _campaignDefaultColormap: undefined,
    _campaignDefaultReversedColormap: undefined,
    _allowConfiguration: undefined,
}

export const AnnotatorVisualConfigurationSlice = createSlice({
    name: 'AnnotatorVisualConfiguration',
    initialState,
    reducers: {
        setBrightness: (state, action: { payload: number }) => {
            state.brightness = action.payload;
        },
        resetBrightness: (state) => {
            state.brightness = initialState.brightness;
        },
        setContrast: (state, action: { payload: number }) => {
            state.contrast = action.payload;
        },
        resetContrast: (state) => {
            state.contrast = initialState.contrast;
        },
        setColormap: (state, action: { payload: Colormap | undefined }) => {
            state.colormap = action.payload;
        },
        revertColormap: (state) => {
            state.isColormapReversed = !state.isColormapReversed;
        },

        initCampaign: (state, action: {
            payload: {
                campaignDefaultColormap: Colormap | undefined,
                campaignDefaultReversedColormap: boolean | undefined,
                allowConfiguration: boolean,
            }
        }) => {
            state._campaignDefaultColormap = action.payload.campaignDefaultColormap
            state._campaignDefaultReversedColormap = action.payload.campaignDefaultReversedColormap
            state._allowConfiguration = action.payload.allowConfiguration
            state.colormap = initialState.colormap
            state.isColormapReversed = initialState.isColormapReversed
        },
        initSpectrogram: (state) => {
            state.brightness = initialState.brightness
            state.contrast = initialState.contrast
        },

    },
    extraReducers: builder => {
        builder.addCase(setAnalysis, (state: VisualConfigurationState, action: { payload: Analysis }) => {
            if (!state._allowConfiguration) return;
            if (action.payload?.colormap.name !== 'Greys' as Colormap) return;
            state.colormap = state.colormap ?? state._campaignDefaultColormap ?? 'Greys'
            state.isColormapReversed = state.isColormapReversed ?? state._campaignDefaultReversedColormap ?? false
        })
    },
    selectors: {
        selectBrightness: state => state.brightness,
        selectContrast: state => state.contrast,
        selectColormap: state => state.colormap,
        selectIsColormapReversed: state => state.isColormapReversed,
    },
})

export const {
    setBrightness, resetBrightness,
    setContrast, resetContrast,
    setColormap,
    revertColormap,
} = AnnotatorVisualConfigurationSlice.actions
