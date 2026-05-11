import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, radius, sizing, spacing, typography } from '../theme';

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export function Chip({ label, selected = false, onPress }: Props) {
  const Container = onPress ? Pressable : Text;

  if (onPress) {
    return (
      <Container
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [
          styles.chip,
          selected && styles.selected,
          pressed && styles.pressed,
        ]}>
        <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
      </Container>
    );
  }

  return <Text style={[styles.chip, styles.label, selected && styles.selectedLabel]}>{label}</Text>;
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderRadius: radius.pill,
    borderWidth: 1,
    color: colors.muted,
    minHeight: sizing.chipHeight,
    overflow: 'hidden',
    paddingHorizontal: 13,
    paddingVertical: 7,
  },
  label: {
    color: colors.muted,
    ...typography.button,
  },
  pressed: {
    opacity: 0.7,
  },
  selected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  selectedLabel: {
    color: colors.surface,
  },
});
