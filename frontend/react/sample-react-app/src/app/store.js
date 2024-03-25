import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@slices/userSlice';
import selectionReducer from '@slices/selectionSlice';
import dynamicStyleSliceReducer from '@slices/dynamicStyleSlice';

export default configureStore({
  reducer: {
    user: userReducer,
    selection: selectionReducer,
    dynamicStyle: dynamicStyleSliceReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});
