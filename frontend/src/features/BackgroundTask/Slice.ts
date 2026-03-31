import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type BackgroundTaskUpdateData, type BackgroundTaskUpdateEvent } from './types'

type TaskInfo = BackgroundTaskUpdateData

export const BackgroundTaskSlice = createSlice({
    name: 'BackgroundTasks',
    reducerPath: 'backgroundTasks',
    initialState: {} as { [key in string]: TaskInfo },
    reducers: {
        onTaskUpdated: (state, action: PayloadAction<BackgroundTaskUpdateEvent>) => {
            switch (action.payload.type) {
                case 'background_task_update':
                    state[action.payload.data.id.toString()] = action.payload.data
                    return;
                case 'background_task_retry':
                    break;
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
