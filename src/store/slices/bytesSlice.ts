import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';


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
  filteredBytes: Byte[];
  activeTag: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: BytesState = {
  bytes: [],
  filteredBytes: [],
  activeTag: null,
  isLoading: false,
  error: null,
};


export const fetchBytes = createAsyncThunk(
  'bytes/fetchBytes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/data/bytes.json');
      if (!response.ok) {
        throw new Error('Failed to fetch bytes');
      }
      const data = await response.json();
      console.log('Fetched bytes:', data);
      return data as Byte[];
    } catch (error) {
      console.error('Error fetching bytes:', error);
      return rejectWithValue(error as string);
    }
  }
);

export const bytesSlice = createSlice({
  name: 'bytes',
  initialState,
  reducers: {
    filterBytes: (state, action: PayloadAction<string | null>) => {
      state.activeTag = action.payload;
      
      if (action.payload === null) {
        state.filteredBytes = state.bytes;
      } else {
        state.filteredBytes = state.bytes.filter(byte => 
          byte.tags.includes(action.payload as string)
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBytes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBytes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bytes = action.payload;
        state.filteredBytes = action.payload;
      })
      .addCase(fetchBytes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { filterBytes } = bytesSlice.actions;

export default bytesSlice.reducer;
