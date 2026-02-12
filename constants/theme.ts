/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
export const PRIMARY_COLOR = '#f94f06';

export type TopoColorTokens = {
  sheetBackground: string;
  sheetBorder: string;
  handle: string;
  headerTitle: string;
  headerSubtitle: string;
  rowBase: string;
  rowBackground: string;
  rowBorder: string;
  rowMuted: string;
  rowMutedBorder: string;
  rowPressed: string;
  badgeBackground: string;
  badgeText: string;
  badgeMutedBackground: string;
  badgeMutedText: string;
  gradeBackground: string;
  gradeText: string;
  chevron: string;
  starEmpty: string;
  textPrimary: string;
  textMuted: string;
  filterBackground: string;
};

export const getTopoColorTokens = (
  scheme: 'light' | 'dark',
): TopoColorTokens => {
  if (scheme === 'dark') {
    return {
      sheetBackground: '#23150f',
      sheetBorder: '#2d1c15',
      handle: '#40302a',
      headerTitle: '#f9fafb',
      headerSubtitle: PRIMARY_COLOR,
      rowBase: 'rgba(35, 21, 15, 0.4)',
      rowBackground: 'rgba(40, 26, 20, 0.6)',
      rowBorder: 'rgba(64, 48, 42, 0.7)',
      rowMuted: 'rgba(35, 21, 15, 0.6)',
      rowMutedBorder: 'rgba(64, 48, 42, 0.45)',
      rowPressed: 'rgba(60, 40, 32, 0.6)',
      badgeBackground: PRIMARY_COLOR,
      badgeText: '#ffffff',
      badgeMutedBackground: '#2f221c',
      badgeMutedText: '#a8a29e',
      gradeBackground: '#3b2a22',
      gradeText: '#f9fafb',
      chevron: '#a8a29e',
      starEmpty: '#4b3b35',
      textPrimary: '#f9fafb',
      textMuted: '#a8a29e',
      filterBackground: 'rgba(249, 79, 6, 0.12)',
    };
  }

  return {
    sheetBackground: '#ffffff',
    sheetBorder: '#f1f5f9',
    handle: '#e2e8f0',
    headerTitle: '#0f172a',
    headerSubtitle: PRIMARY_COLOR,
    rowBase: '#ffffff',
    rowBackground: '#f8fafc',
    rowBorder: 'rgba(249, 79, 6, 0.2)',
    rowMuted: '#ffffff',
    rowMutedBorder: '#f1f5f9',
    rowPressed: '#f1f5f9',
    badgeBackground: PRIMARY_COLOR,
    badgeText: '#ffffff',
    badgeMutedBackground: '#f1f5f9',
    badgeMutedText: '#64748b',
    gradeBackground: '#e2e8f0',
    gradeText: '#0f172a',
    chevron: '#94a3b8',
    starEmpty: '#e2e8f0',
    textPrimary: '#0f172a',
    textMuted: '#64748b',
    filterBackground: 'rgba(249, 79, 6, 0.1)',
  };
};
