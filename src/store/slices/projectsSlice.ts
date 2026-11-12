import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { dataService } from '../../services/dataService';
import { parseProjects } from '../../services/contentValidation';
import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../index';

export interface Project {
  id: string;
  slug?: string;
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
}

interface ProjectsState {
  projects: Project[];
  activeFilter: string | null;
  isLoading: boolean;
  hasLoaded: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  projects: [],
  activeFilter: null,
  isLoading: false,
  hasLoaded: false,
  error: null,
};

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const data = await dataService.fetchJson('/data/projects.json', parseProjects);
      console.log('Fetched projects:', data);
      return data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      return rejectWithValue((error as Error).message || 'Unknown error');
    }
  }
);


export const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    filterProjects: (state, action: PayloadAction<string | null>) => {
      state.activeFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hasLoaded = true;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.hasLoaded = true;
        state.error = action.payload as string;
      });
  },
});

export const { filterProjects } = projectsSlice.actions;

export default projectsSlice.reducer;

export const selectFilteredProjects = createSelector(
  [(state: RootState) => state.projects.projects, (state: RootState) => state.projects.activeFilter],
  (projects, filter) => filter === null ? projects : filter === 'featured'
    ? projects.filter(project => project.featured)
    : projects.filter(project => project.technologies.includes(filter)),
);
