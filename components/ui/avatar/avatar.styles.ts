import { StyleSheet } from 'react-native';
import { radii, sizes, type SemanticColors } from '@/src/theme';

const avatarSizeMap = {
  xs: sizes.avatarXs,
  sm: sizes.avatarSm,
  md: sizes.avatarMd,
  lg: sizes.avatarLg,
  xl: sizes.avatarXl,
  hero: sizes.avatarHero,
} as const;

export type AvatarSize = keyof typeof avatarSizeMap;

export function getAvatarDimension(size: AvatarSize): number {
  return avatarSizeMap[size];
}

export function createAvatarStyles(colors: SemanticColors) {
  return StyleSheet.create({
    container: {
      borderRadius: radii.full,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
    },
    placeholder: {
      backgroundColor: colors.backgroundTertiary,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    border: {
      borderWidth: 2,
      borderColor: colors.backgroundElevated,
    },
  });
}
