import { useThemeColors } from '@/components/ui/use-theme-colors';
import { spacing, typeScale } from '@/src/theme';
import { StyleSheet, Text, View } from 'react-native';

interface MetadataSectionProps {
  title: string;
  content: string;
}

export function MetadataSection({ title, content }: MetadataSectionProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      <Text style={[styles.content, { color: colors.textSecondary }]}>
        {content}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  title: {
    ...typeScale.titleLg,
    marginBottom: spacing.sm,
  },
  content: {
    ...typeScale.bodyLg,
    lineHeight: 24,
  },
});
