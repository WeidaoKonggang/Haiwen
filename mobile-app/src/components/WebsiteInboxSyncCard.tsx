import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { isValidSyncCode, normalizeSyncCode, syncSavedItemsToWebsiteInbox } from '../services/websiteInbox';
import { useLanguage } from '../state/LanguageContext';
import { useWebsiteInbox } from '../state/WebsiteInboxContext';
import { useSavedItems } from '../state/SavedItemsContext';
import { WEBSITE_URL } from '../data/website';
import { colors, radius, spacing, typography } from '../theme';
import { openWebsite } from '../utils/linking';
import { ActionButton } from './ActionButton';
import { Card } from './Card';

export function WebsiteInboxSyncCard() {
  const { copy } = useLanguage();
  const { clearSyncCode, lastSyncStatus, saveSyncCode, syncCode } = useWebsiteInbox();
  const { savedItems } = useSavedItems();
  const [draftCode, setDraftCode] = useState(syncCode);
  const [localError, setLocalError] = useState('');
  const [localSuccess, setLocalSuccess] = useState(false);
  const [isBackfilling, setIsBackfilling] = useState(false);

  useEffect(() => {
    setDraftCode(syncCode);
  }, [syncCode]);

  const normalizedDraftCode = useMemo(() => normalizeSyncCode(draftCode), [draftCode]);
  const canSave = isValidSyncCode(normalizedDraftCode);

  const saveDraftCode = async () => {
    if (!canSave) {
      setLocalError(copy.saved.inboxInvalidCode);
      setLocalSuccess(false);
      return;
    }

    setLocalError('');
    setLocalSuccess(false);
    saveSyncCode(normalizedDraftCode);

    if (savedItems.length > 0) {
      setIsBackfilling(true);
      try {
        const result = await syncSavedItemsToWebsiteInbox(savedItems, normalizedDraftCode);
        if (result.successCount > 0 && result.websiteItemCount !== 0) {
          setLocalSuccess(true);
        }

        if ((result.successCount === 0 && result.errorCount > 0) || result.websiteItemCount === 0) {
          setLocalError(copy.saved.inboxLastFailed);
        }
      } finally {
        setIsBackfilling(false);
      }
    } else {
      setLocalSuccess(true);
    }
  };

  const statusText = (() => {
    if (localError) {
      return localError;
    }

    if (localSuccess) {
      return copy.saved.inboxLastSuccess;
    }

    if (lastSyncStatus?.result === 'success') {
      return copy.saved.inboxLastSuccess;
    }

    if (lastSyncStatus?.result === 'error') {
      return copy.saved.inboxLastFailed;
    }

    if (syncCode) {
      return `${copy.saved.inboxLinked}: ${syncCode}`;
    }

    return '';
  })();

  const statusStyle = [
    styles.statusText,
    (localError || lastSyncStatus?.result === 'error') && styles.statusError,
    (localSuccess || lastSyncStatus?.result === 'success') && styles.statusSuccess,
  ];

  return (
    <Card>
      <View style={styles.header}>
        <Text style={styles.title}>{copy.saved.inboxTitle}</Text>
        <Text style={styles.subtitle}>{copy.saved.inboxSubtitle}</Text>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>{copy.saved.inboxCode}</Text>
        <TextInput
          autoCapitalize="characters"
          autoCorrect={false}
          maxLength={8}
          onChangeText={(value) => {
            setLocalError('');
            setLocalSuccess(false);
            setDraftCode(normalizeSyncCode(value));
          }}
          placeholder={copy.saved.inboxCodePlaceholder}
          placeholderTextColor={colors.muted}
          style={styles.input}
          value={draftCode}
        />
      </View>

      {statusText ? <Text style={statusStyle}>{statusText}</Text> : null}

      <View style={styles.actions}>
        <ActionButton
          disabled={!canSave}
          icon="link"
          label={isBackfilling ? copy.saved.inboxSyncingExisting : copy.saved.inboxSaveCode}
          variant="primary"
          onPress={() => {
            void saveDraftCode();
          }}
        />
        <ActionButton
          disabled={!syncCode && !draftCode}
          icon="unlink"
          label={copy.saved.inboxClearCode}
          variant="secondary"
          onPress={() => {
            setLocalError('');
            setLocalSuccess(false);
            setDraftCode('');
            clearSyncCode();
          }}
        />
        <ActionButton
          disabled={!canSave && !syncCode}
          icon="external-link"
          label={copy.saved.website}
          variant="text"
          onPress={() => {
            const code = syncCode || normalizedDraftCode;
            openWebsite(`${WEBSITE_URL}/zh/inbox?code=${code}`);
          }}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  field: {
    gap: spacing.xs,
  },
  header: {
    gap: spacing.xs,
  },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    color: colors.text,
    fontSize: 15,
    minHeight: 44,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  label: {
    color: colors.text,
    ...typography.caption,
  },
  statusError: {
    color: colors.warning,
  },
  statusSuccess: {
    color: colors.success,
  },
  statusText: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  subtitle: {
    color: colors.muted,
    ...typography.body,
  },
  title: {
    color: colors.text,
    fontSize: 19,
    fontWeight: '700',
    lineHeight: 25,
  },
});
