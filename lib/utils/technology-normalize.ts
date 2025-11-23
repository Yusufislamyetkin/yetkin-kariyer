/**
 * Teknoloji adını normalize eder - route ve veritabanı karşılaştırmaları için
 * Örnek: ".NET Core" -> "net core", "React" -> "react"
 */
export function normalizeTechnologyName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Özel karakterleri kaldır
    .replace(/\s+/g, ' ') // Birden fazla boşluğu tek boşluğa çevir
    .trim();
}

/**
 * Teknoloji adını route formatına çevirir
 * Örnek: ".NET Core" -> "tests-net-core"
 */
export function technologyToRoute(technologyName: string): string {
  const normalized = normalizeTechnologyName(technologyName);
  return `tests-${normalized.replace(/\s+/g, '-')}`;
}

/**
 * Route'tan teknoloji adını çıkarır
 * Örnek: "tests-net-core" -> "net core"
 */
export function routeToTechnology(route: string): string {
  return route.replace(/^tests-/i, '').replace(/-/g, ' ');
}

/**
 * İki teknoloji adını karşılaştırır (normalize edilmiş haliyle)
 */
export function compareTechnologyNames(name1: string, name2: string): boolean {
  return normalizeTechnologyName(name1) === normalizeTechnologyName(name2);
}

