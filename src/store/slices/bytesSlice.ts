import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import toml from 'toml-j0.4';


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
      // Try to fetch and parse TOML first
      try {
        const response = await fetch('/data/bytes.toml');
        if (!response.ok) {
          throw new Error('Failed to fetch bytes from TOML');
        }
        
        const text = await response.text();
        console.log('TOML content preview:', text.substring(0, 200) + '...');
        
        let parsedData;
        try {
          parsedData = toml.parse(text) as { articles: Array<Omit<Byte, 'date'> & { date: string }> };
        } catch (parseError) {
          console.error('TOML parse error details:', parseError);
          throw parseError;
        }
        
        // Transform the data structure to match what the app expects
        // In TOML, the articles are in an array under the "articles" key
        if (!Array.isArray(parsedData.articles)) {
          throw new Error('Invalid TOML structure: articles is not an array');
        }
        
        const bytes = parsedData.articles.map(article => ({
          ...article,
          // Ensure date is in the correct string format
          date: String(article.date),
        }));
        
        console.log('Fetched bytes from TOML:', bytes);
        return bytes as Byte[];
      } catch (tomlError) {
        console.error('Error fetching bytes from TOML:', tomlError);
        
        // Fall back to JSON if TOML parsing fails
        console.log('Falling back to JSON...');
        const jsonResponse = await fetch('/data/bytes.json');
        if (!jsonResponse.ok) {
          throw new Error('Failed to fetch bytes from both TOML and JSON');
        }
        const data = await jsonResponse.json();
        console.log('Fetched bytes from JSON fallback:', data);
        return data as Byte[];
      }
    } catch (error) {
      console.error('Error fetching bytes:', error);
      return rejectWithValue((error as Error).message || 'Unknown error');
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
