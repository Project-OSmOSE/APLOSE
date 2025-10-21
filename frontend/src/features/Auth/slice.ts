import { createSelector, createSlice } from '@reduxjs/toolkit';
import { loginFulfilled, logoutFulfilled, type Token } from '@/api';
import { AppState } from '@/features/App';
import { getTokenFromCookie } from '@/api/utils';

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
