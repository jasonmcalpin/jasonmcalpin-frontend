import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';


export interface Article {
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

interface ArticlesState {
  articles: Article[];
  filteredArticles: Article[];
  activeTag: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ArticlesState = {
  articles: [],
  filteredArticles: [],
  activeTag: null,
  isLoading: false,
  error: null,
};


export const fetchArticles = createAsyncThunk(
  'articles/fetchArticles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/data/articles.json');
      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }
      const data = await response.json();
      console.log('Fetched articles:', data);
      return data as Article[];
    } catch (error) {
      console.error('Error fetching articles:', error);
      return rejectWithValue(error as string);
    }
  }
);

export const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    filterArticles: (state, action: PayloadAction<string | null>) => {
      state.activeTag = action.payload;
      
      if (action.payload === null) {
        state.filteredArticles = state.articles;
      } else {
        state.filteredArticles = state.articles.filter(article => 
          article.tags.includes(action.payload as string)
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.articles = action.payload;
        state.filteredArticles = action.payload;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { filterArticles } = articlesSlice.actions;

export default articlesSlice.reducer;
