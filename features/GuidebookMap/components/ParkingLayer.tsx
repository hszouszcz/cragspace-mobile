import { GeoJSONSource, Layer } from '@maplibre/maplibre-react-native';
import type { NativeSyntheticEvent } from 'react-native';
import type { FeatureCollection, Point , Feature } from 'geojson';
import type { PressEventWithFeatures } from '@maplibre/maplibre-react-native/src/types/PressEventWithFeatures';

interface ParkingLayerProps {
  collection: FeatureCollection<Point>;
  onPress: (feature: Feature) => void;
}

/**
 * Renders parking spots as blue circles with "P" labels.
 * Touch area is 44pt+ via a transparent outer circle.
 */
export function ParkingLayer({ collection, onPress }: ParkingLayerProps) {
  const handlePress = (e: NativeSyntheticEvent<PressEventWithFeatures>) => {
    const feature = e.nativeEvent.features[0];
    if (feature) onPress(feature);
  };

  return (
    <GeoJSONSource id="parkings" data={collection} onPress={handlePress}>
      {/* Transparent hit area — 44pt minimum touch target */}
      <Layer
        id="parkings-hit-area"
        type="circle"
        source="parkings"
        paint={{
          'circle-radius': 22,
          'circle-color': 'rgba(0,0,0,0)',
          'circle-opacity': 0,
        }}
      />
      {/* Visible blue circle */}
      <Layer
        id="parkings-circle"
        type="circle"
        source="parkings"
        paint={{
          'circle-radius': 12,
          'circle-color': '#007AFF',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        }}
      />
      {/* "P" label */}
      <Layer
        id="parkings-label"
        type="symbol"
        source="parkings"
        layout={{
          'text-field': 'P',
          'text-size': 12,
          'text-font': ['Noto Sans Bold'],
          'text-allow-overlap': true,
          'text-ignore-placement': true,
        }}
        paint={{
          'text-color': '#ffffff',
        }}
      />
    </GeoJSONSource>
  );
}
