import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from '@/lib/payload'
import { textToLexical } from '@/lib/text-to-lexical'
import type { File } from 'payload'

interface CreatePostRequest {
  title: string
  body: string
  slug?: string
  metaDescription?: string
  image?: string // URL to image
  imageAlt?: string // Alt text for image
}

/**
 * Download image from URL and return as File object for Payload
 */
async function fetchImageFile(imageUrl: string): Promise<File> {
  const response = await fetch(imageUrl, { method: 'GET' })

  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  // Extract filename from URL or use a default
  const urlPath = new URL(imageUrl).pathname
  const filename = urlPath.split('/').pop() || `image-${Date.now()}.jpg`

  // Determine mimetype from response or URL extension
  const contentType =
    response.headers.get('content-type') ||
    (filename.endsWith('.png')
      ? 'image/png'
      : filename.endsWith('.webp')
        ? 'image/webp'
        : filename.endsWith('.gif')
          ? 'image/gif'
          : 'image/jpeg')

  return {
    name: filename,
    data: buffer,
    mimetype: contentType,
    size: buffer.length,
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify Bearer token authentication
    const authHeader = request.headers.get('authorization')
    const apiKey = process.env.API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured on server' }, { status: 500 })
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 },
      )
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    if (token !== apiKey) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
    }

    // Parse request body
    const body: CreatePostRequest = await request.json()

    // Validate required fields
    if (!body.title || typeof body.title !== 'string') {
      return NextResponse.json(
        { error: 'Title is required and must be a string' },
        { status: 400 },
      )
    }

    if (!body.body || typeof body.body !== 'string') {
      return NextResponse.json(
        { error: 'Body is required and must be a string' },
        { status: 400 },
      )
    }

    // Get Payload instance
    const payload = await getPayload()

    // Convert body text to Lexical format
    const lexicalContent = textToLexical(body.body)

    // Handle image upload if provided
    let heroImageId: string | undefined
    if (body.image && typeof body.image === 'string') {
      try {
        const imageFile = await fetchImageFile(body.image)
        const mediaDoc = await payload.create({
          collection: 'media',
          data: {
            alt: body.imageAlt || body.title, // Use imageAlt or fallback to title
          },
          file: imageFile,
        })
        heroImageId = mediaDoc.id
      } catch (error) {
        console.error('Error uploading image:', error)
        // Continue without image if upload fails
      }
    }

    // Create the post (published immediately)
    const post = await payload.create({
      collection: 'posts',
      data: {
        title: body.title,
        content: lexicalContent,
        slug: body.slug,
        heroImage: heroImageId,
        meta: body.metaDescription ? { description: body.metaDescription } : undefined,
        _status: 'published',
      } as any,
    })

    return NextResponse.json(
      {
        success: true,
        post: {
          id: post.id,
          title: post.title,
          slug: post.slug,
          status: post._status,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      {
        error: 'Failed to create post',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to create posts.' },
    { status: 405 },
  )
}
