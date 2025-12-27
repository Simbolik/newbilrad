# Homepage Pagination System

This document describes the pagination system for the homepage posts.

## Overview

The homepage displays posts in a paginated format with 6 posts per page. The pagination uses a modern Tailwind CSS design with a bordered box indicator for the active page.

## URL Structure

| URL | Description |
|-----|-------------|
| `/` | Homepage - displays first 6 posts |
| `/page/2` | Page 2 - displays posts 7-12 |
| `/page/3` | Page 3 - displays posts 13-18 |
| etc. | Additional pages as needed |

## File Structure

```
src/app/(frontend)/
├── page.tsx                    # Homepage (page 1)
└── page/[pageNumber]/
    └── page.tsx                # Paginated pages (/page/2, /page/3, etc.)
```

## Components

### Pagination Component

Located at `src/components/Pagination/index.tsx`

```tsx
<Pagination 
  page={currentPage} 
  totalPages={totalPages}
  basePath="/page"  // Optional, defaults to "/posts/page"
/>
```

**Props:**
- `page` (number) - Current page number
- `totalPages` (number) - Total number of pages
- `basePath` (string, optional) - Base path for pagination URLs. Defaults to `/posts/page`
- `className` (string, optional) - Additional CSS classes

### UI Components

The pagination UI is built with shadcn/ui components located at `src/components/ui/pagination.tsx`:

- `Pagination` - Main navigation wrapper
- `PaginationContent` - Content container
- `PaginationItem` - Individual page item
- `PaginationLink` - Clickable page link (with active state styling)
- `PaginationPrevious` - Previous page button
- `PaginationNext` - Next page button
- `PaginationEllipsis` - Ellipsis for truncated page ranges

## SEO Configuration

### Page Titles

- **Page 1**: Uses homepage title from Page Heroes content
- **Page 2+**: `Senaste artiklarna - Sida {pageNumber} - {domainName}`

Example: `Senaste artiklarna - Sida 2 - alltomseo.se`

### Meta Descriptions

- **Page 1**: Uses homepage meta description
- **Page 2+**: `Här hittar du äldre artiklar om SEO på {domainName} (Sida {pageNumber}). Fortsätt läsa vårt arkiv för fler guider och tips.`

### Canonical URLs

Each page has its own canonical URL:
- Page 1: `https://domain.com/`
- Page 2: `https://domain.com/page/2`
- Page 3: `https://domain.com/page/3`

## Page Content

### Homepage (Page 1)

- Hero content from Page Heroes collection (if configured)
- 6 most recent posts
- Pagination controls (if more than 6 posts exist)

### Paginated Pages (Page 2+)

- Breadcrumbs: `Hem › Sida {pageNumber}`
- H1 heading: `Senaste artiklarna – Sida {pageNumber}`
- 6 posts for that page
- Pagination controls

## Styling

### Active Page Indicator

The active page number displays inside a subtle bordered box:

```css
border border-gray-300 bg-white rounded-md shadow-sm
```

### Breadcrumbs

Uses the same styling as article breadcrumbs:
- Home icon with "Hem" link
- `›` separator
- Current page text in bold

### H1 Heading

Matches homepage hero styling:
```css
text-3xl font-bold text-gray-800
```

## Static Generation

Paginated pages are statically generated at build time using `generateStaticParams()`:

```tsx
export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise });
  const { totalDocs } = await payload.count({
    collection: 'posts',
    overrideAccess: false,
  });

  const totalPages = Math.ceil(totalDocs / 6);
  const pages: { pageNumber: string }[] = [];

  for (let i = 2; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) });
  }

  return pages;
}
```

Pages revalidate every 600 seconds (10 minutes).

## Configuration

### Posts Per Page

Currently set to 6 posts per page. To change, update the `postsPerPage` constant in both:
- `src/app/(frontend)/page.tsx`
- `src/app/(frontend)/page/[pageNumber]/page.tsx`

### Revalidation

Pages revalidate every 600 seconds. Configured via:
```tsx
export const revalidate = 600;
```

## Usage Examples

### Adding Pagination to Other Collections

To add pagination to other sections (e.g., categories), use the Pagination component with a custom `basePath`:

```tsx
<Pagination 
  page={currentPage} 
  totalPages={totalPages}
  basePath="/category/seo/page"
/>
```

This would generate URLs like `/category/seo/page/2`, `/category/seo/page/3`, etc.
