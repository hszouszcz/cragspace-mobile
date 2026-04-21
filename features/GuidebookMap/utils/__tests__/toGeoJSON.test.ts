import { JURA_POLNOCNA_DETAIL } from '@/services/guidebooks/guidebook-detail-data';
import type { Region, Sector, Parking } from '@/services/guidebooks/types';
import {
  buildGuidebookFeatureCollections,
  computeGuidebookBounds,
  parkingToGeoJSON,
  regionToGeoJSON,
  sectorToGeoJSON,
} from '../toGeoJSON';

// ── Fixtures ──────────────────────────────────────────────────────────────────

const REGION: Region = {
  id: 'rg1',
  name: 'Test Region',
  sectorCount: 1,
  description: null,
  sectors: [],
  bounds: {
    nw: { lat: 50.26, lng: 19.75 },
    se: { lat: 50.24, lng: 19.77 },
    center: { lat: 50.25, lng: 19.76 },
  },
};

const SECTOR: Sector = {
  id: 's1',
  name: 'Test Sector',
  routeCount: 5,
  routes: [],
  styles: ['sport'],
  approachMinutes: 10,
  sunExposure: null,
  coords: { lat: 50.249, lng: 19.763 },
  parking: [],
  walls: [],
};

const PARKING: Parking = {
  id: 'p1',
  label: 'Main Parking',
  coords: { lat: 50.248, lng: 19.761 },
  directions: 'Turn left at the junction.',
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('regionToGeoJSON', () => {
  it('produces a closed Polygon ring from BoundingBox', () => {
    const feature = regionToGeoJSON(REGION);
    expect(feature.type).toBe('Feature');
    expect(feature.geometry.type).toBe('Polygon');
    const ring = feature.geometry.coordinates[0];
    // Ring must close: first and last coordinate are equal
    expect(ring[0]).toEqual(ring[ring.length - 1]);
    // Must have 5 points (4 corners + closing point)
    expect(ring).toHaveLength(5);
  });

  it('uses [lng, lat] coordinate order — NOT [lat, lng]', () => {
    const feature = regionToGeoJSON(REGION);
    const ring = feature.geometry.coordinates[0];
    // nw corner is [nw.lng, nw.lat]
    expect(ring[0][0]).toBe(REGION.bounds.nw.lng); // longitude first
    expect(ring[0][1]).toBe(REGION.bounds.nw.lat); // latitude second
  });

  it('sets regionId and name in properties', () => {
    const feature = regionToGeoJSON(REGION);
    expect(feature.properties?.regionId).toBe('rg1');
    expect(feature.properties?.name).toBe('Test Region');
  });
});

describe('sectorToGeoJSON', () => {
  it('produces a Point feature', () => {
    const feature = sectorToGeoJSON(SECTOR, 'rg1');
    expect(feature.type).toBe('Feature');
    expect(feature.geometry.type).toBe('Point');
  });

  it('uses [lng, lat] coordinate order — NOT [lat, lng]', () => {
    const feature = sectorToGeoJSON(SECTOR, 'rg1');
    // This is the critical guard against lat/lng transposition
    expect(feature.geometry.coordinates[0]).toBe(SECTOR.coords.lng);
    expect(feature.geometry.coordinates[1]).toBe(SECTOR.coords.lat);
  });

  it('includes sectorId, regionId, routeCount in properties', () => {
    const feature = sectorToGeoJSON(SECTOR, 'rg1');
    expect(feature.properties?.sectorId).toBe('s1');
    expect(feature.properties?.regionId).toBe('rg1');
    expect(feature.properties?.routeCount).toBe(5);
  });
});

describe('parkingToGeoJSON', () => {
  it('uses [lng, lat] coordinate order — NOT [lat, lng]', () => {
    const feature = parkingToGeoJSON(PARKING, 's1');
    expect(feature.geometry.coordinates[0]).toBe(PARKING.coords.lng);
    expect(feature.geometry.coordinates[1]).toBe(PARKING.coords.lat);
  });

  it('includes parkingId and label in properties', () => {
    const feature = parkingToGeoJSON(PARKING, 's1');
    expect(feature.properties?.parkingId).toBe('p1');
    expect(feature.properties?.label).toBe('Main Parking');
  });
});

describe('buildGuidebookFeatureCollections', () => {
  it('de-duplicates shared parking spots', () => {
    const collections = buildGuidebookFeatureCollections(JURA_POLNOCNA_DETAIL);
    const parkingIds = collections.parkings.features.map(
      (f) => f.properties?.parkingId,
    );
    const uniqueIds = new Set(parkingIds);
    expect(parkingIds.length).toBe(uniqueIds.size);
  });

  it('produces one sector feature per sector across all regions', () => {
    const collections = buildGuidebookFeatureCollections(JURA_POLNOCNA_DETAIL);
    const totalSectors = JURA_POLNOCNA_DETAIL.regions.reduce(
      (sum, r) => sum + r.sectors.length,
      0,
    );
    expect(collections.sectors.features).toHaveLength(totalSectors);
  });

  it('produces one region feature per region', () => {
    const collections = buildGuidebookFeatureCollections(JURA_POLNOCNA_DETAIL);
    expect(collections.regions.features).toHaveLength(
      JURA_POLNOCNA_DETAIL.regions.length,
    );
  });
});

describe('computeGuidebookBounds', () => {
  it('returns ne with higher lat/lng than sw', () => {
    const { ne, sw } = computeGuidebookBounds(JURA_POLNOCNA_DETAIL);
    expect(ne[1]).toBeGreaterThan(sw[1]); // ne lat > sw lat
    expect(ne[0]).toBeGreaterThan(sw[0]); // ne lng > sw lng
  });

  it('returns [lng, lat] tuples (lng first)', () => {
    const { ne, sw } = computeGuidebookBounds(JURA_POLNOCNA_DETAIL);
    // For Jura Północna in Poland: lat ≈ 50.1–50.3, lng ≈ 19.5–19.84
    // If coordinates were swapped, lat would be ~19.x and lng ~50.x
    expect(ne[0]).toBeGreaterThan(19); // longitude (eastern Poland)
    expect(ne[0]).toBeLessThan(20);
    expect(ne[1]).toBeGreaterThan(50); // latitude
    expect(ne[1]).toBeLessThan(51);
  });
});
