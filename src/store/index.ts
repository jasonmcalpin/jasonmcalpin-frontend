import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import projectsReducer from './slices/projectsSlice';
import bytesReducer from './slices/bytesSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    projects: projectsReducer,
    bytes: bytesReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
