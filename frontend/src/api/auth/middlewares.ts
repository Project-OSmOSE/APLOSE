import { createListenerMiddleware } from "@reduxjs/toolkit";
import { AuthRestAPI } from "./api";

const {
  logout,
} = AuthRestAPI.endpoints


export const logoutOn401Listener = createListenerMiddleware()
logoutOn401Listener.startListening({
  predicate: (action: any) => {
    if (!action.meta?.baseQueryMeta?.response) return false;
    return action.meta.requestStatus === 'rejected' && action.meta.baseQueryMeta.response.status === 401
  },
  effect: (_, api) => {
    api.dispatch(logout.initiate())
  }
})
