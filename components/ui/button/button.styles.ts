import { StyleSheet } from 'react-native';
import {
  spacing,
  radii,
  sizes,
  shadows,
  type SemanticColors,
} from '@/src/theme';

export function createButtonStyles(colors: SemanticColors, isDark: boolean) {
  return StyleSheet.create({
    // Primary Button
    primaryContainer: {
      height: sizes.buttonLg,
      borderRadius: radii.full,
      backgroundColor: colors.brandPrimary,
      paddingHorizontal: spacing['2xl'],
      minWidth: 120,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: spacing.sm,
      ...(isDark ? shadows.none : shadows.sm),
    },
    primaryContainerPressed: {
      backgroundColor: colors.brandPrimaryPressed,
    },
    primaryContainerDisabled: {
      opacity: colors.disabledOpacity,
    },
    primaryLabel: {
      color: colors.textInverse,
    },

    // Secondary Button
    secondaryContainer: {
      height: sizes.buttonSm,
      borderRadius: radii.full,
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: colors.borderStrong,
      paddingHorizontal: spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: spacing.sm,
    },
    secondaryContainerPressed: {
      backgroundColor: colors.pressedOverlay,
    },
    secondaryContainerDisabled: {
      opacity: colors.disabledOpacity,
    },
    secondaryLabel: {
      color: colors.textPrimary,
    },

    // Destructive Button
    destructiveContainer: {
      height: sizes.buttonLg,
      borderRadius: radii.full,
      backgroundColor: colors.error,
      paddingHorizontal: spacing['2xl'],
      minWidth: 120,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: spacing.sm,
    },
    destructiveContainerPressed: {
      opacity: 0.85,
    },
    destructiveContainerDisabled: {
      opacity: colors.disabledOpacity,
    },
    destructiveLabel: {
      color: colors.textInverse,
    },

    // Text Button
    textContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: spacing.xs,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.xs,
    },
    textContainerDisabled: {
      opacity: colors.disabledOpacity,
    },
    textLabel: {
      color: colors.brandPrimary,
    },
    textLabelPressed: {
      color: colors.brandPrimaryPressed,
    },
  });
}
