import BottomSheet from '@gorhom/bottom-sheet';
import type { Feature } from 'geojson';
import { useRef, useState } from 'react';

type SectorSelection = {
  type: 'sector';
  sectorId: string;
  name: string;
  routeCount: number;
  approachMinutes: number | null;
  hasWalls: boolean;
};

type ParkingSelection = {
  type: 'parking';
  parkingId: string;
  label: string;
  directions: string | null;
};

export type MapSelection = SectorSelection | ParkingSelection | null;

interface UseMapSelectionResult {
  selection: MapSelection;
  selectSector: (feature: Feature) => void;
  selectParking: (feature: Feature) => void;
  clearSelection: () => void;
  sectorCalloutRef: React.RefObject<BottomSheet>;
  parkingCalloutRef: React.RefObject<BottomSheet>;
}

export function useMapSelection(): UseMapSelectionResult {
  const [selection, setSelection] = useState<MapSelection>(null);
  const sectorCalloutRef = useRef<BottomSheet>(null);
  const parkingCalloutRef = useRef<BottomSheet>(null);

  const selectSector = (feature: Feature) => {
    const props = feature.properties ?? {};
    setSelection({
      type: 'sector',
      sectorId: props.sectorId as string,
      name: props.name as string,
      routeCount: props.routeCount as number,
      approachMinutes: props.approachMinutes as number | null,
      hasWalls: props.hasWalls as boolean,
    });
    parkingCalloutRef.current?.close();
    sectorCalloutRef.current?.expand();
  };

  const selectParking = (feature: Feature) => {
    const props = feature.properties ?? {};
    setSelection({
      type: 'parking',
      parkingId: props.parkingId as string,
      label: props.label as string,
      directions: props.directions as string | null,
    });
    sectorCalloutRef.current?.close();
    parkingCalloutRef.current?.expand();
  };

  const clearSelection = () => {
    setSelection(null);
    sectorCalloutRef.current?.close();
    parkingCalloutRef.current?.close();
  };

  return {
    selection,
    selectSector,
    selectParking,
    clearSelection,
    sectorCalloutRef,
    parkingCalloutRef,
  };
}
