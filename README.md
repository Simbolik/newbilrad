# AlltomSEO.se

**Professional Swedish SEO Content Platform** - A modern, SEO-optimized website built with Next.js 15 and Payload CMS 3.

## 🎯 About

AlltomSEO.se is a Swedish content platform dedicated to helping users master search engine optimization (SEO). The site provides comprehensive guides, strategies, and checklists covering all aspects of SEO:

- **On-Page SEO** - Content optimization, keyword placement, internal linking
- **Off-Page SEO** - Backlinks, authority signals, credibility building  
- **Technical SEO** - Site speed, mobile-friendliness, crawlability

## 🚀 Tech Stack

### Backend
- **Payload CMS 3.68.2** - Headless CMS with full TypeScript support
- **MongoDB 8.0.16** - Database for content storage
- **Lexical Editor** - Full-featured rich text editing with all features enabled

### Frontend
- **Next.js 15.5.7** - App Router with server components
- **React 19.2.1** - UI library
- **TypeScript 5.7.3** - Type safety
- **Tailwind CSS 3.4.3** - Utility-first styling
- **Poppins Font** - Custom web fonts

### Features
- ✅ Draft/Publish workflow with versioning
- ✅ Live preview and draft previews
- ✅ SEO plugin with meta fields for Posts, Pages, and Categories
- ✅ Swedish date formatting with author attribution
- ✅ Smart excerpt generation (80 words)
- ✅ Category taxonomy with individual hero content
- ✅ Responsive images
- ✅ JSON-LD structured data
- ✅ Mobile-first design with unified box card styling
- ✅ Root-level post URLs (e.g., `/post-slug` instead of `/posts/post-slug`)
- ✅ Page Heroes collection for manageable hero content
- ✅ Full Lexical editor features (tables, formatting, media, etc.)

## 📁 Project Structure

```
/home/dl/projects/alltomseo/
├── src/
│   ├── app/
│   │   ├── (frontend)/          # Public website
│   │   │   ├── page.tsx          # Homepage
│   │   │   ├── [slug]/           # Dynamic routes
│   │   │   └── layout.tsx        # Site layout
│   │   └── (payload)/            # Admin panel
│   ├── collections/              # Payload collections
│   │   ├── Posts/                # Blog posts
│   │   ├── Pages/                # Static pages
│   │   ├── Categories/           # Taxonomy with SEO
│   │   ├── PageHeroes/           # Hero content manager
│   │   ├── Media/                # Image uploads
│   │   └── Users/                # Admin users
│   ├── components/
│   │   └── site/                 # Frontend components
│   │       ├── posts/            # Post components
│   │       ├── home/             # Homepage components
│   │       ├── PrimaryNav.tsx    # Navigation
│   │       ├── LeftSidebar.tsx   # Category sidebar
│   │       └── Footer.tsx        # Footer
│   └── lib/
│       ├── payload.ts            # Data fetching helpers
│       ├── lexical-to-html.ts    # Content renderer
│       ├── swedish-date.ts       # Date formatting
│       └── jsonld/               # SEO schemas
├── public/
│   ├── media/                    # Uploaded images
│   └── Fonts/                    # Poppins font files
├── payload.config.ts             # Payload configuration
└── .env.local                    # Environment variables
```

## 🛠️ Setup & Installation

### Prerequisites

- **Node.js** 20.19.6 or higher
- **pnpm** 10.25.0 or higher
- **MongoDB** 8.0.16 (running locally or remote)

### Installation

1. **Clone the repository** (if not already done)
   ```bash
   cd /home/dl/projects/alltomseo
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**
   
   Create `.env.local` in the project root:
   ```bash
   MONGODB_URI=mongodb://localhost:27017/alltomseo
   PAYLOAD_SECRET=your-secret-key-here
   NEXT_PUBLIC_SERVER_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   ```bash
   sudo systemctl start mongod
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin

## 📝 Content Management

### Creating Content

1. Navigate to http://localhost:3000/admin
2. Create your first admin user (on first visit)
3. Use the admin panel to:
   - Create/edit posts and pages
   - Upload images
   - Manage categories
   - Configure SEO settings

### Collections

#### Posts
- Title, slug, content (Lexical rich text)
- Hero image
- Categories (multiple)
- Published date with Swedish formatting
- Author attribution ("Redaktionen på AlltomSEO")
- SEO fields (title, description, image)
- Draft/publish workflow
- Root-level URLs (e.g., `/seo-guide`)

#### Pages
- Title, slug, content (Lexical rich text)
- Simple rich text content (no complex blocks)
- SEO fields (title, description, image)
- Draft/publish workflow
- Clean box card design

#### Categories
- Name, slug
- Hero content (Lexical rich text) - unique per category
- SEO fields (title, description, image)
- Used to organize posts
- Individual hero content for each category page

#### Page Heroes
- Manageable hero content for different page types
- Homepage, Search, About, Contact, Custom pages
- Rich text editor for custom content
- Replaces hardcoded heroes

#### Media
- Image uploads
- Alt text (required for SEO)
- Automatic width/height detection

## 🎨 Styling & Design

- **Design System**: Custom CSS variables in `globals.css`
- **Colors**: Neutral grays with brand accent `#c07c3e`
- **Typography**: Poppins font family (100-900 weights)
- **Components**: Self-contained with Tailwind classes
- **Shadows**: Custom 3D shadow effect (`shadow-3d`)
- **Responsive**: Mobile-first approach

## 🔧 Development

### Key Commands

```bash
# Development
pnpm dev                  # Start dev server (port 3000)

# Production
pnpm build               # Build for production
pnpm start               # Start production server

# Database
sudo systemctl start mongod      # Start MongoDB
sudo systemctl status mongod     # Check MongoDB status
mongosh                          # Access MongoDB shell

# Other
pnpm lint                # Run ESLint
```

### MongoDB Commands

```bash
# Access database
mongosh
use alltomseo

# View collections
show collections

# Query posts
db.posts.find()

# Exit
exit
```

## 🌍 Swedish Localization

The entire site is optimized for Swedish audience:

- Swedish language (`lang="sv"`)
- Swedish date formatting (e.g., "11 december 2025")
- Swedish content and terminology
- Locale tags (`sv-SE`)

## 📊 SEO Features

### JSON-LD Schemas
- Organization schema (main page)
- Article schema (blog posts)
- Breadcrumb navigation
- Category pages
- About/Contact pages

### Meta Tags
- Open Graph tags
- Twitter Card tags
- Canonical URLs
- Language alternates
- Robots directives

### Content Optimization
- Smart excerpt generation (80 words with sentence completion)
- Swedish date formatting (e.g., "11 december, 2025")
- Author attribution with link to About page
- Unified box card design across all content types
- Heading hierarchy with proper styling
- Image optimization
- Swedish keyword optimization
- Proper paragraph spacing without excess margins

## 🚢 Production Deployment

### Before Deploying

1. Update environment variables for production:
   ```bash
   MONGODB_URI=<production-mongodb-uri>
   PAYLOAD_SECRET=<strong-random-secret>
   NEXT_PUBLIC_SERVER_URL=https://alltomseo.se
   ```

2. Build the application:
   ```bash
   pnpm build
   ```

3. Test production build locally:
   ```bash
   pnpm start
   ```

### MongoDB Backup

```bash
# Create backup
mongodump --db=alltomseo --out=/path/to/backup/

# Restore backup
mongorestore --db=alltomseo /path/to/backup/alltomseo/
```

## 🔌 External Post Creation API

The platform includes an API for creating posts programmatically from external services.

### Quick Start

```bash
curl -X POST https://alltomseo.se/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "title": "Article Title",
    "slug": "article-slug",
    "metaDescription": "SEO description",
    "image": "https://example.com/image.jpg",
    "imageAlt": "Image description",
    "body": "Intro text.\n\n## Section Heading\n\nContent here."
  }'
```

### Features
- Bearer token authentication via `API_KEY` environment variable
- Markdown-style headings (`##`, `###`, `####`) converted to proper HTML
- Auto-download images from URL and convert to WebP
- SEO meta description support
- Posts are published immediately

📖 **[Full API Documentation](./docs/API.md)**

## 📚 Documentation

- **[docs/API.md](./docs/API.md)** - External Post Creation API
- **[PAYLOAD-DOCS.md](./PAYLOAD-DOCS.md)** - Complete Payload CMS documentation
- **[Payload CMS Docs](https://payloadcms.com/docs)** - Official documentation
- **[Next.js Docs](https://nextjs.org/docs)** - Next.js App Router guide

## 🐛 Troubleshooting

### Port 3000 already in use
```bash
lsof -i :3000          # Find process
kill -9 <PID>          # Kill process
```

### MongoDB connection issues
```bash
sudo systemctl restart mongod
sudo journalctl -u mongod -f    # View logs
```

### Clear Next.js cache
```bash
rm -rf .next
pnpm dev
```

### Build errors
```bash
rm -rf .next node_modules
pnpm install
pnpm build
```

## 👥 Team

Built for Swedish SEO professionals and content creators.

## 📄 License

Private project - All rights reserved.

---

**Last Updated**: December 11, 2025  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
