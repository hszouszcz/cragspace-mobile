import { BackButton } from '@/components/ui/back-button/BackButton';
import { useThemeColors } from '@/components/ui/use-theme-colors';
import { sizes, spacing, typeScale } from '@/src/theme';
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
          backgroundColor: colors.backgroundPrimary,
          borderBottomColor: colors.separator,
          zIndex: 10,
          elevation: 10,
        },
      ]}
    >
      <View style={styles.row}>
        <View style={styles.side}>
          {back ? <BackButton onPress={() => router.back()} /> : null}
        </View>

        <Text
          accessibilityRole="header"
          style={[styles.title, { color: colors.textPrimary }]}
          numberOfLines={1}
        >
          {title}
        </Text>

        <View style={[styles.side, styles.sideRight]}>
          {options.headerRight?.({ canGoBack: !!back })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: sizes.minTapTarget,
    paddingHorizontal: spacing.lg,
  },
  side: {
    flex: 1,
  },
  sideRight: {
    alignItems: 'flex-end',
  },
  title: {
    flex: 2,
    textAlign: 'center',
    ...typeScale.headlineSm,
  },
});
