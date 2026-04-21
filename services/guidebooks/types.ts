export const CLIMBING_STYLE = {
  sport: 'sport',
  trad: 'trad',
  bouldering: 'bouldering',
  alpine: 'alpine',
  ice: 'ice',
  mixed: 'mixed',
  viaFerrata: 'via-ferrata',
} as const;

export type ClimbingStyle =
  (typeof CLIMBING_STYLE)[keyof typeof CLIMBING_STYLE];

export interface Guidebook {
  id: string;
  title: string;
  country: string;
  region: string;
  publisher: string | null;
  pricePln: string;
  coverImageUrl: string;
  productUrl: string | null;
  climbingStyles: ClimbingStyle[];
}

// ── Guidebook Detail types ─────────────────────────────────────────────────────

/**
 * Kurtyki grading system — used in Polish climbing guidebooks.
 * Maps to UIAA grades and French grades per the standard conversion table.
 *
 * GRADE_BAND groups grades into broad difficulty bands for filtering UI:
 *   beginner     → I – IV+     (UIAA I – IV+,    French 1 – 4c)
 *   intermediate → V- – VI+    (UIAA V- – VI+,   French 5a – 6a+)
 *   advanced     → VI.1 – VI.2+(UIAA VII- – VIII-,French 6b – 6c+)
 *   expert       → VI.3 – VI.4+(UIAA VIII – IX,  French 7a – 7c)
 *   elite        → VI.5 – VI.7 (UIAA IX+ – XI,   French 7c+ – 9a)
 */
export const GRADE_BAND = {
  beginner: 'beginner',
  intermediate: 'intermediate',
  advanced: 'advanced',
  expert: 'expert',
  elite: 'elite',
} as const;

export type GradeBand = (typeof GRADE_BAND)[keyof typeof GRADE_BAND];

/**
 * All valid Kurtyki grades in ascending order.
 * Use this for grade pickers, sorting, and band classification.
 */
export const KURTYKI_GRADES = [
  'I',
  'II',
  'III',
  'IV',
  'IV+',
  'V-',
  'V',
  'V+',
  'VI-',
  'VI',
  'VI+',
  'VI.1',
  'VI.1+',
  'VI.2',
  'VI.2+',
  'VI.3',
  'VI.3+',
  'VI.4',
  'VI.4+',
  'VI.5',
  'VI.5+',
  'VI.6',
  'VI.6+',
  'VI.7',
] as const;

export type KurtykaGrade = (typeof KURTYKI_GRADES)[number];

/** Classify a Kurtyki grade string into a broad difficulty band. */
export function getGradeBand(grade: KurtykaGrade): GradeBand {
  const idx = KURTYKI_GRADES.indexOf(grade);
  if (idx <= 4) return GRADE_BAND.beginner; // I – IV+
  if (idx <= 10) return GRADE_BAND.intermediate; // V- – VI+
  if (idx <= 13) return GRADE_BAND.advanced; // VI.1 – VI.2+
  if (idx <= 17) return GRADE_BAND.expert; // VI.3 – VI.4+
  return GRADE_BAND.elite; // VI.5 – VI.7
}

// ── Coordinates ───────────────────────────────────────────────────────────────

export interface LatLng {
  lat: number;
  lng: number;
}

/**
 * Bounding box for a region (the general climbing area, not a single point).
 * Used to frame map views at region level.
 */
export interface BoundingBox {
  /** North-west corner */
  nw: LatLng;
  /** South-east corner */
  se: LatLng;
  /** Approximate center — used for map initial viewport */
  center: LatLng;
}

// ── Route ─────────────────────────────────────────────────────────────────────

export interface Route {
  id: string;
  name: string;
  grade: KurtykaGrade;
  gradeBand: GradeBand;
  style: ClimbingStyle;
  /** Length in meters */
  lengthM: number | null;
  /** Number of bolts (sport routes) */
  bolts: number | null;
}

// ── Wall ──────────────────────────────────────────────────────────────────────

export interface Wall {
  id: string;
  name: string;
  /** Cardinal facing direction, e.g. "N", "SE", "SW" */
  facing: string | null;
  /** require()'d topo photo asset — React Native image source number */
  imageAsset: number;
  /** require()'d SVG route paths asset — React Native asset source number */
  svgAsset: number;
  /** Routes visible on this wall (subset of the parent sector's routes) */
  routes: Route[];
}

// ── Parking ───────────────────────────────────────────────────────────────────

export interface Parking {
  id: string;
  label: string;
  coords: LatLng;
  /** Free-text directions from parking to crag */
  directions: string | null;
}

// ── Sector ────────────────────────────────────────────────────────────────────

export interface Sector {
  id: string;
  name: string;
  routeCount: number;
  routes: Route[];
  styles: ClimbingStyle[];
  /** Walk-in time from parking in minutes */
  approachMinutes: number | null;
  /** Human-readable sun exposure description, e.g. "Sun from 12:00", "Mostly Shady" */
  sunExposure: string | null;
  /** GPS coordinates of the crag/sector itself */
  coords: LatLng;
  /** Parking spot(s) serving this sector */
  parking: Parking[];
  /** Topo walls that make up this sector, each with its own photo and route overlays */
  walls: Wall[];
}

// ── Region ────────────────────────────────────────────────────────────────────

export interface Region {
  id: string;
  name: string;
  sectorCount: number;
  sectors: Sector[];
  description: string | null;
  /** Geographic bounds of the region — used for map framing */
  bounds: BoundingBox;
}

// ── Metadata ─────────────────────────────────────────────────────────────────

export interface MetadataSection {
  id: string;
  title: string;
  content: string;
}

export interface GuidebookMetadata {
  author: string;
  edition: string;
  year: number;
  isbn: string | null;
  sections: MetadataSection[];
}

// ── Guidebook Detail ──────────────────────────────────────────────────────────

export interface GuidebookDetail {
  id: string;
  title: string;
  coverImageUrl: string;
  color: string;
  location: string;
  publisher: string | null;
  totalRoutes: number;
  totalSectors: number;
  /** Human-readable grade range, e.g. "III – VI.4+" */
  gradeRange: string;
  styles: ClimbingStyle[];
  regions: Region[];
  metadata: GuidebookMetadata;
}
