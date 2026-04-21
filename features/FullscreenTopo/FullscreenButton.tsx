import { Button } from '@/components/ui/button/button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { palette } from '@/src/theme';
import { fullscreenButtonStyles } from './FullscreenButton.styles';

interface Props {
  onPress: () => void;
}

export function FullscreenButton({ onPress }: Props) {
  return (
    <Button
      variant="icon"
      label="Open fullscreen topo viewer"
      onPress={onPress}
      style={fullscreenButtonStyles.button}
      leadingIcon={
        <IconSymbol
          name="arrow.up.left.and.arrow.down.right"
          size={20}
          color={palette.white}
        />
      }
    />
  );
}
