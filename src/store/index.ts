import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import projectsReducer from './slices/projectsSlice';
import bytesReducer from './slices/bytesSlice';
import experienceReducer from './slices/experienceSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    projects: projectsReducer,
    bytes: bytesReducer,
    experience: experienceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
