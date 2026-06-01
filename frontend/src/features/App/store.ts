import { configureStore } from '@reduxjs/toolkit';
import { EventSlice } from '@/features/UX/Events';
import { Storage } from '@/features';
import { gqlAPI } from '@/api/baseGqlApi';
import { AnnotatorReducer } from '@/features/Annotator/reducer';
import { restAPI } from '@/api/baseRestApi';
import { setupListeners } from '@reduxjs/toolkit/query';

export const AppStore = configureStore({
  reducer: {
    event: EventSlice.reducer,

    [Storage.Slice.reducerPath]: Storage.Slice.reducer,
    gql: gqlAPI.reducer,
    [restAPI.reducerPath]: restAPI.reducer,

    annotator: AnnotatorReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(gqlAPI.middleware)
      .concat(restAPI.middleware)
})

export type AppState = ReturnType<typeof AppStore.getState>;

export type AppDispatch = typeof AppStore.dispatch;

setupListeners(AppStore.dispatch);
