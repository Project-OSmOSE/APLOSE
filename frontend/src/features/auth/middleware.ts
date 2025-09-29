import { createListenerMiddleware } from "@reduxjs/toolkit";
import { AuthQueryAPI } from "@/features/auth/api";

export const getUserOnLoginMiddleware = createListenerMiddleware()
getUserOnLoginMiddleware.startListening({
  predicate: (action: any) => {
    if (!action.meta?.arg) return false;
    return action.meta.arg.endpointName === 'login' && action.meta.requestStatus === 'fulfilled';
  },
  effect: (_, api) => {
    api.dispatch(AuthQueryAPI.endpoints.getCurrentUser.initiate())
  }
})
