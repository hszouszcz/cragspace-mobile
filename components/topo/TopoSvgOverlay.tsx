import { SvgPathConfig } from '@/features/TopoPreview/topo.types';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

type TopoOverlayPath = SvgPathConfig & {
  strokeWidth?: number;
};

type TopoSvgOverlayProps = {
  viewBox: string;
  paths: TopoOverlayPath[];
  style?: StyleProp<ViewStyle>;
  pressedPaths?: Record<string, boolean>;
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

          return (
            <Path
              key={path.id}
              d={path.d}
              stroke={stroke}
              strokeWidth={strokeWidth}
              fill="none"
              onPress={onPathPress ? () => onPathPress(path.id) : undefined}
              onPressIn={
                onPathPressIn ? () => onPathPressIn(path.id) : undefined
              }
              onPressOut={
                onPathPressOut ? () => onPathPressOut(path.id) : undefined
              }
            />
          );
        })}
      </Svg>
    </Animated.View>
  );
}
