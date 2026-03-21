## 1. Project Setup

- [ ] 1.1 Initialize Next.js 15 project with TypeScript and Tailwind CSS
- [ ] 1.2 Install dependencies: gray-matter, fuse.js, @shikijs/rehype, next-mdx-remote
- [ ] 1.3 Configure next.config.js with static export and basePath
- [ ] 1.4 Set up project directory structure (content/, public/images/, app/, lib/)
- [ ] 1.5 Create TypeScript types for Article and Tag
- [ ] 1.6 Set up ESLint and Prettier configuration

## 2. Content Management

- [ ] 2.1 Implement Markdown file scanner to read content/ directory
- [ ] 2.2 Create frontmatter parser using gray-matter
- [ ] 2.3 Build article data loader with metadata extraction
- [ ] 2.4 Handle missing frontmatter with fallback values
- [ ] 2.5 Create utility to generate unique article slugs
- [ ] 2.6 Build content validation to ensure required fields

## 3. Theme System

- [ ] 3.1 Set up CSS variables for light/dark themes in globals.css
- [ ] 3.2 Create ThemeProvider component with localStorage persistence
- [ ] 3.3 Add system preference detection with prefers-color-scheme
- [ ] 3.4 Implement inline theme script to prevent flash on load
- [ ] 3.5 Create ThemeToggle component with sun/moon icons
- [ ] 3.6 Configure Tailwind dark mode with data-theme attribute

## 4. Article Listing

- [ ] 4.1 Create homepage layout with header and footer
- [ ] 4.2 Build ArticleCard component showing title, date, summary, tags
- [ ] 4.3 Implement article list page with pagination (10 per page)
- [ ] 4.4 Add pagination controls with prev/next buttons
- [ ] 4.5 Create empty state component for no articles
- [ ] 4.6 Implement static generation for all list pages

## 5. Article Detail

- [ ] 5.1 Configure MDX rendering with next-mdx-remote
- [ ] 5.2 Integrate Shiki for code syntax highlighting
- [ ] 5.3 Set up GitHub Light/Dark themes for code blocks
- [ ] 5.4 Build TableOfContents component from H2/H3 headings
- [ ] 5.5 Create article detail page layout with TOC sidebar
- [ ] 5.6 Implement static paths generation for all articles
- [ ] 5.7 Style Markdown content with typography plugin

## 6. Tag System

- [ ] 6.1 Create TagCloud component displaying all tags with counts
- [ ] 6.2 Build /tags page with alphabetically sorted tag list
- [ ] 6.3 Implement /tags/[tag] page filtering articles by tag
- [ ] 6.4 Add tag display to ArticleCard with clickable links
- [ ] 6.5 Create empty state for tags with no articles
- [ ] 6.6 Generate static paths for all tag pages

## 7. Search Functionality

- [ ] 7.1 Create build-time script to generate search-index.json
- [ ] 7.2 Extract searchable content (title, summary, tags, excerpt)
- [ ] 7.3 Build SearchPage with Fuse.js integration
- [ ] 7.4 Implement real-time search with minimum 2 characters
- [ ] 7.5 Style search results with highlighted matches
- [ ] 7.6 Add empty state for no search results
- [ ] 7.7 Lazy load search index on page mount

## 8. Static Deployment

- [ ] 8.1 Create .github/workflows/deploy.yml for GitHub Actions
- [ ] 8.2 Configure build and deployment steps
- [ ] 8.3 Set up GitHub Pages settings (Actions deployment)
- [ ] 8.4 Create 404 page with link back to homepage
- [ ] 8.5 Add CNAME file support for custom domains
- [ ] 8.6 Verify all asset paths work with basePath
- [ ] 8.7 Test deployment on GitHub Pages

## 9. UI Polish & Refinement

- [ ] 9.1 Implement opencode-style minimal design
- [ ] 9.2 Add subtle borders and spacing
- [ ] 9.3 Create responsive layouts for mobile/tablet/desktop
- [ ] 9.4 Add loading states and transitions
- [ ] 9.5 Optimize images with Next.js Image component
- [ ] 9.6 Add SEO meta tags and Open Graph data
- [ ] 9.7 Create favicon and touch icons

## 10. Content & Documentation

- [ ] 10.1 Create sample articles in content/ directory
- [ ] 10.2 Add example images to public/images/
- [ ] 10.3 Write README with setup and usage instructions
- [ ] 10.4 Document Markdown frontmatter format
- [ ] 10.5 Add contribution guidelines
- [ ] 10.6 Test end-to-end workflow with real content
