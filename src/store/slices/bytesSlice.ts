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


// Define a type for the parsed TOML data structure
interface TomlData {
  articles: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    date: string;
    imageUrl: string;
    author: string;
    tags: string[];
    readingTime: number;
    content: string;
  }>;
}

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
        
        let parsedData: TomlData;
        try {
          // Cast the parsed result to our TomlData type
          parsedData = toml.parse(text) as unknown as TomlData;
        } catch (parseError) {
          console.error('TOML parse error details:', parseError);
          throw parseError;
        }
        
        // Transform the data structure to match what the app expects
        // In TOML, the articles are in an array under the "articles" key
        if (!Array.isArray(parsedData.articles)) {
          throw new Error('Invalid TOML structure: articles is not an array');
        }
        
        const bytes = parsedData.articles.map(article => {
          // Handle content field - ensure it's properly formatted
          let content = article.content;
          
          // If content is a multiline string with triple quotes in TOML,
          // it will be parsed as a string with newlines
          if (typeof content === 'string' && content.includes('\n')) {
            // For consistency with JSON format, we could either:
            // 1. Keep it as a string (current behavior)
            // 2. Split it into an array of lines for article #5 compatibility
            // We'll keep it as a string for most articles
            content = content.trim();
          }
          
          return {
            id: article.id,
            title: article.title,
            slug: article.slug,
            excerpt: article.excerpt,
            content: content,
            imageUrl: article.imageUrl,
            author: article.author,
            date: String(article.date),
            tags: Array.isArray(article.tags) ? article.tags : [],
            readingTime: Number(article.readingTime)
          };
        });
        
        console.log('Fetched bytes from TOML:', bytes);
        return bytes as Byte[];
      } catch (tomlError) {
        // Log detailed error for debugging but don't expose in UI
        console.error('Error fetching bytes from TOML:', tomlError);
        
        // Fall back to JSON if TOML parsing fails
        console.log('Falling back to JSON...');
        try {
          const jsonResponse = await fetch('/data/bytes.json');
          if (!jsonResponse.ok) {
            throw new Error(`Failed to fetch JSON: ${jsonResponse.status} ${jsonResponse.statusText}`);
          }
          const data = await jsonResponse.json();
          console.log('Fetched bytes from JSON fallback:', data);
          return data as Byte[];
        } catch (jsonError) {
          console.error('Error fetching bytes from JSON fallback:', jsonError);
          throw new Error('Unable to load content. Please try again later.');
        }
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
