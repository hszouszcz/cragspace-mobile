import { SvgPathConfig } from '@/services/topo/loadSvgPaths';
import type { StyleProp, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

type TopoOverlayPath = SvgPathConfig & {
  strokeWidth?: number;
};

type TopoSvgOverlayProps = {
  viewBox: string;
  width: number;
  height: number | string;
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
  width,
  height,
  paths,
  style,
  pressedPaths,
  onPathPress,
  onPathPressIn,
  onPathPressOut,
  defaultStrokeWidth,
}: TopoSvgOverlayProps) {
  return (
    <Svg width={width} height={height} viewBox={viewBox} style={style}>
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
            onPressIn={onPathPressIn ? () => onPathPressIn(path.id) : undefined}
            onPressOut={
              onPathPressOut ? () => onPathPressOut(path.id) : undefined
            }
          />
        );
      })}
    </Svg>
  );
}
