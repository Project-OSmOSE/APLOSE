import { createSlice } from '@reduxjs/toolkit';
import { Colormap } from './colormaps';
import { getAnnotationTaskFulfilled, type GetAnnotationTaskQuery, getCampaignFulfilled, GetCampaignQuery } from '@/api';
import { Analysis, setAnalysis } from '@/features/Annotator/Analysis/slice';
import type { GetAnnotationTaskQueryVariables } from '@/api/annotation-task/annotation-task.generated';
import type { SpectrogramMode } from '@/features/Spectrogram/Display';


type VisualConfigurationState = {
    brightness: number; // 0-100
    contrast: number; // 0-100
    colormap?: Colormap;
    isColormapReversed: boolean;
    mode: SpectrogramMode,

    _campaignDefaultColormap?: Colormap
    _campaignDefaultReversedColormap?: boolean
    _allowConfiguration?: boolean
    _campaignID?: string
}
const initialState: VisualConfigurationState = {
    brightness: 50,
    contrast: 50,
    colormap: undefined,
    isColormapReversed: false,
    mode: 'png',

    _campaignDefaultColormap: undefined,
    _campaignDefaultReversedColormap: undefined,
    _allowConfiguration: undefined,
    _campaignID: undefined,
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
        setSpectrogramMode: (state, action: { payload: SpectrogramMode }) => {
            state.mode = action.payload;
        },
    },
    extraReducers: builder => {
        builder.addCase(setAnalysis, (state: VisualConfigurationState, action: { payload: Analysis }) => {
            if (!state._allowConfiguration) return;
            if (action.payload?.colormap.name !== 'Greys' as Colormap) return;
            state.colormap = state.colormap ?? state._campaignDefaultColormap ?? 'Greys'
            state.isColormapReversed = state.isColormapReversed ?? state._campaignDefaultReversedColormap ?? false
        })
        builder.addMatcher(getCampaignFulfilled, (state: VisualConfigurationState, action: {
            payload: GetCampaignQuery,
        }) => {
            state._campaignDefaultColormap = action.payload.annotationCampaignById?.colormapDefault as Colormap ?? undefined
            state._campaignDefaultReversedColormap = action.payload.annotationCampaignById?.colormapInvertedDefault ?? undefined
            state._allowConfiguration = action.payload.annotationCampaignById?.allowColormapTuning ?? undefined
        })
        builder.addMatcher(getAnnotationTaskFulfilled, (state: VisualConfigurationState, action: {
            payload: GetAnnotationTaskQuery,
            meta: { arg: { originalArgs: GetAnnotationTaskQueryVariables } }
        }) => {
            if (state._campaignID !== action.meta.arg.originalArgs.campaignID) {
                state._campaignID = action.meta.arg.originalArgs.campaignID
                state.colormap = initialState.colormap
                state.isColormapReversed = initialState.isColormapReversed
            }
            state.brightness = initialState.brightness
            state.contrast = initialState.contrast
        })
    },
    selectors: {
        selectBrightness: state => state.brightness,
        selectContrast: state => state.contrast,
        selectColormap: state => state.colormap,
        selectIsColormapReversed: state => state.isColormapReversed,
        selectSpectrogramMode: state => state.mode,
    },
})

export const {
    setBrightness, resetBrightness,
    setContrast, resetContrast,
    setColormap, revertColormap,
    setSpectrogramMode,
} = AnnotatorVisualConfigurationSlice.actions
