import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { dataService } from '../../services/dataService';
import { parseBytes } from '../../services/contentValidation';
import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../index';

export interface Byte {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string | string[];
  imageUrl: string;
  author: string;
  date: string;
  tags: string[];
  readingTime: number;
}

interface BytesState {
  bytes: Byte[];
  activeTag: string | null;
  isLoading: boolean;
  hasLoaded: boolean;
  error: string | null;
}

const initialState: BytesState = {
  bytes: [],
  activeTag: null,
  isLoading: false,
  hasLoaded: false,
  error: null,
};

export const fetchBytes = createAsyncThunk('bytes/fetchBytes', async (_, { rejectWithValue }) => {
  try {
    return await dataService.fetchJson('/data/bytes.json', parseBytes);
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : String(error));
  }
});

export const bytesSlice = createSlice({
  name: 'bytes',
  initialState,
  reducers: {
    filterBytes: (state, action: PayloadAction<string | null>) => {
      state.activeTag = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchBytes.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBytes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hasLoaded = true;
        state.bytes = action.payload ?? [];
      })
      .addCase(fetchBytes.rejected, (state, action) => {
        state.isLoading = false;
        state.hasLoaded = true;
        state.error = action.payload as string;
      });
  },
});

export const { filterBytes } = bytesSlice.actions;

export default bytesSlice.reducer;

export const selectFilteredBytes = createSelector(
  [(state: RootState) => state.bytes.bytes, (state: RootState) => state.bytes.activeTag],
  (bytes, tag) => tag === null ? bytes : bytes.filter(byte => byte.tags.includes(tag)),
);
