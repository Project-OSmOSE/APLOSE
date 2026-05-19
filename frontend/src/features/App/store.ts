import { configureStore } from '@reduxjs/toolkit';
import { EventSlice } from '@/features/UX/Events';
import { logoutOn401Listener } from '@/api/auth';
import { getUserOnLoginMiddleware } from '@/api/user';
import { StorageSlice } from '@/api/storage';
import { AuthSlice } from '@/features/Auth';
import { gqlAPI } from '@/api/baseGqlApi';
import { AnnotatorReducer } from '@/features/Annotator/reducer';
import { restAPI } from '@/api/baseRestApi';
import { setupListeners } from '@reduxjs/toolkit/query';

export const AppStore = configureStore({
  reducer: {
    event: EventSlice.reducer,

    auth: AuthSlice.reducer,
    [StorageSlice.reducerPath]: StorageSlice.reducer,
    gql: gqlAPI.reducer,
    [restAPI.reducerPath]: restAPI.reducer,

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

setupListeners(AppStore.dispatch);
