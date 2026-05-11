import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useLanguage } from '../state/LanguageContext';
import { colors, radius, spacing, typography } from '../theme';
import type { Language } from '../types';

const options: Language[] = ['en', 'zh'];

export function LanguageSwitch() {
  const { language, setLanguage, copy } = useLanguage();

  return (
    <View style={styles.container}>
      {options.map((option) => {
        const selected = language === option;

        return (
          <Pressable
            accessibilityRole="button"
            key={option}
            onPress={() => setLanguage(option)}
            style={[styles.option, selected && styles.selected]}>
            <Text style={[styles.label, selected && styles.selectedLabel]}>{copy.language[option]}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderRadius: radius.pill,
    borderWidth: 1,
    flexDirection: 'row',
    padding: 2,
  },
  label: {
    color: colors.muted,
    ...typography.caption,
  },
  option: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
  },
  selected: {
    backgroundColor: colors.surface,
  },
  selectedLabel: {
    color: colors.primaryDark,
  },
});
