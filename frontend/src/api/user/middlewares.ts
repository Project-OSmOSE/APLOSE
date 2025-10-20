import { createListenerMiddleware } from "@reduxjs/toolkit";
import { UserGqlAPI } from "./api";

const {
  getCurrentUser,
} = UserGqlAPI.endpoints


export const getUserOnLoginMiddleware = createListenerMiddleware()
getUserOnLoginMiddleware.startListening({
  predicate: (action: any) => {
    if (!action.meta?.arg) return false;
    return action.meta.arg.endpointName === 'login' && action.meta.requestStatus === 'fulfilled';
  },
  effect: (_, api) => {
    api.dispatch(getCurrentUser.initiate())
  }
})
