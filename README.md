# Jason McAlpin - Personal Website

This is the source code for Jason McAlpin's personal website, built with React, TypeScript, and Vite.

## Features

- **Modern React Architecture**: Built with React 18, TypeScript, and Vite for optimal performance
- **Responsive Design**: Fully responsive layout that works on all devices
- **Content Sections**: Home, About, Projects, Bytes (blog), and Contact sections
- **Interactive Elements**: Includes animations and interactive components using Framer Motion
- **Syntax Highlighting**: Code snippets in blog posts with syntax highlighting via Prism
- **SEO Optimized**: Includes meta tags and structured data for better search engine visibility
- **Performance Optimized**: Lazy loading, code splitting, and image optimization

## Technology Stack

- **Frontend**: React 18, TypeScript, Redux Toolkit
- **Styling**: SCSS, Tailwind CSS
- **Build Tools**: Vite, ESLint, TypeScript
- **Deployment**: GitHub Actions CI/CD pipeline
- **Content**: Markdown with React Markdown for blog posts
- **Data Storage**: JSON and TOML for structured data

## Development

### Prerequisites

- Node.js (v18+)
- npm (v10+)

### Getting Started

1. Clone the repository
   ```bash
   git clone https://github.com/jasonmcalpin/jasonmcalpin-frontend.git
   cd jasonmcalpin-frontend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run optimize-images` - Optimize images using Sharp
- `npm run lint` - Run ESLint
- `npm run preview` - Preview the production build locally

## Deployment

The site uses a sophisticated deployment strategy:

### Staging Deployments

When you create a pull request to the `main` branch:
- The PR build is automatically deployed to the staging site (staged.jasonmcalpin.com)
- The PR will be updated with a comment containing the staging URL
- A PR_INFO.txt file is added to the deployment to track which PR is currently on staging

After a PR is merged to the main branch:
- The main branch is automatically deployed to the staging site
- A BRANCH_INFO.txt file is added to the deployment to indicate it's the main branch

This allows you to review changes before merging to main. The staging site uses the root path to ensure `.htaccess` rules work correctly.

### Production Deployments

The site is deployed to production only when a version tag is pushed:

1. Ensure your changes are merged to the `main` branch
2. Create and push a version tag following semantic versioning:

   ```bash
   # Make sure you're on the main branch
   git checkout main
   git pull

   # Create a new version tag
   git tag v1.0.0  # Use semantic versioning (v{major}.{minor}.{patch})

   # Push the tag to trigger deployment
   git push origin v1.0.0
   ```

3. The GitHub Actions workflow will automatically build and deploy to production

#### Semantic Versioning Guidelines

- `v1.0.0` - Major release with significant changes
- `v1.1.0` - Minor release with new features
- `v1.0.1` - Patch release with bug fixes

For more information on semantic versioning, visit [semver.org](https://semver.org/).

## License

Code structure is licensed under the [MIT License](LICENSE).
Content, personal information, images, and design are Copyright © 2025 Jason McAlpin. All rights reserved.

## Contact

- GitHub: [jasonmcalpin](https://github.com/jasonmcalpin)
- Twitter: [@jasonmcalpin](https://twitter.com/jasonmcalpin)
- LinkedIn: [Jason Dennis McAlpin](https://linkedin.com/in/jasondennismcalpin)
- Website: [jasonmcalpin.com](https://jasonmcalpin.com)
- Email: hi@jasonmcalpin.com
