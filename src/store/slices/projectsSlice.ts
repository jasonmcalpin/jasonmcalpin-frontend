import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
  projects: [
    {
      id: '1',
      title: 'Survival Card Game',
      description: 'A React-based card game where players must survive in a post-apocalyptic world by making strategic decisions.',
      imageUrl: '/assets/images/projects/survival-game.jpg',
      technologies: ['React', 'TypeScript', 'Redux', 'SCSS'],
      githubUrl: 'https://github.com/jasonmcalpin/survival-card-game',
      featured: true,
    },
    {
      id: '2',
      title: 'My Prostate Cancer Website',
      description: 'An informational website providing resources and support for those affected by prostate cancer.',
      imageUrl: '/assets/images/projects/my-prostate-cancer.png',
      technologies: ['React', 'JavaScript', 'REST-API', 'Firebase'],
      liveUrl: 'https://prostate-cancer-info.com',
      featured: true,
    },
    {
      id: '3',
      title: 'US Open Watson Project',
      description: 'A data analysis project using IBM Watson to analyze US Open tennis data and provide insights.',
      imageUrl: '/assets/images/projects/us-open.jpg',
      technologies: ['IBM Watson', 'Python', 'MySQL', 'Angular', 'Machine Learning'],
      githubUrl: 'https://github.com/jasonmcalpin/us-open-watson',
      featured: false,
    },
    {
      id: '4',
      title: 'Ford Website',
      description: 'A redesigned website for Ford showcasing their vehicles and services with modern UI/UX principles.',
      imageUrl: '/assets/images/projects/ford-home.png',
      technologies: ['React', 'JQuery', 'BrightCove', 'Express', 'Node.js', 'Adobe Target'],
      liveUrl: 'https://ford-redesign.com',
      featured: true,
    },
    {
      id: '5',
      title: 'IBM-One Blog',
      description: 'A blog platform for IBM employees to share knowledge and insights about technology and innovation.',
      imageUrl: '/assets/images/projects/IBM-Blog.png',
      technologies: ['Next.js', 'GraphQL', 'Tailwind CSS', 'Prisma'],
      githubUrl: 'https://github.com/jasonmcalpin/ibm-one-blog',
      featured: false,
    },
    {
      id: '6',
      title: 'FM Global - Resilience is a choice',
      description: 'A campaign website for FM Global focusing on business resilience and risk management.',
      imageUrl: '/assets/images/projects/fm-global.png',
      technologies: ['Vue.js', 'Vuex', 'SCSS', 'Firebase'],
      liveUrl: 'https://resilience-choice.fmglobal.com',
      featured: false,
    },
  ],
  filteredProjects: [],
  activeFilter: null,
  isLoading: false,
  error: null,
};

export const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload;
      state.filteredProjects = action.payload;
    },
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
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setProjects, filterProjects, setLoading, setError } = projectsSlice.actions;

export default projectsSlice.reducer;
