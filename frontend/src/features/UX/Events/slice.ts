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
    enableShortcuts: (state: EventState) => {
      state.areKbdShortcutsEnabled = true
    },
    disableShortcuts: (state: EventState) => {
      state.areKbdShortcutsEnabled = false
    },
  },
  selectors: {
    selectAreKbdShortcutsEnabled: (state: EventState) => state.areKbdShortcutsEnabled,
  },
})
