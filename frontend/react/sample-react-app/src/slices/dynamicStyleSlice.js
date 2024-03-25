import { createSlice } from "@reduxjs/toolkit";

export const dynamicStyleSlice = createSlice({
  name: "dynamicStyle",
  initialState: {
    isOpen: true,
    loading: false,
    requestCount: 0,
  },
  reducers: {
    setIsOpen: (state, action) => {
      state.isOpen = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setRequestCount: (state, action) => {
      state.requestCount = action.payload;
    },
  },
});

export const { setIsOpen, setLoading, setRequestCount } =
  dynamicStyleSlice.actions;

export default dynamicStyleSlice.reducer;
