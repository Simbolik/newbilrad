/**
 * Converts plain text with markdown headings to Lexical editor format for Payload CMS
 * Supports:
 * - # Heading 1 (h1)
 * - ## Heading 2 (h2)
 * - ### Heading 3 (h3)
 * - #### Heading 4 (h4)
 * - Regular text as paragraphs
 */
export function textToLexical(text: string): any {
  if (!text || typeof text !== 'string') {
    return {
      root: {
        type: 'root',
        children: [],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    }
  }

  // Split by newlines
  const lines = text.split('\n')

  const children: any[] = []
  let currentParagraph: string[] = []

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join(' ').trim()
      if (text) {
        children.push(createParagraph(text))
      }
      currentParagraph = []
    }
  }

  for (const line of lines) {
    const trimmedLine = line.trim()

    // Empty line - flush current paragraph
    if (!trimmedLine) {
      flushParagraph()
      continue
    }

    // Check for headings (# ## ### ####)
    const headingMatch = trimmedLine.match(/^(#{1,4})\s+(.+)$/)
    if (headingMatch) {
      flushParagraph()
      const level = headingMatch[1].length
      const headingText = headingMatch[2]
      children.push(createHeading(headingText, level as 1 | 2 | 3 | 4))
      continue
    }

    // Regular text - add to current paragraph
    currentParagraph.push(trimmedLine)
  }

  // Flush any remaining paragraph
  flushParagraph()

  return {
    root: {
      type: 'root',
      children:
        children.length > 0
          ? children
          : [
              {
                type: 'paragraph',
                children: [],
                direction: null,
                format: '',
                indent: 0,
                version: 1,
                textFormat: 0,
                textStyle: '',
              },
            ],
      direction: null,
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

function createParagraph(text: string): any {
  return {
    type: 'paragraph',
    children: [
      {
        detail: 0,
        format: 0,
        mode: 'normal',
        style: '',
        text: text,
        type: 'text',
        version: 1,
      },
    ],
    direction: null,
    format: '',
    indent: 0,
    version: 1,
    textFormat: 0,
    textStyle: '',
  }
}

function createHeading(text: string, level: 1 | 2 | 3 | 4): any {
  return {
    type: 'heading',
    tag: `h${level}`,
    children: [
      {
        detail: 0,
        format: 0,
        mode: 'normal',
        style: '',
        text: text,
        type: 'text',
        version: 1,
      },
    ],
    direction: null,
    format: 'start',
    indent: 0,
    version: 1,
  }
}
