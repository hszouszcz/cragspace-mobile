import { Separator } from '@/components/ui/separator/separator';
import { useThemeColors } from '@/components/ui/use-theme-colors';
import { MetadataSection } from '@/features/GuidebookDetail/components/MetadataSection';
import { GUIDEBOOK_DETAILS } from '@/services/guidebooks/guidebook-detail-data';
import { spacing, typeScale } from '@/src/theme';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GuidebookInfoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useThemeColors();
  const router = useRouter();
  const detail = GUIDEBOOK_DETAILS[id ?? ''];

  if (!detail) {
    router.back();
    return null;
  }

  const { metadata } = detail;

  return (
    <>
      <Stack.Screen options={{ title: 'About This Guidebook' }} />
      <SafeAreaView
        edges={['left', 'right', 'bottom']}
        style={[styles.screen, { backgroundColor: colors.backgroundPrimary }]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <Text style={[styles.meta, { color: colors.textSecondary }]}>
              {metadata.author} · {metadata.edition} · {metadata.year}
            </Text>
            {metadata.isbn != null && (
              <Text style={[styles.isbn, { color: colors.textTertiary }]}>
                ISBN {metadata.isbn}
              </Text>
            )}
          </View>

          <Separator variant="section" style={styles.sectionBreak} />

          {metadata.sections.map((section, index) => (
            <View key={section.id}>
              <MetadataSection
                title={section.title}
                content={section.content}
              />
              {index < metadata.sections.length - 1 && (
                <Separator variant="opaque" style={styles.sectionDivider} />
              )}
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing['4xl'],
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  meta: {
    ...typeScale.bodyLg,
  },
  isbn: {
    ...typeScale.captionLg,
    marginTop: spacing.xxs,
  },
  sectionBreak: {
    marginBottom: spacing.xs,
  },
  sectionDivider: {
    marginHorizontal: spacing.lg,
  },
});
