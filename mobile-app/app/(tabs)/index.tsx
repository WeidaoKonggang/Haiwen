import FontAwesome from '@expo/vector-icons/FontAwesome';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import * as Speech from 'expo-speech';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/src/components/ActionButton';
import { AppHeader } from '@/src/components/AppHeader';
import { Card } from '@/src/components/Card';
import { Chip } from '@/src/components/Chip';
import { Screen } from '@/src/components/Screen';
import { getBriefings } from '@/src/data/briefings';
import { getLocalizedText, translateCategory, translateRegion } from '@/src/i18n';
import { getAutoPlayStartBriefing, getNextBriefingInQueue } from '@/src/services/briefingPlayback';
import { buildBriefingSpeechText, getSpeechLanguageCode, getSpeechRate } from '@/src/services/briefingSpeech';
import { writeSpeechAudioToCache } from '@/src/services/ttsAudio';
import { createWebsiteInboxPayloadFromBriefing } from '@/src/services/websiteInbox';
import { resolveXfyunTtsConfig, synthesizeXfyunSpeech } from '@/src/services/xfyunTts';
import { useLanguage } from '@/src/state/LanguageContext';
import { useSavedItems } from '@/src/state/SavedItemsContext';
import { useWebsiteInbox } from '@/src/state/WebsiteInboxContext';
import { createSavedFromBriefing } from '@/src/state/savedItems';
import { colors, radius, spacing, typography } from '@/src/theme';
import type { BriefingItem, Region } from '@/src/types';
import { openWebsite } from '@/src/utils/linking';

type BriefFilter = {
  id: 'all' | 'eu' | 'china' | 'sea';
  region: Region | null;
};

const filters: BriefFilter[] = [
  { id: 'all', region: null },
  { id: 'eu', region: 'EU' },
  { id: 'china', region: 'China' },
  { id: 'sea', region: 'Southeast Asia' },
];

export default function BriefingScreen() {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [preparingId, setPreparingId] = useState<string | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [autoPlayResumeId, setAutoPlayResumeId] = useState<string | null>(null);
  const [isLoadingBriefings, setIsLoadingBriefings] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<BriefFilter['id']>('all');
  const [briefings, setBriefings] = useState<BriefingItem[]>([]);
  const audioPlayer = useAudioPlayer(null);
  const audioStatus = useAudioPlayerStatus(audioPlayer);
  const activeSpeechId = useRef<string | null>(null);
  const playbackKind = useRef<'system' | 'xfyun' | null>(null);
  const autoPlayRef = useRef(false);
  const visibleBriefingsRef = useRef<BriefingItem[]>([]);
  const playBriefingRef = useRef<(briefing: BriefingItem, options?: { autoPlay?: boolean }) => void>(() => {});
  const { language, copy } = useLanguage();
  const { saveItem, isSaved } = useSavedItems();
  const { syncToInbox } = useWebsiteInbox();

  const clearActiveSpeech = useCallback((briefingId?: string) => {
    if (briefingId && activeSpeechId.current !== briefingId) {
      return;
    }

    activeSpeechId.current = null;
    playbackKind.current = null;
    setPlayingId(null);
    setPreparingId(null);
  }, []);

  const stopPlayback = useCallback(() => {
    playbackKind.current = null;
    void Speech.stop();
    if (audioPlayer.isLoaded) {
      audioPlayer.pause();
      void audioPlayer.seekTo(0);
    }
  }, [audioPlayer]);

  const visibleBriefings = useMemo(() => {
    const selected = filters.find((filter) => filter.id === selectedFilter);

    if (!selected?.region) {
      return briefings;
    }

    return briefings.filter((briefing) => briefing.region === selected.region);
  }, [briefings, selectedFilter]);

  useEffect(() => {
    visibleBriefingsRef.current = visibleBriefings;
  }, [visibleBriefings]);

  useEffect(() => {
    let mounted = true;

    getBriefings()
      .then((items) => {
        if (mounted) {
          setBriefings(items);
        }
      })
      .finally(() => {
        if (mounted) {
          setIsLoadingBriefings(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    void setAudioModeAsync({
      playsInSilentMode: true,
    });
  }, []);

  useEffect(() => {
    return () => {
      activeSpeechId.current = null;
      stopPlayback();
    };
  }, [stopPlayback]);

  useEffect(() => {
    activeSpeechId.current = null;
    autoPlayRef.current = false;
    setIsAutoPlaying(false);
    setAutoPlayResumeId(null);
    clearActiveSpeech();
    stopPlayback();
  }, [clearActiveSpeech, language, stopPlayback]);

  const finishPlayback = useCallback(
    (briefingId: string) => {
      if (activeSpeechId.current !== briefingId) {
        return;
      }

      if (!autoPlayRef.current) {
        clearActiveSpeech(briefingId);
        return;
      }

      const nextBriefing = getNextBriefingInQueue(visibleBriefingsRef.current, briefingId);

      if (!nextBriefing) {
        autoPlayRef.current = false;
        setIsAutoPlaying(false);
        setAutoPlayResumeId(null);
        clearActiveSpeech(briefingId);
        return;
      }

      activeSpeechId.current = null;
      playbackKind.current = null;
      setPlayingId(null);
      setPreparingId(null);

      setTimeout(() => {
        if (autoPlayRef.current) {
          playBriefingRef.current(nextBriefing, { autoPlay: true });
        }
      }, 240);
    },
    [clearActiveSpeech],
  );

  const playBriefing = useCallback(
    async (briefing: BriefingItem, options: { autoPlay?: boolean } = {}) => {
      stopPlayback();
      autoPlayRef.current = Boolean(options.autoPlay);
      setIsAutoPlaying(Boolean(options.autoPlay));
      setAutoPlayResumeId(null);
      activeSpeechId.current = briefing.id;
      setPlayingId(briefing.id);
      setPreparingId(briefing.id);

      const speechText = buildBriefingSpeechText(briefing, language);
      const xfyunConfig = resolveXfyunTtsConfig();

      if (xfyunConfig) {
        try {
          const base64Audio = await synthesizeXfyunSpeech(speechText, xfyunConfig);

          if (activeSpeechId.current !== briefing.id) {
            return;
          }

          const audioUri = await writeSpeechAudioToCache(base64Audio, `${briefing.id}-${language}`);

          if (activeSpeechId.current !== briefing.id) {
            return;
          }

          playbackKind.current = 'xfyun';
          setPreparingId(null);
          audioPlayer.replace({ uri: audioUri });
          audioPlayer.play();
          return;
        } catch (error) {
          console.warn('Xfyun TTS failed; falling back to system speech.', error);
        }
      }

      if (activeSpeechId.current !== briefing.id) {
        return;
      }

      playbackKind.current = 'system';
      setPreparingId(null);
      Speech.speak(speechText, {
        language: getSpeechLanguageCode(language),
        pitch: 1,
        rate: getSpeechRate(language),
        onDone: () => finishPlayback(briefing.id),
        onError: () => finishPlayback(briefing.id),
        onStopped: () => finishPlayback(briefing.id),
      });
    },
    [audioPlayer, finishPlayback, language, stopPlayback],
  );

  useEffect(() => {
    playBriefingRef.current = playBriefing;
  }, [playBriefing]);

  useEffect(() => {
    if (playbackKind.current === 'xfyun' && audioStatus.didJustFinish && activeSpeechId.current) {
      finishPlayback(activeSpeechId.current);
    }
  }, [audioStatus.didJustFinish, finishPlayback]);

  const stopAutoPlay = useCallback((options: { rememberCurrent?: boolean } = {}) => {
    const pausedId = options.rememberCurrent ? activeSpeechId.current : null;
    autoPlayRef.current = false;
    setIsAutoPlaying(false);
    setAutoPlayResumeId(
      pausedId && visibleBriefingsRef.current.some((briefing) => briefing.id === pausedId) ? pausedId : null,
    );
    stopPlayback();
    clearActiveSpeech();
  }, [clearActiveSpeech, stopPlayback]);

  const toggleSpeech = useCallback(
    (briefing: BriefingItem) => {
      if (activeSpeechId.current === briefing.id) {
        stopAutoPlay({ rememberCurrent: autoPlayRef.current });
        return;
      }

      void playBriefing(briefing);
    },
    [playBriefing, stopAutoPlay],
  );

  const toggleAutoPlay = useCallback(() => {
    if (autoPlayRef.current || isAutoPlaying) {
      stopAutoPlay({ rememberCurrent: true });
      return;
    }

    const firstBriefing = getAutoPlayStartBriefing(visibleBriefingsRef.current, autoPlayResumeId);

    if (firstBriefing) {
      void playBriefing(firstBriefing, { autoPlay: true });
    }
  }, [autoPlayResumeId, isAutoPlaying, playBriefing, stopAutoPlay]);

  const saveBriefing = useCallback(
    (briefing: BriefingItem) => {
      saveItem(createSavedFromBriefing(briefing, new Date(), language));
      void syncToInbox(createWebsiteInboxPayloadFromBriefing(briefing, language));
    },
    [language, saveItem, syncToInbox],
  );

  const autoPlayDisabled = isLoadingBriefings || visibleBriefings.length === 0;
  const canResumeAutoPlay = Boolean(
    autoPlayResumeId && visibleBriefings.some((briefing) => briefing.id === autoPlayResumeId),
  );

  return (
    <Screen>
      <AppHeader
        title={copy.briefing.title}
        subtitle={copy.briefing.subtitle}
        meta={copy.briefing.time}
        action={
          <Pressable
            accessibilityRole="button"
            disabled={autoPlayDisabled}
            onPress={toggleAutoPlay}
            style={({ pressed }) => [
              styles.autoButton,
              isAutoPlaying && styles.autoButtonActive,
              autoPlayDisabled && styles.autoButtonDisabled,
              pressed && !autoPlayDisabled && styles.pressed,
            ]}>
            <FontAwesome
              name={isAutoPlaying ? 'pause' : 'play-circle'}
              size={13}
              color={isAutoPlaying ? colors.surface : colors.primaryDark}
            />
            <Text style={[styles.autoButtonText, isAutoPlaying && styles.autoButtonTextActive]}>
              {isAutoPlaying
                ? copy.briefing.pauseAutoPlay
                : canResumeAutoPlay
                  ? copy.briefing.resumeAutoPlay
                  : copy.briefing.autoPlay}
            </Text>
          </Pressable>
        }
      />

      <View style={styles.filterRow}>
        {filters.map((filter, index) => {
          const label = filter.region ? translateRegion(filter.region, language) : copy.briefing.filters[0];

          return (
            <Chip
              key={filter.id}
              label={index === 3 && language === 'en' ? 'SEA' : label}
              selected={selectedFilter === filter.id}
              onPress={() => setSelectedFilter(filter.id)}
            />
          );
        })}
      </View>

      {isLoadingBriefings ? (
        <Card>
          <Text style={styles.loadingTitle}>{language === 'zh' ? '正在准备今日简报' : 'Preparing today’s brief'}</Text>
          <Text style={styles.loadingText}>
            {language === 'zh'
              ? '正在读取真实新闻并整理为管理层速览。'
              : 'Reading live news and shaping it into an executive scan.'}
          </Text>
        </Card>
      ) : null}

      {!isLoadingBriefings && visibleBriefings.length === 0 ? (
        <Card>
          <Text style={styles.loadingTitle}>{language === 'zh' ? '暂无匹配简报' : 'No matching briefs'}</Text>
          <Text style={styles.loadingText}>
            {language === 'zh' ? '切换筛选条件，或稍后刷新今日新闻。' : 'Try another filter, or refresh today’s news later.'}
          </Text>
        </Card>
      ) : null}

      {!isLoadingBriefings && visibleBriefings.map((briefing) => {
        const isPlaying = playingId === briefing.id;
        const isPreparing = preparingId === briefing.id;
        const saved = isSaved(briefing.id, 'Briefing');

        return (
          <Card key={briefing.id}>
            <View style={styles.cardTop}>
              <View style={styles.tags}>
                <Text style={styles.tagText}>{translateRegion(briefing.region, language)}</Text>
                <Text style={styles.tagText}>{translateCategory(briefing.category, language)}</Text>
              </View>
              <Text style={styles.readTime}>{language === 'zh' ? '速读' : 'Scan'}</Text>
            </View>

            <Text style={styles.title}>{getLocalizedText(briefing.title, language)}</Text>
            <Text style={styles.summary}>{getLocalizedText(briefing.summary, language)}</Text>

            <View style={styles.mattersBox}>
              <Text style={styles.mattersLabel}>{copy.briefing.why}</Text>
              <Text style={styles.mattersText}>{getLocalizedText(briefing.whyThisMatters, language)}</Text>
            </View>

            {isPlaying ? (
              <View style={styles.transcriptBox}>
                <Text style={styles.transcriptLabel}>{copy.briefing.transcript}</Text>
                <Text style={styles.transcriptText}>{getLocalizedText(briefing.transcript, language)}</Text>
              </View>
            ) : null}

            <View style={styles.actions}>
              <ActionButton
                icon={isPlaying ? 'stop' : 'play'}
                label={isPreparing ? copy.briefing.preparing : isPlaying ? copy.briefing.playing : copy.briefing.play}
                variant="primary"
                onPress={() => toggleSpeech(briefing)}
              />
              <ActionButton
                disabled={saved}
                icon={saved ? 'check' : 'bookmark-o'}
                label={saved ? copy.briefing.saved : copy.briefing.save}
                variant="secondary"
                onPress={() => saveBriefing(briefing)}
              />
              <ActionButton
                icon="external-link"
                label={copy.briefing.website}
                variant="text"
                onPress={() => openWebsite(briefing.url)}
              />
            </View>
          </Card>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: spacing.sm,
    paddingTop: spacing.xs,
  },
  autoButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.pill,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    minHeight: 32,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
  },
  autoButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  autoButtonDisabled: {
    opacity: 0.45,
  },
  autoButtonText: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
  autoButtonTextActive: {
    color: colors.surface,
  },
  cardTop: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
    marginBottom: spacing.xs,
  },
  loadingText: {
    color: colors.muted,
    ...typography.body,
  },
  loadingTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
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
    lineHeight: 20,
  },
  pressed: {
    opacity: 0.75,
  },
  readTime: {
    color: colors.muted,
    ...typography.caption,
  },
  summary: {
    color: colors.muted,
    ...typography.body,
  },
  tagText: {
    backgroundColor: colors.softBlue,
    borderRadius: radius.pill,
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
    overflow: 'hidden',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  tags: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  title: {
    color: colors.text,
    ...typography.cardTitle,
  },
  transcriptBox: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.md,
  },
  transcriptLabel: {
    color: colors.muted,
    ...typography.caption,
  },
  transcriptText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
});
