import { configureStore } from '@reduxjs/toolkit';
import deviationSlice from './deviationSlice';
import chatSlice from './chatSlide'

export const store = configureStore({
  reducer: {
    deviation: deviationSlice,
    chat : chatSlice
  },
});
