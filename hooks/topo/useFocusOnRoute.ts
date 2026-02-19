import type { RouteConfig } from '@/features/TopoPreview/topo.types';
import type { SharedValue } from 'react-native-reanimated';
import type { ViewBoxValues } from './useViewBoxValues';

type UseFocusOnRouteParams = {
  viewBoxValues: ViewBoxValues | null;
  containerSize: SharedValue<{ width: number; height: number }>;
  contentSize: SharedValue<{ width: number; height: number }>;
  animatedIndexSharedValue: SharedValue<number>;
  setTransform: (params: {
    scale: number;
    translateX: number;
    translateY: number;
    animate?: boolean;
  }) => void;
};

export const useFocusOnRoute = ({
  viewBoxValues,
  containerSize,
  contentSize,
  animatedIndexSharedValue,
  setTransform,
}: UseFocusOnRouteParams) => {
  return (route: RouteConfig) => {
    if (!route.bounds || !viewBoxValues) {
      return;
    }
    if (animatedIndexSharedValue.value !== 1) {
      return;
    }
    const container = containerSize.value;
    const content = contentSize.value;
    if (!container || !content) {
      return;
    }

    const { minX, minY, width, height } = viewBoxValues;
    const baseScale = Math.max(content.width / width, content.height / height);

    const boundsWidth = (route.bounds.maxX - route.bounds.minX) * baseScale;
    const boundsHeight = (route.bounds.maxY - route.bounds.minY) * baseScale;
    const margin = 0.14;
    const availableWidth = container.width * (1 - margin * 2);
    const availableHeight = container.height * (1 - margin * 2);
    const scaleForWidth = availableWidth / boundsWidth;
    const scaleForHeight = availableHeight / boundsHeight;
    const targetScale = Math.min(scaleForWidth, scaleForHeight, 3);
    const clampedScale = Math.max(1, targetScale);

    const centerX = (route.bounds.minX + route.bounds.maxX) / 2;
    const centerY = (route.bounds.minY + route.bounds.maxY) / 2;
    const offsetX = (content.width - width * baseScale) / 2;
    const offsetY = (content.height - height * baseScale) / 2;
    const contentCenterX = (centerX - minX) * baseScale + offsetX;
    const contentCenterY = (centerY - minY) * baseScale + offsetY;
    const translateX = -(contentCenterX - content.width / 2) * clampedScale;
    const translateY = -(contentCenterY - content.height / 2) * clampedScale;

    setTransform({
      scale: clampedScale,
      translateX,
      translateY,
      animate: true,
    });
  };
};
