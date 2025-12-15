/**
 * Calculate estimated reading time for content
 * @param content - Lexical JSON content or HTML string
 * @param wordsPerMinute - Average reading speed (default: 200 words per minute)
 * @returns Estimated reading time in minutes
 */
export function calculateReadingTime(content: any, wordsPerMinute: number = 200): number {
  if (!content) return 0;

  let text = '';

  // If content is a string (HTML), extract text
  if (typeof content === 'string') {
    text = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }
  // If content is Lexical JSON format
  else if (content.root && content.root.children) {
    text = extractTextFromLexical(content.root);
  }

  const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);

  return readingTime > 0 ? readingTime : 1;
}

/**
 * Extract plain text from Lexical JSON structure
 */
function extractTextFromLexical(node: any): string {
  let text = '';

  if (node.text) {
    text += node.text + ' ';
  }

  if (node.children && Array.isArray(node.children)) {
    for (const child of node.children) {
      text += extractTextFromLexical(child);
    }
  }

  return text;
}

/**
 * Format reading time for display in Swedish
 * @param minutes - Reading time in minutes
 * @returns Formatted string like "5 min" or "1 min"
 */
export function formatReadingTime(minutes: number): string {
  return `${minutes} min`;
}
