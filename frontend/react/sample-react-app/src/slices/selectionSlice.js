import { createSlice } from '@reduxjs/toolkit';

export const selectionSlice = createSlice({
  name: 'selection',
  initialState: {
    identifier: undefined,
    currentEntity: undefined,
    popup: {
      display: false,
      class: '',
      error: {},
      message: {},
    },
    releaseInfo: undefined,
    releaseNoteInfo: undefined,
  },
  reducers: {
    setCurrentEntity: (state, action) => {
      state.currentEntity = action.payload;
    },
    setIdentifier: (state, action) => {
      state.identifier = action.payload;
    },
    setPopup: (state, action) => {
      state.popup = action.payload;
    },
    resetPopup: state => {
      state.popup = { display: false, class: '', error: {}, message: {} };
    },
    setReleaseInfo: (state, action) => {
      state.releaseInfo = action.payload;
    },
    setReleaseNoteInfo: (state, action) => {
      state.releaseNoteInfo = action.payload;
    },
    resetReleaseInfo: state => {
      state.releaseInfo = undefined;
    },
  },
});

export const {
  setCurrentEntity,
  setIdentifier,
  setPopup,
  resetPopup,
  setReleaseInfo,
  resetReleaseInfo,
  setReleaseNoteInfo,
} = selectionSlice.actions;

export default selectionSlice.reducer;
