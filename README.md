## Stable first viewport and SVG icons

The site uses a fixed-position header and lazy-loaded React routes. The `.main` region reserves a minimum of **one small viewport height** (`100svh`) so that the footer does not first appear inside the viewport while route chunks are loading and then jump below the loaded content. This follows the existing Lighthouse layout-shift attribution to the footer across Home, About, Projects and Bytes. It is not a claim that every CLS source (such as image sizing or font swaps) is solved.

All ordinary link, contact, category and GitHub icons use the small in-repo SVG vocabulary at `src/components/global/Icons`. Icons inherit `currentColor` and are decorative (`aria-hidden`); interactive links retain their own readable labels. Font Awesome and its globally imported CSS/fonts have been removed. Add new SVG shapes intentionally rather than reinstalling an icon-font dependency.

`yarn verify:svg-layout` is part of the production build and checks the dependency and main viewport contracts. No ad-hoc Lighthouse repeat run is required for this change; existing CI quality measurements remain informational.

## Native UI animation (no runtime dependency)

Decorative UI reveals, entrance effects, hover feedback, and skill-progress bars use **CSS transitions** activated by a single browser-native `IntersectionObserver` in `src/services/reveals.ts`. A `MutationObserver` registers lazy-loaded/route content. There is no Framer Motion, Motion DOM, or third-party intersection-observer package.

- Markup opts in with `data-reveal="viewport"` or `data-reveal="scale"`; use `data-hover-lift` for optional card hover effects. Do not introduce delayed per-element JS animation controllers.
- Animation is a **decorative enhancement**: no-JavaScript content remains readable; reduced-motion preferences disable transforms and transitions.
- `yarn verify:no-motion` checks that no forbidden Motion imports, JSX tags, or obsolete direct dependencies return.
- Header/mobile menu interaction uses normal React state and CSS only.
- Keep reveal transforms layout-independent and short; no staggered JS timers.

# Jason McAlpin - Personal Website

This is the source code for Jason McAlpin's personal website, built with React, TypeScript, and Vite.

## Features

- **Modern React Architecture**: Built with React 19, TypeScript, and Vite for optimal performance
- **Responsive Design**: Fully responsive layout that works on all devices
- **Content Sections**: Home, About, Projects, Bytes (blog), and Contact sections
- **Interactive Elements**: Includes animations and interactive components using Framer Motion
- **Syntax Highlighting**: Code snippets in blog posts with syntax highlighting via Prism
- **SEO Optimized**: Includes meta tags and structured data for better search engine visibility
- **Performance Optimized**: Lazy loading, code splitting, and image optimization

## Technology Stack

- **Frontend**: React 19, TypeScript, Redux Toolkit
- **Styling**: SCSS, Tailwind CSS
- **Build Tools**: Vite, ESLint, TypeScript
- **Deployment**: GitHub Actions CI/CD pipeline
- **Content**: Markdown with React Markdown for blog posts
- **Data Storage**: JSON for all published structured content

## Development

### Prerequisites

- Node.js (v22+)
- Yarn classic (v1.x)

### Getting Started

1. Clone the repository

   ```bash
   git clone https://github.com/jasonmcalpin/jasonmcalpin-frontend.git
   cd jasonmcalpin-frontend
   ```

2. Install dependencies

   ```bash
   yarn install --frozen-lockfile
   ```

3. Start the development server

   ```bash
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `yarn dev` - Start the development server
- `yarn build` - Build for production
- `yarn optimize-images` - Optimize images using Sharp
- `yarn lint` - Run ESLint
- `yarn preview` - Preview the production build locally
- `yarn type-check` - Run TypeScript type checking

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

## Codex agent guidance

Project-specific instructions live in [AGENTS.md](AGENTS.md) and reusable skills are installed in [`.agents/skills/`](.agents/skills/). These originate from [codex-engineering-guidelines](https://github.com/jasonmcalpin/codex-engineering-guidelines), with website-specific deployment, content, and consent contracts added locally. Review upstream improvements explicitly; these are versioned copies, not automatically synchronized.

## Static HTML publishing and SEO

The website remains a **React 19 / Vite client application**. The build now also generates contentful HTML for the primary public routes from the existing `public/data/bytes.json`, `projects.json`, `experience.json`, and `social.json` files.

- `yarn build` creates `dist/index.html` plus extension-suffixed static HTML documents (for example `dist/bytes/champion-your-team.html`). `.htaccess` maps public extensionless routes to the appropriate document before the SPA fallback. Routes with nested pages, currently `/projects/` and `/bytes/`, also get a physical `index.html` inside their corresponding directories. This prevents directory listings when the origin does not apply Apache rewrite rules.
- A generated `dist/sitemap.xml` covers published pages and catalog entries; there is no manually maintained sitemap. `dist/static-pages-manifest.json` makes the build's route contract inspectable.
- Each document contains a semantic heading, meaningful content, unique title/description/canonical/Open Graph metadata and JSON-LD where appropriate. The article source is rendered with the same React Markdown and GFM libraries used by the client.
- `yarn verify:static` asserts that generated files contain content and metadata **without executing JavaScript**, correspond to the sitemap, and retain the React bootstrap. Build runs it automatically and fails on violations.

**Rendering boundary:** This is progressive static HTML (a no-JavaScript content fallback), **not React SSR hydration**. The normal React SPA takes over the root on startup and preserves existing interactivity. Complete visual equivalence between the static fallback and the hydrated SPA is not claimed. Interactive games and lessons stay client-rendered. This approach avoids a server runtime and any React Router/Redux SSR migration, while making public article and portfolio content available immediately to crawlers.

**Deployment prerequisite:** The existing Apache `.htaccess` with `mod_rewrite` must be honored by the origin. If hosting changes to a static server without Apache rewrites, configure clean-URL fallback for generated `.html` files at the new host. SCP deployment currently copies files but does not remove pages deleted from a catalog; after removing/renaming a published slug, clear obsolete generated HTML at the server as part of the release.

**SEO measurement:** The Lighthouse audit now serves the built output through `scripts/serve-built-site.mjs`, which resolves extensionless public routes to their generated HTML rather than falling back to the generic SPA index. Compare its reports with the prior baseline while noting that the local serving strategy changed. Lighthouse scores still do not prove crawler visibility or source-HTML completeness. The static HTML contract is independently verified by the build. The long-term upgrade to fully hydrated static React markup requires making React/Redux/router rendering deterministic on both server and client.

## Initial rendering and performance contracts

The homepage uses two distinct code paths: the **critical route chunk** renders navigation, the hero and its CTAs, while `HomeBelowFold.tsx` is a separate dynamic-import chunk containing the About, Featured Projects, Recent Bytes and contact sections. An IntersectionObserver near the fold requests this code when it is likely to be needed; card data loading starts only once the deferred component mounts. `yarn verify:chunks` checks the emitted bundle boundary at build time. This differs from image lazy loading, which does not defer JavaScript module evaluation.

The Lighthouse CI server negotiates gzip/Brotli for textual responses using the browser's `Accept-Encoding` header. The previous static preview delivered uncompressed JS/CSS, so prior Lighthouse transfer sizes are not comparable with a properly compressed origin. Its compression behavior is an approximate benchmark transport, not a substitute for measuring actual Cloudflare/staging responses.

Accessibility corrections include footer heading order, high-contrast controls and allowing local embedded font data under `font-src` without broadening `script-src`.

## Lighthouse baseline

Pull requests and pushes to `main` run a separate, informational **mobile** Lighthouse CI audit against the production build artifact. The audit does not change the release/tag deployment path or block staging/production on score thresholds. Each representative route is collected three times:

- `/`
- `/about`
- `/projects`
- `/bytes`
- `/bytes/champion-your-team`

The configuration lives in [`.lighthouserc.cjs`](.lighthouserc.cjs). See the **Lighthouse baseline (informational)** job's uploaded report artifacts in GitHub Actions. Reports remain in GitHub; they are not uploaded to third-party temporary public storage. The scores are measurements of a locally served built SPA, not of Cloudflare or production network conditions.

Targets of 85 (performance) and 95 (accessibility, best practices, SEO) are **warnings only** while the baseline is established. Treat an audit failure as an audit-infrastructure/runtime issue to diagnose, not as evidence the site violates a score budget. Compare the same device settings and URLs before and after static HTML generation. Lighthouse SEO scores alone do not validate server-delivered page content; prerendering requires separate HTML contract checks.

## CI verification and release safety

CI uses the committed `yarn.lock` and runs `yarn lint`, `yarn type-check`, `yarn test:run`, and `yarn build` before uploading deployment artifacts. Pushes to main update staging; same-repository pull requests preview on the **shared** staging site. A closed, unmerged PR resets shared staging to main.

Only `vMAJOR.MINOR.PATCH` tags whose tagged commit is an ancestor of `main` may deploy production. The tag must be created from an already-merged main commit. CI builds the tag, not a moving main branch, to ensure release reproducibility.

GitHub Actions secrets `FTP_HOST`, `FTP_USERNAME`, `SSH_PRIVATE_KEY`, `FTP_TARGET_PREVIEW`, and `FTP_TARGET` remain operator-managed; `SSH_PORT` is optional. `GTM_ID` is used only in tagged production builds, and analytics scripts are loaded only after current-policy opt-in. Production and staging deployment jobs use GitHub Environments named `production` and `staging`. Configure required reviewers and tag/branch deployment rules for `production` in GitHub repository settings before treating approvals as enforced.

**Deployment limitation:** previews overwrite one shared staging hostname; they are not isolated per-PR previews. The staging deployment concurrency group prevents concurrent uploads but not logical replacement by later queued workflows. Dedicated PR preview directories plus DNS/hosting routing would be a worthwhile future improvement, but require explicit server configuration.

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

## Authoring Byte Articles

All published content catalogs are JSON. Byte articles live in `public/data/bytes.json` as an array of records containing an ID, slug, title, excerpt, date, author, tags, image URL, reading time, and a **Markdown string** in `content`.

Fenced code snippets remain Markdown inside the JSON string (for example, a `typescript` fence). When editing an article, serialize Markdown with `JSON.stringify` or a JSON-aware editor rather than manually escaping quotes/newlines. The existing React Markdown/GFM and Prism renderer is unchanged by this migration.

`yarn verify:content` validates the article catalog and balanced Markdown code fences, and runs before every production build. The static publisher and browser fetch both read `bytes.json`; no TOML parser is required.

## Responsive image pipeline

`yarn optimize-images` uses Sharp to inspect source JPEG/PNG dimensions and
generate **non-upscaled WebP variants** for 320/640/960/1280/1600px widths. Original
files stay untouched. The job updates `src/generated/image-manifest.json` with
actual intrinsic width/height and only variants that exist on disk; it writes
derivatives to the ignored `public/assets/responsive/` directory for Vite to
copy into `dist`. Full-resolution pre-existing WebP assets remain the largest
source candidate, preserving fallback to original JPEG/PNG where necessary.

`OptimizedImage` uses `picture/source srcSet` and the caller's `sizes`
attribute so the browser selects a suitable downloaded width (rather than
always requesting a full-size WebP). It retains native lazy loading, default
aspect-ratio reservation, and an original-format fallback. Card and detail
views use different sizes policies. The common hero uses a responsive `picture`
behind its existing overlay; homepage grid tiles use responsive thumbnails.

`yarn dev` and `yarn build` regenerate the manifest before Vite starts.
`yarn verify:images` fails if a published article/project image is missing
or a declared variant was not generated. Image animation sources (GIF) and
SVG files are deliberately left unchanged.

**Authoring contract:** add or replace source assets, never edit generated
variants or the derived manifest directly. Regenerate via `yarn optimize-images`.
Image aliases and sizes are presentation decisions; source paths remain data
in JSON catalogs. Do not generate images on each user request.

## Local typography and font weight audit

The visual system uses **Inter** for body copy and **Orbitron** for headings.
The source previously requested Inter weights **300, 400, 500, 600 and 700**
and Orbitron **400, 500, 600 and 700** from the Google Fonts CDN.
Scanning the site for explicit Tailwind and CSS font weights found no
`font-light`/300 use and no extra-bold/800+ use. Current content uses regular
(400), medium (500), semibold (600), and bold (700); the range is covered by
**one variable Latin/Extended-Latin WOFF2 per family**.

The two files in `public/assets/fonts` are committed, self-hosted,
preloaded for critical body/headline rendering, and declared with
`font-display: swap`. There are no external Google Fonts CSS or font requests.
Missing non-Latin characters use the CSS system fallback. Both fonts retain
their original SIL Open Font License files alongside the binaries.

Source/provenance: `scripts/vendor-fonts.py` reproducibly retrieves Google's
[official fonts repository](https://github.com/google/fonts) at a **pinned Git
revision**, checks the exact Git blob hashes, restricts the weight axes to
400–700 (and fixes Inter's optical-size axis), subsets glyphs, and emits WOFF2
with FontTools. It is a **maintenance-only** script: the normal CI/build does
not download external fonts or require Python. If font needs change, regenerate
and commit new assets deliberately.

`yarn verify:fonts` validates real WOFF2 signatures, size budgets,
`font-display: swap`, preloads, no Google Fonts dependencies, and OFL licenses.
