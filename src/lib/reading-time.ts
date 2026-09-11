export function countWords(markdown: string): number {
  const stripped = markdown.replace(/```[\s\S]*?```/g, "").trim();
  return stripped ? stripped.split(/\s+/).length : 0;
}

export function estimateReadingTime(markdown: string): number {
  return Math.max(1, Math.round(countWords(markdown) / 220));
}
