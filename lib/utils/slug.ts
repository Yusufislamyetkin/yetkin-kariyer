/**
 * Convert module ID to URL-friendly slug
 * Example: module-01-csharp -> csharp
 */
export function moduleIdToSlug(moduleId: string): string {
  const parts = moduleId.split('-');
  if (parts.length >= 3) {
    return parts.slice(2).join('-');
  }
  return moduleId.replace(/^module-\d+-/, '').toLowerCase();
}

/**
 * Convert lesson label to URL-friendly slug
 * Example: "C# Nedir?" -> "csharpnedir"
 */
export function lessonLabelToSlug(label: string): string {
  return label
    .toLowerCase()
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ş/g, 's')
    .replace(/ü/g, 'u')
    .replace(/[^a-z0-9]+/g, '')
    .trim();
}

/**
 * Convert lesson href to slug
 * Example: "/education/lessons/csharp/basics/syntax" -> "csharp-basics-syntax"
 */
export function lessonHrefToSlug(href: string): string {
  return href
    .replace(/^\/education\/lessons\//, '')
    .replace(/\//g, '-')
    .toLowerCase();
}

/**
 * Convert slug back to lesson href
 * Example: "csharp-basics-syntax" -> "/education/lessons/csharp/basics/syntax"
 */
export function slugToLessonHref(slug: string): string {
  return `/education/lessons/${slug.replace(/-/g, '/')}`;
}

