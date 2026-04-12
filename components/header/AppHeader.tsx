import { BackButton } from '@/components/ui/back-button/BackButton';
import { useThemeColors } from '@/components/ui/use-theme-colors';
import { shadows, sizes, spacing, typeScale } from '@/src/theme';
import { Route } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AppHeaderProps {
  back?: { title: string | undefined } | undefined;
  options: NativeStackNavigationOptions;
  route: Route<string>;
}

export default function AppHeader({ back, options, route }: AppHeaderProps) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const title = typeof options.title === 'string' ? options.title : route.name;

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          backgroundColor: colors.surfaceCard,
          shadowColor: colors.shadowColor,
        },
      ]}
    >
      <View style={styles.row}>
        <View style={styles.leftSection}>
          {back ? <BackButton onPress={() => router.back()} /> : null}
        </View>

        <Text
          accessibilityRole="header"
          style={[styles.title, { color: colors.textPrimary }]}
          numberOfLines={1}
        >
          {title}
        </Text>

        <View style={styles.rightSection}>
          {options.headerRight?.({ canGoBack: !!back })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 10,
    ...shadows.sm,
    elevation: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: sizes.minTapTarget,
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
  },
  leftSection: {
    width: sizes.minTapTarget,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: -spacing.sm,
  },
  title: {
    flex: 1,
    ...typeScale.headlineSm,
  },
  rightSection: {
    width: sizes.minTapTarget,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight: -spacing.sm,
  },
});
