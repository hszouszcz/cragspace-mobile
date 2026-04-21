import { Button } from '@/components/ui/button/button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { palette } from '@/src/theme';
import { svgLayerButtonStyles } from './SvgLayerButton.styles';

interface Props {
  isVisible: boolean;
  onPress: () => void;
}

export function SvgLayerButton({ isVisible, onPress }: Props) {
  return (
    <Button
      variant="icon"
      label={isVisible ? 'Hide route overlays' : 'Show route overlays'}
      onPress={onPress}
      style={svgLayerButtonStyles.button}
      leadingIcon={
        <IconSymbol
          name={isVisible ? 'eye' : 'eye.slash'}
          size={20}
          color={palette.white}
        />
      }
    />
  );
}
