// Swedish month names
const swedishMonths = [
  'januari', 'februari', 'mars', 'april', 'maj', 'juni',
  'juli', 'augusti', 'september', 'oktober', 'november', 'december'
];

/**
 * Format a date to Swedish format (e.g., "11 juni 2025")
 */
export function formatSwedishDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = swedishMonths[date.getMonth()];
  const year = date.getFullYear();
  
  // Use lowercase month name for Swedish dates
  return `${day} ${month} ${year}`;
}

/**
 * Format a date with author info (e.g., "11 december, 2025 av Redaktionen på Bilråd.se")
 */
export function formatSwedishDateWithAuthor(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = swedishMonths[date.getMonth()];
  const year = date.getFullYear();
  
  return `${day} ${month}, ${year}`;
}

/**
 * Determine if should show "last updated" instead of published date
 * Shows "last updated" if the post was modified more than 24 hours after publishing
 */
export function shouldShowUpdated(publishedDate: string, modifiedDate: string): boolean {
  const published = new Date(publishedDate);
  const modified = new Date(modifiedDate);
  
  // Calculate difference in hours
  const diffInHours = (modified.getTime() - published.getTime()) / (1000 * 60 * 60);
  
  // Show "updated" if modified more than 24 hours after publishing
  return diffInHours > 24;
}

/**
 * Get formatted date string with proper label
 */
export function getArticleDateDisplay(publishedDate: string, modifiedDate?: string): string {
  if (!modifiedDate || !shouldShowUpdated(publishedDate, modifiedDate)) {
    return formatSwedishDate(publishedDate);
  }
  
  return `Uppdaterad: ${formatSwedishDate(modifiedDate)}`;
}
