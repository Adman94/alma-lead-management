// lib/redux/store.ts

import { configureStore } from '@reduxjs/toolkit';
import leadsReducer from './leadSlice';

export const store = configureStore({
  reducer: {
    leads: leadsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;