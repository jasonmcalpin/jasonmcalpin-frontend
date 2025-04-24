import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import articlesData from '../../data/articles.json';


export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
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
      // for future API call to wordpress.
      // const response = await fetch('https://your-wordpress-site.com/wp-json/wp/v2/posts');
      return articlesData as Article[];
    } catch (error) {
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