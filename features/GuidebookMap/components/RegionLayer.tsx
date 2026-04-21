import { GeoJSONSource, Layer } from '@maplibre/maplibre-react-native';
import type { NativeSyntheticEvent } from 'react-native';
import type { FeatureCollection, Polygon } from 'geojson';
import type { PressEventWithFeatures } from '@maplibre/maplibre-react-native/src/types/PressEventWithFeatures';

interface RegionLayerProps {
  collection: FeatureCollection<Polygon>;
  selectedRegionId: string | null;
  onRegionPress: (regionId: string, name: string) => void;
}

/**
 * Renders climbing region boundaries as semi-transparent orange rectangles.
 * Selected region gets a darker fill and solid outline.
 */
export function RegionLayer({
  collection,
  selectedRegionId,
  onRegionPress,
}: RegionLayerProps) {
  const handlePress = (e: NativeSyntheticEvent<PressEventWithFeatures>) => {
    const feature = e.nativeEvent.features[0];
    if (!feature?.properties) return;
    onRegionPress(
      feature.properties.regionId as string,
      feature.properties.name as string,
    );
  };

  const isSelected =
    selectedRegionId !== null
      ? (['==', ['get', 'regionId'], selectedRegionId] as const)
      : false;

  return (
    <GeoJSONSource id="regions" data={collection} onPress={handlePress}>
      <Layer
        id="regions-fill"
        type="fill"
        source="regions"
        paint={{
          'fill-color': isSelected
            ? [
                'case',
                isSelected,
                'rgba(242,127,13,0.20)',
                'rgba(242,127,13,0.07)',
              ]
            : 'rgba(242,127,13,0.07)',
        }}
      />
      <Layer
        id="regions-outline"
        type="line"
        source="regions"
        paint={{
          'line-color': isSelected
            ? ['case', isSelected, '#f27f0d', 'rgba(242,127,13,0.45)']
            : 'rgba(242,127,13,0.45)',
          'line-width': isSelected ? ['case', isSelected, 2, 1] : 1,
          'line-dasharray': [4, 3],
        }}
      />
    </GeoJSONSource>
  );
}
