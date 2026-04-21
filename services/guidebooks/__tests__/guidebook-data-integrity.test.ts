import { JURA_POLNOCNA_DETAIL } from '../guidebook-detail-data';

describe('guidebook-detail-data integrity', () => {
  it('every sector coord falls within its region bounds', () => {
    for (const region of JURA_POLNOCNA_DETAIL.regions) {
      for (const sector of region.sectors) {
        const { nw, se } = region.bounds;
        // nw is north (higher lat), se is south (lower lat)
        expect(sector.coords.lat).toBeLessThanOrEqual(nw.lat);
        expect(sector.coords.lat).toBeGreaterThanOrEqual(se.lat);
        // nw.lng is western edge (lower lng), se.lng is eastern edge (higher lng)
        expect(sector.coords.lng).toBeGreaterThanOrEqual(nw.lng);
        expect(sector.coords.lng).toBeLessThanOrEqual(se.lng);
      }
    }
  });

  it('every parking coord is within ~5km of its sector', () => {
    // Rough bounding box: 0.045° lat ≈ 5km, 0.06° lng ≈ 5km at ~50°N latitude
    for (const region of JURA_POLNOCNA_DETAIL.regions) {
      for (const sector of region.sectors) {
        for (const parking of sector.parking) {
          expect(Math.abs(parking.coords.lat - sector.coords.lat)).toBeLessThan(
            0.045,
          );
          expect(Math.abs(parking.coords.lng - sector.coords.lng)).toBeLessThan(
            0.06,
          );
        }
      }
    }
  });

  it('every region has at least one sector with walls (for map navigation)', () => {
    for (const region of JURA_POLNOCNA_DETAIL.regions) {
      const hasWalls = region.sectors.some((s) => s.walls.length > 0);
      expect(hasWalls).toBe(true);
    }
  });

  it('region bounds nw corner is north-west of se corner', () => {
    for (const region of JURA_POLNOCNA_DETAIL.regions) {
      const { nw, se } = region.bounds;
      expect(nw.lat).toBeGreaterThan(se.lat);
      expect(nw.lng).toBeLessThan(se.lng);
    }
  });
});
