import { palette, radii, sizes, spacing, typeScale } from '@/src/theme';
import { StyleSheet } from 'react-native';

export const fullscreenViewerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.black,
  },
  pagerWrapper: {
    flex: 1,
    overflow: 'hidden',
  },
  pagerTrack: {
    flex: 1,
    flexDirection: 'row',
  },
  closeButton: {
    position: 'absolute',
    top: spacing.xl,
    right: spacing.xl,
    width: sizes.minTapTarget,
    height: sizes.minTapTarget,
    borderRadius: radii.full,
    backgroundColor: palette.blackAlpha55,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  wallNameContainer: {
    position: 'absolute',
    top: spacing.xl,
    left: spacing.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
    backgroundColor: palette.blackAlpha55,
    zIndex: 10,
    maxWidth: '60%',
  },
  wallNameText: {
    ...typeScale.titleSm,
    color: palette.white,
  },
  dotIndicatorContainer: {
    position: 'absolute',
    bottom: spacing.xl,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
});
