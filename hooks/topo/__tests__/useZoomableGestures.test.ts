import { act, renderHook } from '@testing-library/react-native';
import { useZoomableGestures } from '../useZoomableGestures';

type MockGesture = {
  type: string;
  gestures?: MockGesture[];
  config: Record<string, unknown>;
  handlers: Record<string, (...args: unknown[]) => void>;
  onUpdate: (cb: (...args: unknown[]) => void) => MockGesture;
  onEnd: (cb: (...args: unknown[]) => void) => MockGesture;
  numberOfTaps: (value: number) => MockGesture;
  maxDuration: (value: number) => MockGesture;
  runOnJS: (value: boolean) => MockGesture;
};

const createGesture = (type: string): MockGesture => {
  const gesture: MockGesture = {
    type,
    config: {},
    handlers: {},
    onUpdate(cb) {
      this.handlers.onUpdate = cb;
      return this;
    },
    onEnd(cb) {
      this.handlers.onEnd = cb;
      return this;
    },
    numberOfTaps(value) {
      this.config.numberOfTaps = value;
      return this;
    },
    maxDuration(value) {
      this.config.maxDuration = value;
      return this;
    },
    runOnJS(value) {
      this.config.runOnJS = value;
      return this;
    },
  };

  return gesture;
};

jest.mock('react-native-reanimated', () => ({
  useSharedValue: (value: number) => ({ value }),
  withTiming: (value: number) => value,
  useAnimatedStyle: (factory: () => unknown) => factory,
}));

jest.mock('react-native-gesture-handler', () => ({
  Gesture: {
    Pinch: () => createGesture('Pinch'),
    Pan: () => createGesture('Pan'),
    Tap: () => createGesture('Tap'),
    Exclusive: (...gestures: MockGesture[]) => ({
      type: 'Exclusive',
      gestures,
      config: {},
      handlers: {},
    }),
    Simultaneous: (...gestures: MockGesture[]) => ({
      type: 'Simultaneous',
      gestures,
      config: {},
      handlers: {},
    }),
    Race: (...gestures: MockGesture[]) => ({
      type: 'Race',
      gestures,
      config: {},
      handlers: {},
    }),
  },
}));

const findTapGesture = (
  gesture: MockGesture,
  taps: number,
): MockGesture | null => {
  if (gesture.type === 'Tap' && gesture.config.numberOfTaps === taps) {
    return gesture;
  }

  if (!gesture.gestures) {
    return null;
  }

  for (const child of gesture.gestures) {
    const found = findTapGesture(child, taps);
    if (found) {
      return found;
    }
  }

  return null;
};

const findGestureByType = (
  gesture: MockGesture,
  type: string,
): MockGesture | null => {
  if (gesture.type === type) {
    return gesture;
  }

  if (!gesture.gestures) {
    return null;
  }

  for (const child of gesture.gestures) {
    const found = findGestureByType(child, type);
    if (found) {
      return found;
    }
  }

  return null;
};

const getTransformValues = (styleFactory: () => { transform: unknown }) => {
  const style = styleFactory();
  const transform = style.transform as Partial<{
    translateX: number;
    translateY: number;
    scale: number;
  }>[];

  return {
    translateX: transform.find((entry) => entry.translateX !== undefined)
      ?.translateX,
    translateY: transform.find((entry) => entry.translateY !== undefined)
      ?.translateY,
    scale: transform.find((entry) => entry.scale !== undefined)?.scale,
  };
};

describe('useZoomableGestures', () => {
  it('calls onSingleTap when the single tap ends', () => {
    const onSingleTap = jest.fn();
    const { result } = renderHook(() => useZoomableGestures({ onSingleTap }));

    const singleTap = findTapGesture(
      result.current.gesture as unknown as MockGesture,
      1,
    );
    expect(singleTap).not.toBeNull();

    act(() => {
      singleTap?.handlers.onEnd?.({});
    });

    expect(onSingleTap).toHaveBeenCalledTimes(1);
  });

  it('configures tap gestures with expected settings', () => {
    const { result } = renderHook(() => useZoomableGestures());

    const singleTap = findTapGesture(
      result.current.gesture as unknown as MockGesture,
      1,
    );
    const doubleTap = findTapGesture(
      result.current.gesture as unknown as MockGesture,
      2,
    );

    expect(singleTap?.config.maxDuration).toBe(250);
    expect(singleTap?.config.runOnJS).toBe(true);
    expect(doubleTap?.config.numberOfTaps).toBe(2);
  });

  it('updates scale on pinch and clamps to min scale', () => {
    const { result } = renderHook(() => useZoomableGestures());
    const pinch = findGestureByType(
      result.current.gesture as unknown as MockGesture,
      'Pinch',
    );
    const animatedStyle = result.current.animatedStyle as unknown as () => {
      transform: unknown;
    };

    expect(pinch).not.toBeNull();

    act(() => {
      pinch?.handlers.onUpdate?.({ scale: 2 });
    });

    expect(getTransformValues(animatedStyle).scale).toBe(2);

    act(() => {
      pinch?.handlers.onUpdate?.({ scale: 0.5 });
    });

    expect(getTransformValues(animatedStyle).scale).toBe(1);
  });

  it('pans only when scale is above minimum', () => {
    const { result } = renderHook(() => useZoomableGestures());
    const pinch = findGestureByType(
      result.current.gesture as unknown as MockGesture,
      'Pinch',
    );
    const pan = findGestureByType(
      result.current.gesture as unknown as MockGesture,
      'Pan',
    );
    const animatedStyle = result.current.animatedStyle as unknown as () => {
      transform: unknown;
    };

    expect(pan).not.toBeNull();
    expect(pinch).not.toBeNull();

    act(() => {
      pan?.handlers.onUpdate?.({ translationX: 12, translationY: -5 });
    });

    expect(getTransformValues(animatedStyle).translateX).toBe(0);
    expect(getTransformValues(animatedStyle).translateY).toBe(0);

    act(() => {
      pinch?.handlers.onUpdate?.({ scale: 2 });
      pinch?.handlers.onEnd?.({});
      pan?.handlers.onUpdate?.({ translationX: 12, translationY: -5 });
    });

    expect(getTransformValues(animatedStyle).translateX).toBe(12);
    expect(getTransformValues(animatedStyle).translateY).toBe(-5);
  });

  it('clamps pan translation to image bounds when zoomed', () => {
    const { result } = renderHook(() =>
      useZoomableGestures({
        containerWidth: 100,
        containerHeight: 100,
        contentWidth: 100,
        contentHeight: 100,
      }),
    );
    const pinch = findGestureByType(
      result.current.gesture as unknown as MockGesture,
      'Pinch',
    );
    const pan = findGestureByType(
      result.current.gesture as unknown as MockGesture,
      'Pan',
    );
    const animatedStyle = result.current.animatedStyle as unknown as () => {
      transform: unknown;
    };

    expect(pan).not.toBeNull();
    expect(pinch).not.toBeNull();

    act(() => {
      pinch?.handlers.onUpdate?.({ scale: 2 });
      pinch?.handlers.onEnd?.({});
      pan?.handlers.onUpdate?.({ translationX: 200, translationY: -200 });
    });

    expect(getTransformValues(animatedStyle).translateX).toBe(50);
    expect(getTransformValues(animatedStyle).translateY).toBe(-50);
  });
});
