import { createSlice } from '@reduxjs/toolkit'

type EventState = {
  areKbdShortcutsEnabled: boolean
}

export const EventSlice = createSlice({
  name: 'event',
  initialState: {
    areKbdShortcutsEnabled: true,
  } as EventState,
  reducers: {
    enableShortcuts: (state) => {
      state.areKbdShortcutsEnabled = true
    },
    disableShortcuts: (state) => {
      state.areKbdShortcutsEnabled = false
    },
  },
})
