import { GeoJSONSource, Layer } from '@maplibre/maplibre-react-native';
import type { NativeSyntheticEvent } from 'react-native';
import type { FeatureCollection, Point , Feature } from 'geojson';
import type { PressEventWithFeatures } from '@maplibre/maplibre-react-native/src/types/PressEventWithFeatures';

interface SectorLayerProps {
  collection: FeatureCollection<Point>;
  onPress: (feature: Feature) => void;
}

/**
 * Renders sector pins as orange circles with route count badges.
 * Sectors without walls get a slightly lighter fill (not navigable).
 *
 * Touch area: transparent outer circle (radius 22) gives a 44pt+ hit target.
 */
export function SectorLayer({ collection, onPress }: SectorLayerProps) {
  const handlePress = (e: NativeSyntheticEvent<PressEventWithFeatures>) => {
    const feature = e.nativeEvent.features[0];
    if (feature) onPress(feature);
  };

  return (
    <GeoJSONSource id="sectors" data={collection} onPress={handlePress}>
      {/* Transparent hit area to meet 44pt minimum touch target */}
      <Layer
        id="sectors-hit-area"
        type="circle"
        source="sectors"
        paint={{
          'circle-radius': 22,
          'circle-color': 'rgba(0,0,0,0)',
          'circle-opacity': 0,
        }}
      />
      {/* Visible orange circle */}
      <Layer
        id="sectors-circle"
        type="circle"
        source="sectors"
        paint={{
          'circle-radius': 14,
          'circle-color': [
            'case',
            ['==', ['get', 'hasWalls'], true],
            '#f27f0d',
            'rgba(242,127,13,0.65)',
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        }}
      />
      {/* Route count label */}
      <Layer
        id="sectors-label"
        type="symbol"
        source="sectors"
        layout={{
          'text-field': ['to-string', ['get', 'routeCount']],
          'text-size': 11,
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
