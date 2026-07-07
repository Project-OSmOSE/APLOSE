import { configureStore } from '@reduxjs/toolkit';
import { gqlAPI } from '@/api/baseGqlApi';
import { AnnotatorReducer } from '@/features/Annotator/reducer';
import { restAPI } from '@/api/baseRestApi';
import { setupListeners } from '@reduxjs/toolkit/query';
import { StorageSlice } from '../Storage';

export const AppStore = configureStore({
    reducer: {
        gql: gqlAPI.reducer,
        [restAPI.reducerPath]: restAPI.reducer,

        annotator: AnnotatorReducer,
        [StorageSlice.reducerPath]: StorageSlice.reducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(gqlAPI.middleware)
            .concat(restAPI.middleware),
})

export type AppState = ReturnType<typeof AppStore.getState>;

export type AppDispatch = typeof AppStore.dispatch;

setupListeners(AppStore.dispatch);
