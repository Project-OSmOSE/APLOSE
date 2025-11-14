import { createSelector } from '@reduxjs/toolkit';
import type { AppState } from '@/features/App';
import { EventSlice } from './slice'

export const selectAreKbdShortcutsEnabled = createSelector(
  (state: AppState) => state,
  EventSlice.selectors.selectAreKbdShortcutsEnabled,
)