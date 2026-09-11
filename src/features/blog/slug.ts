/** "The scan gate that finally blocked a bad merge" -> "the-scan-gate-that-finally-blocked-a-bad-merge" */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
