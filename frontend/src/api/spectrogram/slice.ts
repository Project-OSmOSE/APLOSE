import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { SpectrogramMode } from '@/features/Spectrogram/Display/types';

type Image = {
    src: string;
    mode: SpectrogramMode,
    zoom: number;
    tile: number;
}

type State = {
    images: Image[];
}

export const SpectrogramDisplaySlice = createSlice({
    name: 'SpectrogramDisplay',
    reducerPath: 'spectrogramDisplay',
    initialState: { images: [] } satisfies State as State,
    reducers: {
        saveTile: (state, action: PayloadAction<Image>) => {
          state.images.push(action.payload);
        },
        reset: (state: State) => {
            state.images = [];
        },
    },
    selectors: {
        imageSrc: (state, options: Pick<Image, 'mode' | 'zoom' | 'tile'>) => state.images.find(i =>
            i.mode == options.mode && i.zoom == options.zoom && i.tile == options.tile
        )?.src,
    }
})