import type { CompanyLogos } from '../../types';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dataService } from '../../services/dataService';

interface LogoState {
  logos: CompanyLogos[];
  isLoading: boolean;
  error: string | null;
}

const initialState: LogoState = {
  logos: [],
  isLoading: false,
  error: null,
};

export const fetchLogos = createAsyncThunk(
  'logos/fetchLogos',
  async (_, { rejectWithValue }) => {
    try {
      return await dataService.fetchJson<CompanyLogos[]>('/data/logos.json');
    } catch (error) {
      console.error('Error fetching logos:', error);
      return rejectWithValue((error as Error).message || 'Unknown error');
    }
  }
);

export const logoSlice = createSlice({
  name: 'logos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogos.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLogos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.logos = action.payload;
      })
      .addCase(fetchLogos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default logoSlice.reducer;
