import { normalizeText } from './search';
import {
  KURTYKI_GRADES,
  type GuidebookDetail,
  type KurtykaGrade,
  type Region,
  type Route,
  type Sector,
} from './types';

// ── Result types ──────────────────────────────────────────────────────────────

export type GuidebookSearchResult =
  | { type: 'region'; region: Region; score: number }
  | {
      type: 'sector';
      sector: Sector;
      regionId: string;
      regionName: string;
      score: number;
    }
  | {
      type: 'route';
      route: Route;
      sectorId: string;
      sectorName: string;
      regionId: string;
      regionName: string;
      score: number;
    };

// ── Filter types ──────────────────────────────────────────────────────────────

export interface GradeRange {
  min: KurtykaGrade;
  max: KurtykaGrade;
}

export interface GuidebookDetailFilters {
  /** Active style filter value. 'all' means no style filter. */
  style: string;
  /**
   * Grade range. null means no grade filter (show all grades).
   * Routes are included if their grade index falls within [min, max].
   */
  gradeRange: GradeRange | null;
}

/** Default filter state — no restrictions. */
export const DEFAULT_FILTERS: GuidebookDetailFilters = {
  style: 'all',
  gradeRange: null,
};

// ── Score weights ─────────────────────────────────────────────────────────────

const SCORE = {
  regionExact: 100,
  regionStartsWith: 80,
  regionContains: 60,
  sectorExact: 90,
  sectorStartsWith: 70,
  sectorContains: 50,
  routeExact: 85,
  routeStartsWith: 65,
  routeContains: 45,
  gradeExact: 30,
} as const;

// ── Helpers ───────────────────────────────────────────────────────────────────

function scoreString(normalized: string, query: string): number {
  if (normalized === query) return 3;
  if (normalized.startsWith(query)) return 2;
  if (normalized.includes(query)) return 1;
  return 0;
}

function isStyleActive(style: string): boolean {
  return style !== 'all';
}

function isGradeActive(gradeRange: GradeRange | null): boolean {
  if (gradeRange === null) return false;
  const minIdx = KURTYKI_GRADES.indexOf(gradeRange.min);
  const maxIdx = KURTYKI_GRADES.indexOf(gradeRange.max);
  // Active if the range is not the full spectrum
  return minIdx !== 0 || maxIdx !== KURTYKI_GRADES.length - 1;
}

function routePassesFilters(
  route: Route,
  filters: GuidebookDetailFilters,
): boolean {
  if (isStyleActive(filters.style)) {
    if (route.style !== filters.style) return false;
  }
  if (isGradeActive(filters.gradeRange)) {
    const gradeRange = filters.gradeRange!;
    const routeIdx = KURTYKI_GRADES.indexOf(route.grade);
    const minIdx = KURTYKI_GRADES.indexOf(gradeRange.min);
    const maxIdx = KURTYKI_GRADES.indexOf(gradeRange.max);
    if (routeIdx < minIdx || routeIdx > maxIdx) return false;
  }
  return true;
}

function hasActiveFilters(filters: GuidebookDetailFilters): boolean {
  return isStyleActive(filters.style) || isGradeActive(filters.gradeRange);
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Filter the guidebook's regions/sectors to only include those containing
 * routes that match the active style/grade filters.
 *
 * Returns a new tree of Region → Sector → Route with filtered contents.
 * Regions/sectors with zero matching routes are excluded.
 */
export function filterGuidebookRegions(
  detail: GuidebookDetail,
  filters: GuidebookDetailFilters,
): Region[] {
  if (!hasActiveFilters(filters)) return detail.regions;

  const filtered: Region[] = [];

  for (const region of detail.regions) {
    const filteredSectors: Sector[] = [];

    for (const sector of region.sectors) {
      const filteredRoutes = sector.routes.filter((r) =>
        routePassesFilters(r, filters),
      );
      if (filteredRoutes.length > 0) {
        filteredSectors.push({
          ...sector,
          routes: filteredRoutes,
          routeCount: filteredRoutes.length,
        });
      }
    }

    if (filteredSectors.length > 0) {
      filtered.push({
        ...region,
        sectors: filteredSectors,
        sectorCount: filteredSectors.length,
      });
    }
  }

  return filtered;
}

/**
 * Full-text fuzzy search within a guidebook, optionally AND-ed with filters.
 *
 * Searches across region names, sector names, route names, and grades.
 * Results are returned as a flat ranked list.
 */
export function searchGuidebookContent(
  detail: GuidebookDetail,
  query: string,
  filters: GuidebookDetailFilters,
): GuidebookSearchResult[] {
  const trimmed = query.trim();

  if (!trimmed) return [];

  const q = normalizeText(trimmed);
  const filtersActive = hasActiveFilters(filters);
  const results: GuidebookSearchResult[] = [];

  for (const region of detail.regions) {
    const regionNorm = normalizeText(region.name);
    const regionMatch = scoreString(regionNorm, q);

    if (regionMatch > 0) {
      results.push({
        type: 'region',
        region,
        score:
          regionMatch === 3
            ? SCORE.regionExact
            : regionMatch === 2
              ? SCORE.regionStartsWith
              : SCORE.regionContains,
      });
    }

    for (const sector of region.sectors) {
      const filteredRoutes = sector.routes.filter((r) =>
        routePassesFilters(r, filters),
      );

      if (filteredRoutes.length === 0 && filtersActive) continue;

      const sectorNorm = normalizeText(sector.name);
      const sectorMatch = scoreString(sectorNorm, q);

      if (sectorMatch > 0) {
        results.push({
          type: 'sector',
          sector,
          regionId: region.id,
          regionName: region.name,
          score:
            sectorMatch === 3
              ? SCORE.sectorExact
              : sectorMatch === 2
                ? SCORE.sectorStartsWith
                : SCORE.sectorContains,
        });
      }

      for (const route of filteredRoutes) {
        const routeNorm = normalizeText(route.name);
        const routeMatch = scoreString(routeNorm, q);
        const gradeMatch =
          normalizeText(route.grade) === q ? SCORE.gradeExact : 0;

        const score =
          routeMatch > 0
            ? routeMatch === 3
              ? SCORE.routeExact
              : routeMatch === 2
                ? SCORE.routeStartsWith
                : SCORE.routeContains
            : gradeMatch;

        if (score > 0) {
          results.push({
            type: 'route',
            route,
            sectorId: sector.id,
            sectorName: sector.name,
            regionId: region.id,
            regionName: region.name,
            score,
          });
        }
      }
    }
  }

  return results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const nameA =
      a.type === 'region'
        ? a.region.name
        : a.type === 'sector'
          ? a.sector.name
          : a.route.name;
    const nameB =
      b.type === 'region'
        ? b.region.name
        : b.type === 'sector'
          ? b.sector.name
          : b.route.name;
    return nameA.localeCompare(nameB, 'pl');
  });
}

/** Compute filtered totals for the stats bar. */
export function computeFilteredStats(regions: Region[]): {
  routes: number;
  sectors: number;
  regions: number;
} {
  let routes = 0;
  let sectors = 0;
  for (const region of regions) {
    sectors += region.sectorCount;
    for (const sector of region.sectors) {
      routes += sector.routeCount;
    }
  }
  return { routes, sectors, regions: regions.length };
}
