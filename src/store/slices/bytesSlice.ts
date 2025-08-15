import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { dataService } from '../../services/dataService';

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

export const fetchBytes = createAsyncThunk('bytes/fetchBytes', async (_, { rejectWithValue }) => {
  try {
    const parsedData = await dataService.fetchToml<TomlData>('/data/bytes.toml');

    if (!Array.isArray(parsedData.articles)) {
      throw new Error('Invalid TOML structure: articles is not an array');
    }

    const bytes = parsedData.articles.map(article => {
      let content = article.content;
      if (typeof content === 'string' && content.includes('\n')) {
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
        readingTime: Number(article.readingTime),
      };
    });

    const sortedBytes = bytes.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    console.log('Fetched bytes from TOML:', bytes);
    return sortedBytes as Byte[];
  } catch (error) {
    console.error('Error fetching bytes:', error);
    return rejectWithValue((error as Error).message || 'Unknown error');
  }
});

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
  extraReducers: builder => {
    builder
      .addCase(fetchBytes.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBytes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bytes = action.payload ?? [];
        state.filteredBytes = action.payload ?? [];
      })
      .addCase(fetchBytes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { filterBytes } = bytesSlice.actions;

export default bytesSlice.reducer;
