/** Turn arbitrary text into a URL-safe slug. Falls back to "post" if empty. */
export function slugify(input: string): string {
  const base = input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // non-alphanumerics -> hyphen
    .replace(/-{2,}/g, "-") // collapse repeats
    .replace(/^-+|-+$/g, ""); // trim hyphens
  return base || "post";
}

/** Given a base slug and already-taken slugs, return a unique slug. */
export function uniqueSlug(base: string, taken: Iterable<string>): string {
  const set = new Set(taken);
  if (!set.has(base)) return base;
  let n = 2;
  while (set.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}
