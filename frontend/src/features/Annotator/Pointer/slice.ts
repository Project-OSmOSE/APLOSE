import { createSlice } from '@reduxjs/toolkit';
import { getAnnotationTaskFulfilled } from '@/api';


export type Position = { clientX: number, clientY: number }
export type TimeFreqPosition = { time: number, frequency: number }

type PointerState = {
  position?: TimeFreqPosition
}

const initialState: PointerState = {
  position: undefined,
}

export const AnnotatorPointerSlice = createSlice({
  name: 'AnnotatorPointer',
  initialState,
  reducers: {
    setPosition: (state, action: { payload: TimeFreqPosition }) => {
      state.position = action.payload;
    },
    clearPosition: (state) => {
      state.position = undefined
    },
  },
  extraReducers: builder => {
    builder.addMatcher(getAnnotationTaskFulfilled, (state: PointerState) => {
      state.position = initialState.position
    })
  },
  selectors: {
    selectPosition: state => state.position,
  },
})

export const {
  selectPosition,
} = AnnotatorPointerSlice.selectors

export const {
  setPosition,
  clearPosition,
} = AnnotatorPointerSlice.actions
