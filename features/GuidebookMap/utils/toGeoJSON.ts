import type {
  Feature,
  FeatureCollection,
  LineString,
  Point,
  Polygon,
} from 'geojson';

import type {
  GuidebookDetail,
  Parking,
  Region,
  Sector,
} from '@/services/guidebooks/types';

// ── Individual feature converters ─────────────────────────────────────────────

/**
 * Convert a Region's BoundingBox into a closed GeoJSON Polygon (rectangle).
 * ⚠️ GeoJSON coordinates are always [longitude, latitude] — NOT [lat, lng].
 */
export function regionToGeoJSON(region: Region): Feature<Polygon> {
  const { nw, se } = region.bounds;
  return {
    type: 'Feature',
    id: region.id,
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [nw.lng, nw.lat],
          [se.lng, nw.lat],
          [se.lng, se.lat],
          [nw.lng, se.lat],
          [nw.lng, nw.lat], // close the ring
        ],
      ],
    },
    properties: {
      regionId: region.id,
      name: region.name,
      sectorCount: region.sectorCount,
    },
  };
}

/**
 * Convert a Sector into a GeoJSON Point feature.
 * ⚠️ GeoJSON coordinates are always [longitude, latitude].
 */
export function sectorToGeoJSON(
  sector: Sector,
  regionId: string,
): Feature<Point> {
  return {
    type: 'Feature',
    id: sector.id,
    geometry: {
      type: 'Point',
      coordinates: [sector.coords.lng, sector.coords.lat],
    },
    properties: {
      sectorId: sector.id,
      regionId,
      name: sector.name,
      routeCount: sector.routeCount,
      approachMinutes: sector.approachMinutes,
      hasWalls: sector.walls.length > 0,
    },
  };
}

/**
 * Convert a Parking spot into a GeoJSON Point feature.
 * ⚠️ GeoJSON coordinates are always [longitude, latitude].
 */
export function parkingToGeoJSON(
  parking: Parking,
  sectorId: string,
): Feature<Point> {
  return {
    type: 'Feature',
    id: parking.id,
    geometry: {
      type: 'Point',
      coordinates: [parking.coords.lng, parking.coords.lat],
    },
    properties: {
      parkingId: parking.id,
      sectorId,
      label: parking.label,
      directions: parking.directions,
    },
  };
}

// ── Guidebook-level collection builders ───────────────────────────────────────

export interface GuidebookFeatureCollections {
  regions: FeatureCollection<Polygon>;
  sectors: FeatureCollection<Point>;
  parkings: FeatureCollection<Point>;
}

/**
 * Build all three FeatureCollections from a GuidebookDetail.
 * Parking spots shared across multiple sectors are de-duplicated by id.
 */
export function buildGuidebookFeatureCollections(
  detail: GuidebookDetail,
): GuidebookFeatureCollections {
  const regionFeatures: Feature<Polygon>[] =
    detail.regions.map(regionToGeoJSON);

  const sectorFeatures: Feature<Point>[] = detail.regions.flatMap((r) =>
    r.sectors.map((s) => sectorToGeoJSON(s, r.id)),
  );

  const seenParkingIds = new Set<string>();
  const parkingFeatures: Feature<Point>[] = detail.regions.flatMap((r) =>
    r.sectors.flatMap((s) =>
      s.parking
        .filter((p) => {
          if (seenParkingIds.has(p.id)) return false;
          seenParkingIds.add(p.id);
          return true;
        })
        .map((p) => parkingToGeoJSON(p, s.id)),
    ),
  );

  return {
    regions: { type: 'FeatureCollection', features: regionFeatures },
    sectors: { type: 'FeatureCollection', features: sectorFeatures },
    parkings: { type: 'FeatureCollection', features: parkingFeatures },
  };
}

/**
 * Compute the bounding box that encompasses all regions in a guidebook.
 * Returns ne/sw in [lng, lat] order as required by MapLibre Camera bounds.
 */
export function computeGuidebookBounds(detail: GuidebookDetail): {
  ne: [number, number];
  sw: [number, number];
} {
  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;

  for (const region of detail.regions) {
    minLat = Math.min(minLat, region.bounds.se.lat);
    maxLat = Math.max(maxLat, region.bounds.nw.lat);
    minLng = Math.min(minLng, region.bounds.nw.lng);
    maxLng = Math.max(maxLng, region.bounds.se.lng);
  }

  return {
    ne: [maxLng, maxLat],
    sw: [minLng, minLat],
  };
}

// ── Re-export unused LineString to keep import available for future paths ──────
export type { Feature, FeatureCollection, LineString, Point, Polygon };
