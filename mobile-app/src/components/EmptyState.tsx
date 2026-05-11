import FontAwesome from '@expo/vector-icons/FontAwesome';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../theme';

type Props = {
  icon?: ComponentProps<typeof FontAwesome>['name'];
  title: string;
  body: string;
};

export function EmptyState({ icon = 'bookmark-o', title, body }: Props) {
  return (
    <View style={styles.container}>
      <FontAwesome name={icon} size={22} color={colors.muted} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    color: colors.muted,
    ...typography.body,
    textAlign: 'center',
  },
  container: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
});
