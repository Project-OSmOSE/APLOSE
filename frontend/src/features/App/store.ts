import { configureStore } from '@reduxjs/toolkit';
import { enableMapSet } from 'immer'

import { gqlAPI } from '@/api/baseGqlApi';
import { restAPI } from '@/api/baseRestApi';
import {
  AllAnnotationCampaignFilterSlice,
  AllAnnotationTaskFilterSlice,
  getUserOnLoginMiddleware,
  logoutOn401Listener,
  StorageSlice,
} from '@/api';

import { AuthSlice } from '@/features/Auth';
import { AnnotatorReducer } from '@/features/Annotator/reducer';
import { EventSlice } from '@/features/UX/Events';
import BackgroundTask from '@/features/BackgroundTask';

enableMapSet()

export const AppStore = configureStore({
  reducer: {
    event: EventSlice.reducer,

    auth: AuthSlice.reducer,
    [StorageSlice.reducerPath]: StorageSlice.reducer,
    [gqlAPI.reducerPath]: gqlAPI.reducer,
    [restAPI.reducerPath]: restAPI.reducer,

    [AllAnnotationCampaignFilterSlice.reducerPath]: AllAnnotationCampaignFilterSlice.reducer,
    [AllAnnotationTaskFilterSlice.reducerPath]: AllAnnotationTaskFilterSlice.reducer,

    [BackgroundTask.reducerPath]: BackgroundTask.reducer,
    annotator: AnnotatorReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(gqlAPI.middleware)
      .concat(restAPI.middleware)
      .concat(getUserOnLoginMiddleware.middleware)
      .concat(logoutOn401Listener.middleware)
})

export type AppState = ReturnType<typeof AppStore.getState>;

export type AppDispatch = typeof AppStore.dispatch;
