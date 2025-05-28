import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Experience } from '../../types';
import { dataService } from '../../services/dataService';

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
      return await dataService.fetchJson<Experience[]>('/data/experience.json');
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
