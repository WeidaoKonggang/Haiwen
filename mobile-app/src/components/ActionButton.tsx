import FontAwesome from '@expo/vector-icons/FontAwesome';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, sizing, spacing, typography } from '../theme';

type Props = {
  label: string;
  icon?: ComponentProps<typeof FontAwesome>['name'];
  variant?: 'primary' | 'secondary' | 'ghost' | 'text';
  disabled?: boolean;
  onPress: () => void;
};

export function ActionButton({ label, icon, variant = 'secondary', disabled = false, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}>
      <View style={styles.content}>
        {icon ? (
          <FontAwesome
            name={icon}
            size={15}
            color={variant === 'primary' ? colors.surface : colors.primaryDark}
          />
        ) : null}
        <Text style={[styles.label, variant === 'primary' && styles.primaryLabel]} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: radius.pill,
    justifyContent: 'center',
    minHeight: sizing.buttonHeight,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  disabled: {
    opacity: 0.55,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  label: {
    color: colors.primaryDark,
    ...typography.button,
  },
  pressed: {
    opacity: 0.75,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  primaryLabel: {
    color: colors.surface,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
  },
  text: {
    backgroundColor: 'transparent',
    paddingHorizontal: spacing.sm,
  },
});
