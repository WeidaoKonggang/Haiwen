import { StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/src/components/ActionButton';
import { AppHeader } from '@/src/components/AppHeader';
import { Card } from '@/src/components/Card';
import { EmptyState } from '@/src/components/EmptyState';
import { Screen } from '@/src/components/Screen';
import { WebsiteInboxSyncCard } from '@/src/components/WebsiteInboxSyncCard';
import { useAuth } from '@/src/state/AuthContext';
import { useLanguage } from '@/src/state/LanguageContext';
import { useSavedItems } from '@/src/state/SavedItemsContext';
import { colors, spacing, typography } from '@/src/theme';
import { openWebsite } from '@/src/utils/linking';

export default function SavedScreen() {
  const { savedItems } = useSavedItems();
  const { copy } = useLanguage();
  const { signOut, user } = useAuth();

  return (
    <Screen>
      <AppHeader title={copy.saved.title} subtitle={copy.saved.subtitle} />

      {user ? (
        <Card>
          <View style={styles.signedInBox}>
            <View style={styles.signedInCopy}>
              <Text style={styles.statusText}>{copy.saved.signedInAs}</Text>
              <Text style={styles.emailText}>{user.email}</Text>
            </View>
            <ActionButton icon="sign-out" label={copy.saved.signOut} variant="secondary" onPress={signOut} />
          </View>
        </Card>
      ) : null}

      <WebsiteInboxSyncCard />

      {savedItems.length > 0 ? (
        savedItems.map((item) => (
          <Card key={item.id}>
            <View style={styles.metaRow}>
              <Text style={styles.type}>
                {item.type === 'Briefing' ? copy.saved.briefing : copy.saved.consultation}
              </Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <ActionButton icon="external-link" label={copy.saved.website} onPress={() => openWebsite(item.url)} />
          </Card>
        ))
      ) : (
        <View style={styles.accountHeader}>
          <Card>
            <EmptyState
              icon="bookmark-o"
              title={copy.saved.emptyTitle}
              body={copy.saved.emptyBody}
            />
          </Card>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  accountHeader: {
    gap: spacing.md,
  },
  date: {
    color: colors.muted,
    ...typography.caption,
  },
  emailText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 21,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signedInBox: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  signedInCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  statusText: {
    color: colors.muted,
    ...typography.body,
  },
  title: {
    color: colors.text,
    ...typography.cardTitle,
  },
  type: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: '700',
    marginRight: spacing.md,
  },
});
