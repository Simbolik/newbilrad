# External Post Creation API

This API allows external services to create and publish posts automatically.

## Endpoint

```
POST /api/create-post
```

## Authentication

All requests require a Bearer token in the Authorization header:

```
Authorization: Bearer YOUR_API_KEY
```

The API key is configured in the `.env` file as `API_KEY`.

## Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Post title (also used as page title) |
| `body` | string | Yes | Post content with markdown headings |
| `slug` | string | No | URL slug (auto-generated from title if not provided) |
| `metaDescription` | string | No | SEO meta description |
| `image` | string | No | URL to hero image (will be downloaded and converted to WebP) |
| `imageAlt` | string | No | Alt text for the image (defaults to title) |

## Body Content Format

The `body` field supports markdown-style headings:

- `## Heading` → `<h2>`
- `### Heading` → `<h3>`
- `#### Heading` → `<h4>`
- Regular text → `<p>`

**Note:** Don't use `# Heading` (h1) in the body - the `title` field is rendered as h1.

### Example Body

```
Intro paragraph text here.

## Section Heading

Paragraph content under the section.

### Subsection Heading

More detailed content here.
```

## Example Request

```bash
curl -X POST https://bilråd.se/api/create-post \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "title": "Guide till bilköp 2024",
    "slug": "guide-bilkop-2024",
    "metaDescription": "Komplett guide till bilköp för nybörjare.",
    "image": "https://example.com/car.jpg",
    "imageAlt": "Bil vid visningslokal",
    "body": "Att köpa bil är en stor investering.\n\n## Vad ska man tänka på?\n\nDet finns många faktorer att överväga.\n\n### Budget\n\nBestäm din budget innan du börjar söka."
  }'
```

## Response

### Success (201)

```json
{
  "success": true,
  "post": {
    "id": "generated-id",
    "title": "Guide till bilköp 2024",
    "slug": "guide-bilkop-2024",
    "status": "published"
  }
}
```

### Error Responses

| Status | Description |
|--------|-------------|
| 400 | Missing or invalid required fields |
| 401 | Missing or invalid API key |
| 500 | Server error (e.g., duplicate slug) |

## Image Processing

When an `image` URL is provided:

1. The image is downloaded from the URL
2. Uploaded to Payload's media collection
3. Automatically converted to WebP format
4. Multiple sizes are generated (thumbnail, small, medium, large, xlarge, og)
5. Attached as the post's hero image

## Test Script

A test script is provided at `scripts/create-post.mjs`:

```bash
# Start the dev server
pnpm dev

# In another terminal, run the test script
node scripts/create-post.mjs
```

Edit the script to customize the test data.
