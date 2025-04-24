import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import projectsData from '../../data/projects.json';

export interface Project {
  id: string;
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
      // placeholder for for wordpress api call.
      // const response = await fetch('https://api.example.com/projects');
      return projectsData as Project[];
    } catch (error) {
      return rejectWithValue(error as string);
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