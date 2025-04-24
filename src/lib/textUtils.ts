/**
 * Cleans marker text like $2 from content
 */
export function cleanMarkers(text: string): string {
  return text.replace(/\$2\s*/g, "").trim();
}

/**
 * Calculates estimated reading time from text
 * @param text Content to calculate reading time for
 * @param wordsPerMinute Average reading speed (words per minute)
 * @returns Reading time in minutes
 */
export function calculateReadingTime(text: string, wordsPerMinute = 250): number {
  // Count words more accurately by splitting on whitespace
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / wordsPerMinute));
}

/**
 * Identify article structure (title, lead, body)
 */
export function identifyArticleStructure(content: string) {
  if (!content) return { title: "", lead: "", body: [] };
  
  const lines = content.split('\n').filter(line => line.trim() !== '');
  
  if (lines.length === 0) return { title: "", lead: "", body: [] };
  
  // First non-empty line is usually the title
  const title = lines[0];
  
  // Second non-empty line or paragraph is often the lead
  const lead = lines.length > 1 ? lines[1] : "";
  
  // Rest of the content forms the body
  const body = lines.slice(2);
  
  return { title, lead, body };
}
