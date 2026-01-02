# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Bilråd.se is a Swedish car content platform built with Next.js 15 App Router and Payload CMS 3. It's a full-stack application that combines a headless CMS backend with a production-ready frontend website focused on Swedish automotive content.

**Tech Stack:**
- **Backend:** Payload CMS 3.68.2 with MongoDB 8.0.16
- **Frontend:** Next.js 15.4.8 with React 19.2.1
- **Language:** TypeScript 5.7.3
- **Styling:** Tailwind CSS 3.4.3
- **Rich Text:** Lexical editor with full features
- **Testing:** Vitest (integration) + Playwright (e2e)

## Common Development Commands

### Development
```bash
pnpm dev                  # Start dev server (port 3000, Turbopack disabled)
pnpm build                # Build for production + generate sitemap
pnpm start                # Start production server
pnpm dev:prod             # Clean build and start production locally
```

### Database (MongoDB)
```bash
sudo systemctl start mongod      # Start MongoDB
sudo systemctl status mongod     # Check MongoDB status
sudo systemctl restart mongod    # Restart MongoDB
mongosh                          # Access MongoDB shell
```

### Code Quality
```bash
pnpm lint                # Run ESLint
pnpm lint:fix            # Run ESLint with auto-fix
```

### Testing
```bash
pnpm test                # Run all tests (integration + e2e)
pnpm test:int            # Run integration tests (Vitest)
pnpm test:e2e            # Run e2e tests (Playwright)
```

### Payload CMS
```bash
pnpm payload generate:types       # Regenerate TypeScript types
pnpm payload generate:importmap   # Regenerate import map
```

### Maintenance
```bash
pnpm reinstall           # Clean reinstall dependencies
```

## Project Architecture

### Directory Structure

**Core Application:**
- `src/app/(frontend)/` - Public-facing Next.js routes (Swedish car content website)
- `src/app/(payload)/` - Payload CMS admin panel routes (`/admin`)
- `src/collections/` - Payload CMS collections (Posts, Pages, Categories, Media, Users, PageHeroes)
- `src/blocks/` - Reusable Lexical editor blocks (Banner, Code, MediaBlock, Form, etc.)
- `src/components/` - React components (organized by function: site, ui, shared)
- `src/lib/` - Utility functions and helpers
- `src/hooks/` - Payload CMS hooks (revalidation, transformations)
- `src/access/` - Access control functions
- `src/plugins/` - Payload plugin configurations

**Configuration:**
- `src/payload.config.ts` - Main Payload CMS configuration
- `src/payload-types.ts` - Auto-generated TypeScript types (DO NOT edit manually)

### Content Collections

**Posts** (`src/collections/Posts/`):
- Blog articles with Lexical rich text editor
- Draft/publish workflow with versioning
- SEO plugin integration (meta fields)
- Root-level URLs (e.g., `/article-slug` instead of `/posts/article-slug`)
- Hero images, categories, related posts
- Published date with Swedish formatting

**Pages** (`src/collections/Pages/`):
- Static content pages
- Same draft/publish workflow as Posts
- Simple rich text content

**Categories** (`src/collections/Categories.ts`):
- Taxonomy for organizing posts
- Nested category support via `plugin-nested-docs`
- Individual hero content per category
- SEO fields

**Media** (`src/collections/Media.ts`):
- Image uploads with alt text (required)
- Automatic WebP conversion
- Multiple size variants (thumbnail, small, medium, large, xlarge, og)
- Responsive image support

**PageHeroes** (`src/collections/PageHeroes.ts`):
- Manageable hero content for different page types
- Replaces hardcoded hero sections

**Users** (`src/collections/Users/`):
- Admin authentication
- Access control for content management

### Key Architectural Patterns

**Data Fetching:**
- All Payload queries go through `getPayload()` helper from `src/lib/payload.ts`
- Server components fetch data directly
- No client-side data fetching for published content
- Use `overrideAccess: false` for access control enforcement

**Content Rendering:**
- Lexical content → HTML conversion via `src/lib/lexical-to-html.ts`
- Plain text extraction for excerpts via `lexicalToPlainText()`
- Custom rendering for blocks via `src/blocks/RenderBlocks.tsx`

**Revalidation:**
- On-demand revalidation hooks (`revalidatePost`, `revalidateRedirects`)
- Static generation with revalidation (ISR) for dynamic routes
- Default revalidation: 600 seconds (10 minutes)

**Routing:**
- Posts use root-level URLs (`/slug` not `/posts/slug`)
- Paginated homepage: `/` (page 1), `/page/2`, `/page/3`, etc.
- Admin panel: `/admin`
- API routes: `/api/*` (including external post creation API)

**Swedish Localization:**
- All content in Swedish (`lang="sv"`)
- Swedish date formatting via `src/lib/swedish-date.ts`
- Swedish terminology throughout
- Locale: `sv-SE`

### Access Control

Access patterns defined in `src/access/`:
- `authenticated` - User must be logged in
- `authenticatedOrPublished` - Logged in OR content is published
- `anyone` - Public access

Collections follow this pattern:
- **Create/Update/Delete:** Authenticated users only
- **Read:** Published content is public, drafts require authentication

### Plugins Configuration

Located in `src/plugins/index.ts`:
- **SEO Plugin:** Meta tags, Open Graph, Twitter cards
- **Redirects Plugin:** URL redirect management
- **Search Plugin:** Full-text search on posts
- **Form Builder Plugin:** Dynamic forms
- **Nested Docs Plugin:** Category hierarchies

### External Post Creation API

**Endpoint:** `POST /api/posts`
- Bearer token authentication via `API_KEY` env variable
- Markdown-style headings automatically converted to Lexical format
- Auto-downloads images from URL and converts to WebP
- Posts published immediately
- See `docs/API.md` for full documentation

### Testing Strategy

**Integration Tests** (Vitest):
- Located in `tests/int/`
- Pattern: `*.int.spec.ts`
- Run with environment: jsdom
- Setup file: `vitest.setup.ts`

**E2E Tests** (Playwright):
- Located in `tests/e2e/`
- Pattern: `*.e2e.spec.ts`
- Chromium browser only
- Auto-starts dev server on port 3000

## Environment Variables

Required variables (see `.env.example`):
- `DATABASE_URI` - MongoDB connection string (e.g., `mongodb://127.0.0.1:27017/bilrad`)
- `PAYLOAD_SECRET` - JWT encryption key
- `NEXT_PUBLIC_SERVER_URL` - Public URL (no trailing slash)
- `CRON_SECRET` - Scheduled jobs authentication
- `PREVIEW_SECRET` - Draft preview authentication
- `API_KEY` - External post creation API authentication

**Database Name:** This project uses a MongoDB database named `bilrad`. This database is completely isolated from other projects on the same MongoDB instance.

## Development Guidelines

### Working with Collections

When modifying collections:
1. Update collection definition in `src/collections/`
2. Run `pnpm payload generate:types` to update types
3. Update any affected queries in `src/lib/payload.ts`
4. Test with both draft and published content

### Adding New Blocks

Blocks enable rich content in the Lexical editor:
1. Create block config in `src/blocks/YourBlock/config.ts`
2. Create React component in `src/blocks/YourBlock/Component.tsx`
3. Add to `src/blocks/RenderBlocks.tsx`
4. Register in collection's Lexical editor config

### Content Revalidation

When content changes, Next.js pages must be revalidated:
- Use `afterChange` hooks in collections
- Call `revalidateTag()` or `revalidatePath()`
- Example: `src/collections/Posts/hooks/revalidatePost.ts`

### TypeScript Types

- `src/payload-types.ts` is auto-generated - NEVER edit manually
- Regenerate types after collection changes: `pnpm payload generate:types`
- Import types from `@/payload-types`

### Working with MongoDB

Access database via `mongosh`:
```bash
mongosh
use bilrad  # or your database name
show collections
db.posts.find()
exit
```

Backup/restore:
```bash
mongodump --db=bilrad --out=/backup/path/
mongorestore --db=bilrad /backup/path/bilrad/
```

### Pagination System

Homepage uses paginated posts (6 per page):
- Page 1: `/`
- Page 2+: `/page/2`, `/page/3`, etc.
- See `docs/PAGINATION.md` for implementation details
- Pagination component: `src/components/Pagination/`
- Configure posts per page in route handlers

### Image Handling

Images are managed through Payload Media collection:
- Upload via admin panel or API
- Automatic WebP conversion via Sharp
- Multiple size variants generated
- Always provide alt text (required for SEO)
- Access via `heroImage` relationship field

## Troubleshooting

**Port 3000 in use:**
```bash
lsof -i :3000
kill -9 <PID>
```

**MongoDB connection issues:**
```bash
sudo systemctl restart mongod
sudo journalctl -u mongod -f
```

**Build errors:**
```bash
rm -rf .next node_modules
pnpm install
pnpm build
```

**Type errors after collection changes:**
```bash
pnpm payload generate:types
```

## Additional Documentation

- `README.md` - Comprehensive project documentation
- `PAYLOAD-DOCS.md` - Official Payload template documentation
- `docs/API.md` - External post creation API
- `docs/PAGINATION.md` - Homepage pagination system
- [Payload CMS Docs](https://payloadcms.com/docs) - Official framework docs
- [Next.js Docs](https://nextjs.org/docs) - Next.js App Router guide
