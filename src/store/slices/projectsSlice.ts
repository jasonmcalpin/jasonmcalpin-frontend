import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { dataService } from '../../services/dataService';

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
  filteredProjects: Project[];
  activeFilter: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  projects: [],
  filteredProjects: [],
  activeFilter: null,
  isLoading: false,
  error: null,
};

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const data = await dataService.fetchJson<Project[]>('/data/projects.json');
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
      
      if (action.payload === null) {
        state.filteredProjects = state.projects;
      } else if (action.payload === 'featured') {
        state.filteredProjects = state.projects.filter(project => project.featured);
      } else {
        state.filteredProjects = state.projects.filter(project => 
          project.technologies.includes(action.payload as string)
        );
      }
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
        state.projects = action.payload;
        state.filteredProjects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { filterProjects } = projectsSlice.actions;

export default projectsSlice.reducer;
