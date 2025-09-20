export function extractHashtags(text: string): string[] {
  const matches = text.match(/#[\w-]+/g);
  return matches || []; 
}