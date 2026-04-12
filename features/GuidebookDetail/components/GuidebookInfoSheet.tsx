import { useThemeColors } from '@/components/ui/use-theme-colors';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { radii, spacing, typeScale } from '@/src/theme';
import { forwardRef, useCallback, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { GuidebookMetadata } from '@/services/guidebooks/types';
import { MetadataSection } from './MetadataSection';

interface GuidebookInfoSheetProps {
  metadata: GuidebookMetadata;
  onClose: () => void;
}

export const GuidebookInfoSheet = forwardRef<
  BottomSheet,
  GuidebookInfoSheetProps
>(function GuidebookInfoSheet({ metadata, onClose }, ref) {
  const colors = useThemeColors();
  const snapPoints = useMemo(() => ['40%', '90%'], []);

  const handleChange = useCallback(
    (index: number) => {
      if (index === -1) onClose();
    },
    [onClose],
  );

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    [],
  );

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onChange={handleChange}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colors.surfaceSheet }}
      handleIndicatorStyle={{ backgroundColor: colors.iconTertiary }}
      style={styles.sheet}
    >
      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Peek header — visible at first snap point */}
        <View style={styles.peekHeader}>
          <Text style={[styles.sheetTitle, { color: colors.textPrimary }]}>
            About This Guidebook
          </Text>
          <Text style={[styles.sheetMeta, { color: colors.textSecondary }]}>
            {metadata.author} · {metadata.edition} · {metadata.year}
          </Text>
          {metadata.isbn != null && (
            <Text style={[styles.isbn, { color: colors.textTertiary }]}>
              ISBN {metadata.isbn}
            </Text>
          )}
        </View>

        <View
          style={[
            styles.separator,
            { backgroundColor: colors.separatorOpaque },
          ]}
        />

        {metadata.sections.map((section, index) => (
          <View key={section.id}>
            <MetadataSection title={section.title} content={section.content} />
            {index < metadata.sections.length - 1 && (
              <View
                style={[
                  styles.sectionSeparator,
                  { backgroundColor: colors.separatorOpaque },
                ]}
              />
            )}
          </View>
        ))}

        <View style={styles.bottomPadding} />
      </BottomSheetScrollView>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  sheet: {
    borderTopLeftRadius: radii['2xl'],
    borderTopRightRadius: radii['2xl'],
  },
  scrollContent: {
    paddingBottom: spacing['4xl'],
  },
  peekHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  sheetTitle: {
    ...typeScale.headlineSm,
    marginBottom: spacing.xs,
  },
  sheetMeta: {
    ...typeScale.bodyLg,
  },
  isbn: {
    ...typeScale.captionLg,
    marginTop: spacing.xxs,
  },
  separator: {
    height: 8,
    marginBottom: spacing.xs,
  },
  sectionSeparator: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: spacing.lg,
  },
  bottomPadding: {
    height: spacing['3xl'],
  },
});
