import { createSlice } from '@reduxjs/toolkit';
import { ColormapNode, SpectrogramAnalysisNode } from '@/api';

export type Analysis = Pick<SpectrogramAnalysisNode, 'id'> & {
    colormap: Pick<ColormapNode, 'name'>;
} | undefined

type AnalysisState = {
    id?: string;

    _campaignID?: string;
}

export const AnnotatorAnalysisSlice = createSlice({
    name: 'AnnotatorAnalysis',
    initialState: {
        _campaignID: undefined,
    } as AnalysisState,
    reducers: {
        setAnalysis: (state, action: { payload: Analysis | null }) => {
            state.id = action.payload?.id
        },
    },
    selectors: {
        selectID: state => state.id,
    },
})

export const {
    setAnalysis,
} = AnnotatorAnalysisSlice.actions
