import { AuthRestAPI } from "./api";

const {
  login,
  logout,
} = AuthRestAPI.endpoints

export const loginFulfilled = login.matchFulfilled
export const logoutFulfilled = logout.matchFulfilled