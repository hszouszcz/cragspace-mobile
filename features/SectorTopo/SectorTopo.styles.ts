import { spacing } from '@/src/theme';
import { StyleSheet, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

export const sectorTopoStyles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  pagerWrapper: {
    flex: 1,
    overflow: 'hidden',
  },
  pagerTrack: {
    flex: 1,
    flexDirection: 'row',
  },
  wallSlot: {
    width: SCREEN_WIDTH,
    flexShrink: 0,
  },
  overlayControls: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    gap: spacing.sm,
  },
});
