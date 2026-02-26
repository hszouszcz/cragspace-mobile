import { spacing, type Spacing } from '@/src/theme';
import { StyleSheet, type FlexStyle } from 'react-native';

type SpacingKey = keyof Spacing;

/**
 * Resolve a gap value from a spacing token key or raw number.
 */
function resolveGap(gap: SpacingKey | number | undefined): number | undefined {
  if (gap === undefined) return undefined;
  if (typeof gap === 'number') return gap;
  return spacing[gap];
}

export interface StackStyleOptions {
  gap?: SpacingKey | number;
  padding?: SpacingKey | number;
  paddingHorizontal?: SpacingKey | number;
  paddingVertical?: SpacingKey | number;
  align?: FlexStyle['alignItems'];
  justify?: FlexStyle['justifyContent'];
  wrap?: boolean;
  flex?: number;
  direction: 'row' | 'column';
}

export function createStackStyles(options: StackStyleOptions) {
  const {
    gap,
    padding,
    paddingHorizontal,
    paddingVertical,
    align,
    justify,
    wrap,
    flex,
    direction,
  } = options;

  return StyleSheet.create({
    container: {
      flexDirection: direction,
      ...(resolveGap(gap) !== undefined && { gap: resolveGap(gap) }),
      ...(resolveGap(padding) !== undefined && {
        padding: resolveGap(padding),
      }),
      ...(resolveGap(paddingHorizontal) !== undefined && {
        paddingHorizontal: resolveGap(paddingHorizontal),
      }),
      ...(resolveGap(paddingVertical) !== undefined && {
        paddingVertical: resolveGap(paddingVertical),
      }),
      ...(align && { alignItems: align }),
      ...(justify && { justifyContent: justify }),
      ...(wrap && { flexWrap: 'wrap' }),
      ...(flex !== undefined && { flex }),
    },
  });
}
