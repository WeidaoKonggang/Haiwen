import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { ActionButton } from '@/src/components/ActionButton';
import { AppHeader } from '@/src/components/AppHeader';
import { Card } from '@/src/components/Card';
import { Chip } from '@/src/components/Chip';
import { Screen } from '@/src/components/Screen';
import { quickQuestions } from '@/src/data/mockAi';
import { askQuickQuestion } from '@/src/services/quickAsk';
import { createWebsiteInboxPayloadFromConsultation } from '@/src/services/websiteInbox';
import { useLanguage } from '@/src/state/LanguageContext';
import { useSavedItems } from '@/src/state/SavedItemsContext';
import { useWebsiteInbox } from '@/src/state/WebsiteInboxContext';
import { createSavedFromConsultation } from '@/src/state/savedItems';
import { colors, radius, spacing, typography } from '@/src/theme';
import type { ConsultationResult } from '@/src/types';

export default function QuickAskScreen() {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState<ConsultationResult | null>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { language, copy } = useLanguage();
  const { saveItem, isSaved } = useSavedItems();
  const { syncToInbox } = useWebsiteInbox();

  useEffect(() => {
    setResult(null);
    setError('');
  }, [language]);

  async function submitQuestion() {
    if (!question.trim()) {
      setError(copy.ask.error);
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const answer = await askQuickQuestion(question, language);
      setResult(answer);
    } finally {
      setIsSubmitting(false);
    }
  }

  const resultIsSaved = result ? isSaved(result.id, 'Consultation') : false;

  const saveConsultationResult = () => {
    if (!result) {
      return;
    }

    saveItem(createSavedFromConsultation(result));
    void syncToInbox(createWebsiteInboxPayloadFromConsultation(result));
  };

  return (
    <Screen>
      <AppHeader title={copy.ask.title} subtitle={copy.ask.subtitle} />

      <Card>
        <View style={styles.inputTop}>
          <Text style={styles.label}>{copy.ask.question}</Text>
        </View>

        <TextInput
          multiline
          onChangeText={setQuestion}
          placeholder={copy.ask.placeholder}
          placeholderTextColor={colors.muted}
          style={styles.input}
          textAlignVertical="top"
          value={question}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.sampleWrap}>
          {quickQuestions[language].map((sample) => (
            <Chip key={sample} label={sample} onPress={() => setQuestion(sample)} />
          ))}
        </View>

        <ActionButton
          disabled={isSubmitting}
          label={isSubmitting ? copy.ask.asking : copy.ask.askButton}
          icon={isSubmitting ? 'circle-o-notch' : 'send-o'}
          variant="primary"
          onPress={submitQuestion}
        />
      </Card>

      {result ? (
        <Card>
          <Text style={styles.resultTitle}>{result.title}</Text>
          <View style={styles.bulletList}>
            {result.bullets.map((bullet) => (
              <View key={bullet} style={styles.bulletRow}>
                <View style={styles.bulletDot} />
                <Text style={styles.bulletText}>{bullet}</Text>
              </View>
            ))}
          </View>
          <View style={styles.mattersBox}>
            <Text style={styles.mattersLabel}>{copy.ask.why}</Text>
            <Text style={styles.mattersText}>{result.whyThisMatters}</Text>
          </View>
          <ActionButton
            disabled={resultIsSaved}
            icon={resultIsSaved ? 'check' : 'bookmark-o'}
            label={resultIsSaved ? copy.ask.saved : copy.ask.save}
            onPress={saveConsultationResult}
          />
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  bulletDot: {
    backgroundColor: colors.primary,
    borderRadius: 3,
    height: 5,
    marginTop: 8,
    width: 5,
  },
  bulletList: {
    gap: spacing.sm,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  bulletText: {
    color: colors.text,
    flex: 1,
    ...typography.body,
  },
  error: {
    color: colors.warning,
    fontSize: 13,
    fontWeight: '700',
  },
  input: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    color: colors.text,
    ...typography.body,
    minHeight: 104,
    padding: spacing.md,
  },
  inputTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  mattersBox: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.lg,
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  mattersLabel: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: '700',
  },
  mattersText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 21,
  },
  resultTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
  },
  sampleWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
});
