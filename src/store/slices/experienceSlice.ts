import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Experience } from '../../types';

interface ExperienceState {
  experiences: Experience[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ExperienceState = {
  experiences: [],
  isLoading: false,
  error: null,
};

export const fetchExperiences = createAsyncThunk(
  'experience/fetchExperiences',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/data/experience.json');
      if (!response.ok) {
        throw new Error('Failed to fetch experiences');
      }
      const data = await response.json();
      return data as Experience[];
    } catch (error) {
      console.error('Error fetching experiences:', error);
      return rejectWithValue((error as Error).message || 'Unknown error');
    }
  }
);

export const experienceSlice = createSlice({
  name: 'experience',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExperiences.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExperiences.fulfilled, (state, action) => {
        state.isLoading = false;
        state.experiences = action.payload;
      })
      .addCase(fetchExperiences.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default experienceSlice.reducer;
