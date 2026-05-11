import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useLanguage } from '../state/LanguageContext';
import { colors, layout, radius, spacing, typography } from '../theme';
import { LanguageSwitch } from './LanguageSwitch';

type Props = {
  title: string;
  subtitle: string;
  meta?: string;
  action?: ReactNode;
};

export function AppHeader({ title, subtitle, meta, action }: Props) {
  const { copy } = useLanguage();

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.brand}>{copy.appName}</Text>
        <LanguageSwitch />
      </View>
      <View style={styles.titleRow}>
        <View style={styles.titleCopy}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        {meta || action ? (
          <View style={styles.sideActions}>
            {meta ? <Text style={styles.meta}>{meta}</Text> : null}
            {action}
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  brand: {
    color: colors.primaryDark,
    ...typography.brand,
    letterSpacing: 0,
  },
  container: {
    gap: spacing.md,
    paddingBottom: layout.headerBottomMargin,
  },
  meta: {
    alignSelf: 'flex-start',
    backgroundColor: colors.softBlue,
    borderRadius: radius.pill,
    color: colors.primaryDark,
    ...typography.caption,
    overflow: 'hidden',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  sideActions: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  subtitle: {
    color: colors.muted,
    ...typography.subtitle,
  },
  title: {
    color: colors.text,
    ...typography.pageTitle,
  },
  titleCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  titleRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
