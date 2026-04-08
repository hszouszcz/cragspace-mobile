import { Card, Typography, useThemeColors } from '@/components/ui';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { sizes, spacing } from '@/src/theme';
import { ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';

interface InfoCardProps {
  icon: ComponentProps<typeof IconSymbol>['name'];
  title: string;
  subtitle: string;
}

export function InfoCard({ icon, title, subtitle }: InfoCardProps) {
  const colors = useThemeColors();
  return (
    <Card style={styles.card}>
      <View style={styles.iconWrapper}>
        <IconSymbol name={icon} size={sizes.iconLg} color={colors.iconBrand} />
      </View>
      <Typography variant="labelLg">{title}</Typography>
      <Typography variant="captionLg" color="secondary">
        {subtitle}
      </Typography>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
  },
  iconWrapper: {
    marginBottom: spacing.sm,
  },
});
