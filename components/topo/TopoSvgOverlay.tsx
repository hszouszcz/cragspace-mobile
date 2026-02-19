import { SvgPathConfig } from '@/features/TopoPreview/topo.types';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import Svg, { G, Path } from 'react-native-svg';

type TopoOverlayPath = SvgPathConfig & {
  strokeWidth?: number;
};

type TopoSvgOverlayProps = {
  viewBox: string;
  paths: TopoOverlayPath[];
  style?: StyleProp<ViewStyle>;
  pressedPaths?: Record<string, boolean>;
  selectedPathId?: string | null;
  dimOpacity?: number;
  ghostStroke?: string;
  ghostOpacity?: number;
  ghostStrokeWidthMultiplier?: number;
  onPathPress?: (pathId: string) => void;
  onPathPressIn?: (pathId: string) => void;
  onPathPressOut?: (pathId: string) => void;
  defaultStrokeWidth?: number;
};

export function TopoSvgOverlay({
  viewBox,
  paths,
  style,
  pressedPaths,
  selectedPathId,
  dimOpacity = 0.5,
  ghostStroke = '#000000',
  ghostOpacity = 0.25,
  ghostStrokeWidthMultiplier = 1.8,
  onPathPress,
  onPathPressIn,
  onPathPressOut,
  defaultStrokeWidth,
}: TopoSvgOverlayProps) {
  return (
    <Animated.View style={style}>
      <Svg
        width="100%"
        height="100%"
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid slice"
      >
        {paths.map((path) => {
          const strokeWidth = path.strokeWidth ?? defaultStrokeWidth ?? 1;
          const stroke = pressedPaths?.[path.id] ? '#ff0000' : path.color;
          const isSelected = selectedPathId === path.id;
          const isDimmed = Boolean(selectedPathId) && !isSelected;
          const strokeOpacity = isDimmed ? dimOpacity : 1;

          return (
            <G key={path.id}>
              {isSelected ? (
                <Path
                  d={path.d}
                  stroke={ghostStroke}
                  strokeWidth={strokeWidth * ghostStrokeWidthMultiplier}
                  strokeOpacity={ghostOpacity}
                  fill="none"
                />
              ) : null}
              <Path
                d={path.d}
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeOpacity={strokeOpacity}
                fill="none"
                onPress={onPathPress ? () => onPathPress(path.id) : undefined}
                onPressIn={
                  onPathPressIn ? () => onPathPressIn(path.id) : undefined
                }
                onPressOut={
                  onPathPressOut ? () => onPathPressOut(path.id) : undefined
                }
              />
            </G>
          );
        })}
      </Svg>
    </Animated.View>
  );
}
