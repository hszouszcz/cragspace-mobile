import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { createCollapsibleStyles } from './collapsible.styles';
import { Typography } from './typography/typography';
import { useThemeColors } from './use-theme-colors';

interface CollapsibleProps {
  /** Section title */
  title: string;
  /** Collapsible content */
  children: React.ReactNode;
}

export function Collapsible({ children, title }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const colors = useThemeColors();
  const styles = createCollapsibleStyles(colors);

  return (
    <View>
      <Pressable
        style={styles.heading}
        onPress={() => setIsOpen((value) => !value)}
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
      >
        <IconSymbol
          name="chevron.right"
          size={18}
          weight="medium"
          color={colors.iconPrimary}
          style={isOpen ? styles.chevronOpen : styles.chevronClosed}
        />
        <Typography variant="titleSm">{title}</Typography>
      </Pressable>
      {isOpen && <View style={styles.content}>{children}</View>}
    </View>
  );
}
