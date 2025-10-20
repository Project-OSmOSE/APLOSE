import { createSelector, createSlice } from '@reduxjs/toolkit';
import { loginFulfilled, logoutFulfilled } from '@/api';
import { getTokenFromCookie, Token } from './utils';
import { AppState } from '@/features/App';

type AuthState = {
  isConnected: boolean,
  accessToken?: Token,
  refreshToken?: Token,
}

const initialToken: Token | undefined = getTokenFromCookie()

export const AuthSlice = createSlice({
  name: 'AuthSlice',
  initialState: {
    isConnected: !!initialToken,
    accessToken: initialToken,
    refreshToken: undefined,
  } as AuthState,
  reducers: {},
  extraReducers: builder => {
    builder.addMatcher(loginFulfilled, (state, { payload }) => {
      state.isConnected = true
      state.accessToken = payload.access
      state.refreshToken = payload.refresh
    })
    builder.addMatcher(logoutFulfilled, (state) => {
      state.isConnected = false
      state.accessToken = undefined
      state.refreshToken = undefined
    })
  },
})

export const selectIsConnected = createSelector(
  (state: AppState) => state.auth,
  (state: AuthState) => state.isConnected,
)
