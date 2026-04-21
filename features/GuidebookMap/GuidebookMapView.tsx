import { Camera, Map, UserLocation } from '@maplibre/maplibre-react-native';
import type { CameraRef } from '@maplibre/maplibre-react-native';
import { StyleSheet, View } from 'react-native';

import { useCurrentScheme } from '@/components/ui/use-theme-colors';
import type { GuidebookDetail } from '@/services/guidebooks/types';

import { ParkingLayer } from './components/ParkingLayer';
import { RegionLayer } from './components/RegionLayer';
import { SectorLayer } from './components/SectorLayer';
import { SectorCallout } from './components/SectorCallout';
import { ParkingCallout } from './components/ParkingCallout';
import { CenterOnMeFAB } from './components/CenterOnMeFAB';
import { MapDownloadBanner } from './components/MapDownloadBanner';
import { useGuidebookCamera } from './hooks/useGuidebookCamera';
import { useMapSelection } from './hooks/useMapSelection';
import { useOfflinePack } from './hooks/useOfflinePack';
import { useUserLocation } from './hooks/useUserLocation';
import {
  buildGuidebookFeatureCollections,
  computeGuidebookBounds,
} from './utils/toGeoJSON';

// OpenFreeMap tile styles — free, no API key required
// Only "liberty" style is available; use it for both light and dark
const STYLE_LIGHT = 'https://tiles.openfreemap.org/styles/liberty';
const STYLE_DARK = 'https://tiles.openfreemap.org/styles/liberty';

interface GuidebookMapViewProps {
  detail: GuidebookDetail;
  onSectorPress: (sectorId: string) => void;
}

export function GuidebookMapView({
  detail,
  onSectorPress,
}: GuidebookMapViewProps) {
  const scheme = useCurrentScheme();
  const styleURL = scheme === 'dark' ? STYLE_DARK : STYLE_LIGHT;

  const collections = buildGuidebookFeatureCollections(detail);
  const guidebookBounds = computeGuidebookBounds(detail);

  const { cameraRef, bounds } = useGuidebookCamera(detail.regions);
  const {
    selection,
    selectSector,
    selectParking,
    clearSelection,
    sectorCalloutRef,
    parkingCalloutRef,
  } = useMapSelection();
  const { status, progress, startDownload } = useOfflinePack(
    detail,
    guidebookBounds,
    styleURL,
  );
  const { locationStatus, coords, requestPermission } = useUserLocation();

  const handleCenterOnMe = () => {
    if (!coords) return;
    (cameraRef as React.RefObject<CameraRef>).current?.easeTo({
      center: [coords.lng, coords.lat],
      zoom: 15,
      duration: 500,
    });
  };

  return (
    <View style={styles.container}>
      <Map style={styles.map} mapStyle={styleURL} touchPitch={false} compass>
        <Camera
          ref={cameraRef}
          initialViewState={{
            bounds,
            padding: { top: 40, right: 40, bottom: 40, left: 40 },
          }}
        />

        {/* Layer order: regions (bottom) → sectors → parkings → user location (top) */}
        <RegionLayer
          collection={collections.regions}
          selectedRegionId={selection?.type === 'sector' ? null : null}
          onRegionPress={() => {}}
        />
        <SectorLayer collection={collections.sectors} onPress={selectSector} />
        <ParkingLayer
          collection={collections.parkings}
          onPress={selectParking}
        />

        {locationStatus === 'granted' && <UserLocation visible animated />}
      </Map>

      <CenterOnMeFAB
        locationStatus={locationStatus}
        onRequestPermission={requestPermission}
        onCenter={handleCenterOnMe}
      />
      <MapDownloadBanner
        status={status}
        progress={progress}
        onDownload={startDownload}
      />

      <SectorCallout
        ref={sectorCalloutRef}
        selection={selection}
        onNavigate={onSectorPress}
        onClose={clearSelection}
      />
      <ParkingCallout
        ref={parkingCalloutRef}
        selection={selection}
        onClose={clearSelection}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
