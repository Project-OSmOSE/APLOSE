import { configureStore } from "@reduxjs/toolkit";

import { useDispatch, useSelector } from "react-redux";
import { EventSlice } from "@/service/events";
import { API } from "@/service/api";
import { logoutOn401Listener } from "@/service/api/auth.ts";
import { AuthSlice } from "@/service/slices/auth.ts";
import { FilterSlice } from "@/service/slices/filter.ts";
import { ImportAnnotationsSlice } from "@/service/slices/import-annotations.ts";
import { SettingsSlice } from "@/service/slices/settings.ts";
import { gqlAPI } from "@/features/_utils_/gql/baseApi.ts";
import { AnnotatorSlice } from "@/features/Annotator";
import { AnnotationDisplaySlice } from "@/features/annotation/slice/AnnotationSlice.ts";
import { restAPI } from "@/features/_utils_/rest/baseApi.ts";
import { getUserOnLoginMiddleware } from "@/features/auth";

export const AppStore = configureStore({
  reducer: {
    [EventSlice.reducerPath]: EventSlice.reducer,
    [AnnotatorSlice.reducerPath]: AnnotatorSlice.reducer,
    [ImportAnnotationsSlice.reducerPath]: ImportAnnotationsSlice.reducer,
    [SettingsSlice.reducerPath]: SettingsSlice.reducer,

    [API.reducerPath]: API.reducer,
    [gqlAPI.reducerPath]: gqlAPI.reducer,
    [restAPI.reducerPath]: restAPI.reducer,
    auth: AuthSlice.reducer,
    filter: FilterSlice.reducer,

    [AnnotationDisplaySlice.reducerPath]: AnnotationDisplaySlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(API.middleware)
      .concat(gqlAPI.middleware)
      .concat(restAPI.middleware)
      .concat(getUserOnLoginMiddleware.middleware)
      .concat(logoutOn401Listener.middleware)
})

export type AppState = ReturnType<typeof AppStore.getState>;

export type AppDispatch = typeof AppStore.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<AppState>()
