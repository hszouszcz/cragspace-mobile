import { useThemeColors } from '@/components/ui/use-theme-colors';
import type { GradeRange } from '@/services/guidebooks/guidebook-detail-search';
import { KURTYKI_GRADES, type KurtykaGrade } from '@/services/guidebooks/types';
import { radii, shadows, sizes, spacing, typeScale } from '@/src/theme';
import { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
// Grades shown as tick labels on the track (sparse to avoid crowding)
const TICK_GRADES: KurtykaGrade[] = [
  'I',
  'II',
  'IV+',
  'V+',
  'VI',
  'VI.1',
  'VI.2',
  'VI.3',
  'VI.4',
  'VI.5',
  'VI.7',
];

const TOTAL = KURTYKI_GRADES.length - 1;
const THUMB_HIT = sizes.minTapTarget;
const THUMB_VISIBLE = 20;

interface GradeRangeSliderProps {
  range: GradeRange;
  onRangeChange: (range: GradeRange) => void;
}

function gradeToFraction(grade: KurtykaGrade): number {
  return KURTYKI_GRADES.indexOf(grade) / TOTAL;
}

function fractionToGradeIndex(fraction: number): number {
  return Math.round(Math.max(0, Math.min(1, fraction)) * TOTAL);
}

export function GradeRangeSlider({
  range,
  onRangeChange,
}: GradeRangeSliderProps) {
  const colors = useThemeColors();
  const trackWidth = useSharedValue(0);

  const leftFraction = useSharedValue(gradeToFraction(range.min));
  const rightFraction = useSharedValue(gradeToFraction(range.max));

  // Committed grade indices — updated only on gesture end (UI thread).
  // Two separate reactions (one per thumb) so only one fires per drag,
  // avoiding double onRangeChange calls per gesture.
  const committedLeftIdx = useSharedValue(KURTYKI_GRADES.indexOf(range.min));
  const committedRightIdx = useSharedValue(KURTYKI_GRADES.indexOf(range.max));

  // Stable callback via ref. The worklet captures callOnRangeChange (first-render
  // closure), which closes over onRangeChangeRef — a stable object across renders.
  // When scheduleOnRN calls it on the JS thread, .current is always fresh.
  const onRangeChangeRef = useRef(onRangeChange);
  onRangeChangeRef.current = onRangeChange;

  const callOnRangeChange = (gradeRange: GradeRange) => {
    onRangeChangeRef.current(gradeRange);
  };

  useAnimatedReaction(
    () => committedLeftIdx.value,
    (current, previous) => {
      if (previous === null) return;
      scheduleOnRN(callOnRangeChange, {
        min: KURTYKI_GRADES[current],
        max: KURTYKI_GRADES[committedRightIdx.value],
      });
    },
  );

  useAnimatedReaction(
    () => committedRightIdx.value,
    (current, previous) => {
      if (previous === null) return;
      scheduleOnRN(callOnRangeChange, {
        min: KURTYKI_GRADES[committedLeftIdx.value],
        max: KURTYKI_GRADES[current],
      });
    },
  );

  // Sync external range prop changes to display shared values.
  // Must live in useEffect — writing .value during render is forbidden in
  // Reanimated v4 with Fabric (new architecture).
  useEffect(() => {
    const newLeft = gradeToFraction(range.min);
    const newRight = gradeToFraction(range.max);
    if (Math.abs(leftFraction.value - newLeft) > 0.001) {
      leftFraction.value = newLeft;
    }
    if (Math.abs(rightFraction.value - newRight) > 0.001) {
      rightFraction.value = newRight;
    }
    // leftFraction/rightFraction are useSharedValue refs — stable across renders,
    // safe to omit from deps without triggering unnecessary re-runs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range.min, range.max]);

  // ── Left thumb gesture ─────────────────────────────────────────────────────

  const leftStartFraction = useSharedValue(0);

  const leftGesture = Gesture.Pan()
    .activeOffsetX([-10, 10]) // Only activate for horizontal movement ≥ 10px
    .failOffsetY([-5, 5]) // Yield to the BottomSheet on vertical movement ≥ 5px
    .onStart(() => {
      leftStartFraction.value = leftFraction.value;
    })
    .onUpdate((e) => {
      if (trackWidth.value === 0) return;
      const delta = e.translationX / trackWidth.value;
      leftFraction.value = Math.max(
        0,
        Math.min(leftStartFraction.value + delta, rightFraction.value),
      );
    })
    .onEnd(() => {
      const snappedIdx = fractionToGradeIndex(leftFraction.value);
      leftFraction.value = snappedIdx / TOTAL;
      // Only write the left committed value — right is unchanged, reaction fires once
      committedLeftIdx.value = snappedIdx;
    });

  // ── Right thumb gesture ────────────────────────────────────────────────────

  const rightStartFraction = useSharedValue(0);

  const rightGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-5, 5])
    .onStart(() => {
      rightStartFraction.value = rightFraction.value;
    })
    .onUpdate((e) => {
      if (trackWidth.value === 0) return;
      const delta = e.translationX / trackWidth.value;
      rightFraction.value = Math.max(
        leftFraction.value,
        Math.min(rightStartFraction.value + delta, 1),
      );
    })
    .onEnd(() => {
      const snappedIdx = fractionToGradeIndex(rightFraction.value);
      rightFraction.value = snappedIdx / TOTAL;
      // Only write the right committed value — left is unchanged, reaction fires once
      committedRightIdx.value = snappedIdx;
    });

  // ── Animated styles ────────────────────────────────────────────────────────

  const filledTrackStyle = useAnimatedStyle(() => ({
    left: `${leftFraction.value * 100}%`,
    right: `${(1 - rightFraction.value) * 100}%`,
  }));

  const leftThumbStyle = useAnimatedStyle(() => ({
    left: `${leftFraction.value * 100}%`,
  }));

  const rightThumbStyle = useAnimatedStyle(() => ({
    left: `${rightFraction.value * 100}%`,
  }));

  // ── Accessibility action handlers (run on JS thread, safe to call directly) ─

  const handleLeftIncrement = () => {
    const currentIdx = KURTYKI_GRADES.indexOf(range.min);
    const rightIdx = KURTYKI_GRADES.indexOf(range.max);
    const newIdx = Math.min(currentIdx + 1, rightIdx);
    leftFraction.value = newIdx / TOTAL;
    onRangeChangeRef.current({ min: KURTYKI_GRADES[newIdx], max: range.max });
  };

  const handleLeftDecrement = () => {
    const currentIdx = KURTYKI_GRADES.indexOf(range.min);
    const newIdx = Math.max(currentIdx - 1, 0);
    leftFraction.value = newIdx / TOTAL;
    onRangeChangeRef.current({ min: KURTYKI_GRADES[newIdx], max: range.max });
  };

  const handleRightIncrement = () => {
    const currentIdx = KURTYKI_GRADES.indexOf(range.max);
    const newIdx = Math.min(currentIdx + 1, TOTAL);
    rightFraction.value = newIdx / TOTAL;
    onRangeChangeRef.current({ min: range.min, max: KURTYKI_GRADES[newIdx] });
  };

  const handleRightDecrement = () => {
    const currentIdx = KURTYKI_GRADES.indexOf(range.max);
    const leftIdx = KURTYKI_GRADES.indexOf(range.min);
    const newIdx = Math.max(currentIdx - 1, leftIdx);
    rightFraction.value = newIdx / TOTAL;
    onRangeChangeRef.current({ min: range.min, max: KURTYKI_GRADES[newIdx] });
  };

  return (
    <View style={styles.container}>
      {/* Range label */}
      <Text style={[styles.rangeLabel, { color: colors.brandPrimary }]}>
        {range.min === range.max ? range.min : `${range.min} – ${range.max}`}
      </Text>

      {/* Track + thumbs */}
      <View
        style={styles.trackWrapper}
        onLayout={(e) => {
          trackWidth.value = e.nativeEvent.layout.width;
        }}
      >
        {/* Base track */}
        <View
          style={[styles.track, { backgroundColor: colors.backgroundTertiary }]}
        />

        {/* Filled segment between thumbs */}
        <Animated.View
          style={[
            styles.filledTrack,
            filledTrackStyle,
            { backgroundColor: colors.brandPrimary },
          ]}
        />

        {/* Left thumb */}
        <GestureDetector gesture={leftGesture}>
          <Animated.View
            style={[styles.thumbHitArea, leftThumbStyle]}
            accessible
            accessibilityRole="adjustable"
            accessibilityLabel="Minimum grade"
            accessibilityValue={{ text: range.min }}
            accessibilityActions={[
              { name: 'increment', label: 'Increase minimum grade' },
              { name: 'decrement', label: 'Decrease minimum grade' },
            ]}
            onAccessibilityAction={(event) => {
              if (event.nativeEvent.actionName === 'increment') {
                handleLeftIncrement();
              } else if (event.nativeEvent.actionName === 'decrement') {
                handleLeftDecrement();
              }
            }}
          >
            <View
              style={[
                styles.thumb,
                {
                  backgroundColor: colors.brandPrimary,
                  ...shadows.md,
                  shadowColor: colors.shadowColor,
                },
              ]}
            />
          </Animated.View>
        </GestureDetector>

        {/* Right thumb */}
        <GestureDetector gesture={rightGesture}>
          <Animated.View
            style={[styles.thumbHitArea, rightThumbStyle]}
            accessible
            accessibilityRole="adjustable"
            accessibilityLabel="Maximum grade"
            accessibilityValue={{ text: range.max }}
            accessibilityActions={[
              { name: 'increment', label: 'Increase maximum grade' },
              { name: 'decrement', label: 'Decrease maximum grade' },
            ]}
            onAccessibilityAction={(event) => {
              if (event.nativeEvent.actionName === 'increment') {
                handleRightIncrement();
              } else if (event.nativeEvent.actionName === 'decrement') {
                handleRightDecrement();
              }
            }}
          >
            <View
              style={[
                styles.thumb,
                {
                  backgroundColor: colors.brandPrimary,
                  ...shadows.md,
                  shadowColor: colors.shadowColor,
                },
              ]}
            />
          </Animated.View>
        </GestureDetector>
      </View>

      {/* Tick labels */}
      <View style={styles.ticks}>
        {TICK_GRADES.map((grade) => {
          const pct = gradeToFraction(grade) * 100;
          return (
            <Text
              key={grade}
              style={[
                styles.tickLabel,
                { color: colors.textTertiary, left: `${pct}%` },
              ]}
            >
              {grade}
            </Text>
          );
        })}
      </View>
    </View>
  );
}

const TRACK_HEIGHT = 4;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['2xl'],
  },
  rangeLabel: {
    ...typeScale.labelSm,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  trackWrapper: {
    height: THUMB_HIT,
    justifyContent: 'center',
    position: 'relative',
  },
  track: {
    height: TRACK_HEIGHT,
    borderRadius: radii.full,
    position: 'absolute',
    left: 0,
    right: 0,
  },
  filledTrack: {
    height: TRACK_HEIGHT,
    borderRadius: radii.full,
    position: 'absolute',
  },
  thumbHitArea: {
    position: 'absolute',
    width: THUMB_HIT,
    height: THUMB_HIT,
    marginLeft: -(THUMB_HIT / 2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumb: {
    width: THUMB_VISIBLE,
    height: THUMB_VISIBLE,
    borderRadius: THUMB_VISIBLE / 2,
  },
  ticks: {
    height: 20,
    position: 'relative',
    marginTop: spacing.xs,
  },
  tickLabel: {
    ...typeScale.captionSm,
    position: 'absolute',
    transform: [{ translateX: -12 }],
  },
});
