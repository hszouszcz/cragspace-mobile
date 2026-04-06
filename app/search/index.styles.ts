import { sizes, spacing } from '@/src/theme';
import { StyleSheet } from 'react-native';

export const SEARCH_INPUT_HEIGHT = sizes.inputHeight + spacing.sm * 2;

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  stickyHeader: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  searchInputWrapper: {
    paddingVertical: spacing.sm,
    overflow: 'hidden',
  },
  scrollContent: {
    paddingBottom: spacing['6xl'],
  },
  infoCardsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  bottomSpacer: {
    height: spacing['3xl'],
  },
});
