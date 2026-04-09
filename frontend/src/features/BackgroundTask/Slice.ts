import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { BackgroundTask, Event } from './types'

export const Slice = createSlice({
    name: 'BackgroundTasks',
    reducerPath: 'backgroundTasks',
    initialState: {} as { [key in string]: BackgroundTask },
    reducers: {
        onTaskUpdated: (state, action: PayloadAction<Event>) => {
            switch (action.payload.type) {
                case 'info':
                    state[action.payload.data.identifier] = action.payload.data
                    return;
            }
        },
        clearTask: (state, action: PayloadAction<string>) => {
            delete state[action.payload]
        },
    },
    selectors: {
        selectTask: (state, id: string) => state[id],
        selectTasks: (state, ids: string[]) => ids.map(id => state[id]).filter(t => !!t),
    },
})
