import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
  articles: [
    {
      id: '1',
      title: 'Building a Website with React and Redux',
      excerpt: 'Learn how to build a modern website using React and Redux for state management.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
      imageUrl: '/assets/images/articles/react-redux.jpg',
      author: 'Jason McAlpin',
      date: '2025-03-15',
      tags: ['React', 'Redux', 'Web Development'],
      readingTime: 8,
    },
    {
      id: '2',
      title: 'Creating a Game with React',
      excerpt: 'A step-by-step guide to creating an interactive game using React and modern web technologies.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
      imageUrl: '/assets/images/articles/react-game.jpg',
      author: 'Jason McAlpin',
      date: '2025-02-28',
      tags: ['React', 'Game Development', 'JavaScript'],
      readingTime: 12,
    },
    {
      id: '3',
      title: 'The Power of TypeScript in Modern Web Development',
      excerpt: 'Discover how TypeScript can improve your development workflow and reduce bugs in your applications.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
      imageUrl: '/assets/images/articles/typescript.jpg',
      author: 'Jason McAlpin',
      date: '2025-01-20',
      tags: ['TypeScript', 'JavaScript', 'Web Development'],
      readingTime: 6,
    },
    {
      id: '4',
      title: 'Optimizing Performance in React Applications',
      excerpt: 'Learn techniques to improve the performance of your React applications for better user experience.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
      imageUrl: '/assets/images/articles/react-performance.jpg',
      author: 'Jason McAlpin',
      date: '2024-12-10',
      tags: ['React', 'Performance', 'Optimization'],
      readingTime: 10,
    },
  ],
  filteredArticles: [],
  activeTag: null,
  isLoading: false,
  error: null,
};

export const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    setArticles: (state, action: PayloadAction<Article[]>) => {
      state.articles = action.payload;
      state.filteredArticles = action.payload;
    },
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
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setArticles, filterArticles, setLoading, setError } = articlesSlice.actions;

export default articlesSlice.reducer;
