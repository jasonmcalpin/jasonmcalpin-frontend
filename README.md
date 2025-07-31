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
- `npm run type-check` - Run TypeScript type checking

### Code Quality Tools

This project uses several tools to ensure code quality and consistency:


#### Lint-staged

Lint-staged runs linters on staged files to catch issues before they're committed:

- TypeScript/React files: ESLint and Prettier
- CSS/SCSS files: Prettier
- JSON/Markdown files: Prettier

#### Commitlint

Commitlint ensures commit messages follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

##### Commit Message Format

1. **Type (required)**: Describes the kind of change:

   - `feat`: A new feature
   - `fix`: A bug fix
   - `docs`: Documentation changes
   - `style`: Changes that don't affect code meaning (formatting, whitespace)
   - `refactor`: Code changes that neither fix bugs nor add features
   - `perf`: Performance improvements
   - `test`: Adding or correcting tests
   - `build`: Changes to build system or dependencies
   - `ci`: Changes to CI configuration files and scripts
   - `chore`: Other changes that don't modify src or test files
   - `revert`: Reverts a previous commit

2. **Scope (optional)**: Describes what part of the codebase is affected:

   - `auth`: Authentication related changes
   - `ui`: User interface components
   - `api`: API-related changes
   - `data`: Data models or services
   - `nav`: Navigation components
   - `deps`: Dependency updates
   - `config`: Configuration changes
   - `copy`: Copy changes (e.g., text, labels)

3. **Description (required)**: A short, imperative description of the change

   - Use present tense: "add" not "added" or "adds"
   - Don't capitalize the first letter
   - No period at the end

4. **Body (optional)**: Provides detailed explanation

   - Use to explain the motivation for the change
   - Can include "BREAKING CHANGE:" to indicate breaking changes

5. **Footer (optional)**: References to issues or other metadata
   - Can include "Closes #123" to close issues
   - Can include "BREAKING CHANGE:" if not in body

##### Examples

Simple feature:

```
feat(auth): add login functionality
```

Bug fix with issue reference:

```
fix(ui): resolve button alignment in mobile view

Closes #123
```

Breaking change:

```
feat(api): update user authentication endpoints

BREAKING CHANGE: The auth API now requires a token in the header instead of using cookies.
```

Documentation update:

```
docs(readme): update installation instructions
```

Style changes:

```
style(components): format according to new prettier rules
```

Refactoring:

```
refactor(utils): simplify date formatting functions
```

Performance improvement:

```
perf(images): optimize image loading process
```

Test addition:

```
test(auth): add unit tests for login process
```

Dependency updates:

```
build(deps): update React to v18.3.1
```

CI configuration:

```
ci(workflow): update GitHub Actions workflow
```

Chore:

```
chore(release): prepare for v1.2.0 release
```

Revert:

```
revert: feat(auth): add login functionality

This reverts commit abc1234.
```

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
