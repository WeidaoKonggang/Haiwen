import type { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, layout, spacing } from '../theme';

export function Screen({ children }: PropsWithChildren) {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: Math.max(layout.headerTopPadding, insets.top ? spacing.md : layout.headerTopPadding),
            paddingBottom: Math.max(spacing.xl, insets.bottom + spacing.xl),
          },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: layout.screenPaddingHorizontal,
  },
  inner: {
    alignSelf: 'center',
    gap: layout.feedGap,
    maxWidth: 720,
    width: '100%',
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
});
