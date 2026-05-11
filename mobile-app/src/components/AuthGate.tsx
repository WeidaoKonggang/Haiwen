import { useState, type PropsWithChildren } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getLocalizedAuthError } from '../services/authErrors';
import { useAuth } from '../state/AuthContext';
import { useLanguage } from '../state/LanguageContext';
import { colors, layout, radius, spacing, typography } from '../theme';
import { ActionButton } from './ActionButton';
import { Card } from './Card';
import { LanguageSwitch } from './LanguageSwitch';

export function AuthGate({ children }: PropsWithChildren) {
  const { copy, language } = useLanguage();
  const {
    clearAuthError,
    errorMessage,
    isConfigured,
    isReady,
    isSigningIn,
    isSigningUp,
    signInWithPassword,
    signUpWithPassword,
    user,
  } = useAuth();
  const [authMode, setAuthMode] = useState<'signIn' | 'signUp'>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (user) {
    return <>{children}</>;
  }

  const isSubmitting = isSigningIn || isSigningUp;
  const canSubmit = email.trim().length > 0 && password.length > 0 && !isSubmitting;
  const localizedErrorMessage = getLocalizedAuthError(errorMessage, language);

  const handleAuthSubmit = async () => {
    if (!canSubmit) {
      return;
    }

    setSuccessMessage(null);
    const result =
      authMode === 'signIn'
        ? await signInWithPassword(email, password)
        : await signUpWithPassword(email, password);

    if (result.ok) {
      setPassword('');

      if (authMode === 'signUp') {
        setAuthMode('signIn');
        setSuccessMessage(`${copy.auth.accountCreatedTitle}. ${copy.auth.accountCreatedBody}`);
      } else if (result.needsEmailConfirmation) {
        setSuccessMessage(`${copy.auth.checkEmailTitle}. ${copy.auth.checkEmailBody}`);
      }
    }
  };

  const toggleAuthMode = () => {
    clearAuthError();
    setSuccessMessage(null);
    setAuthMode((currentMode) => (currentMode === 'signIn' ? 'signUp' : 'signIn'));
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.topRow}>
          <Text style={styles.brand}>{copy.appName}</Text>
          <LanguageSwitch />
        </View>

        <View style={styles.hero}>
          <Text style={styles.title}>{copy.auth.title}</Text>
          <Text style={styles.subtitle}>{copy.auth.subtitle}</Text>
        </View>

        <Card>
          <View style={styles.cardHeader}>
            <Text style={styles.accountTitle}>
              {authMode === 'signIn' ? copy.auth.signInTitle : copy.auth.signUpTitle}
            </Text>
            <Text style={styles.accountSubtitle}>{copy.auth.accountSubtitle}</Text>
          </View>

          {!isConfigured ? (
            <View style={styles.statusBox}>
              <Text style={styles.statusTitle}>{copy.auth.notConfiguredTitle}</Text>
              <Text style={styles.statusText}>{copy.auth.notConfiguredBody}</Text>
            </View>
          ) : !isReady ? (
            <Text style={styles.statusText}>{copy.auth.loading}</Text>
          ) : (
            <View style={styles.form}>
              <View style={styles.field}>
                <Text style={styles.label}>{copy.auth.email}</Text>
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  onChangeText={(value) => {
                    clearAuthError();
                    setSuccessMessage(null);
                    setEmail(value);
                  }}
                  placeholder={copy.auth.emailPlaceholder}
                  placeholderTextColor={colors.muted}
                  style={styles.input}
                  textContentType="emailAddress"
                  value={email}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>{copy.auth.password}</Text>
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={(value) => {
                    clearAuthError();
                    setSuccessMessage(null);
                    setPassword(value);
                  }}
                  onSubmitEditing={handleAuthSubmit}
                  placeholder={copy.auth.passwordPlaceholder}
                  placeholderTextColor={colors.muted}
                  secureTextEntry
                  style={styles.input}
                  textContentType="password"
                  value={password}
                />
              </View>

              {localizedErrorMessage ? <Text style={styles.errorText}>{localizedErrorMessage}</Text> : null}
              {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}

              <ActionButton
                disabled={!canSubmit}
                icon={authMode === 'signIn' ? 'sign-in' : 'user-plus'}
                label={
                  authMode === 'signIn'
                    ? isSigningIn
                      ? copy.auth.signingIn
                      : copy.auth.signIn
                    : isSigningUp
                      ? copy.auth.creatingAccount
                      : copy.auth.createAccount
                }
                variant="primary"
                onPress={handleAuthSubmit}
              />

              <Pressable accessibilityRole="button" onPress={toggleAuthMode} style={styles.switchModeButton}>
                <Text style={styles.switchModeText}>
                  {authMode === 'signIn' ? copy.auth.switchToSignUp : copy.auth.switchToSignIn}
                </Text>
              </Pressable>
            </View>
          )}
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  accountSubtitle: {
    color: colors.muted,
    ...typography.body,
  },
  accountTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: '700',
    lineHeight: 25,
  },
  brand: {
    color: colors.primaryDark,
    ...typography.brand,
  },
  cardHeader: {
    gap: spacing.xs,
  },
  container: {
    alignSelf: 'center',
    flex: 1,
    gap: spacing.xl,
    justifyContent: 'center',
    maxWidth: 520,
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingVertical: spacing.xl,
    width: '100%',
  },
  errorText: {
    color: colors.warning,
    fontSize: 13,
    lineHeight: 19,
  },
  field: {
    gap: spacing.xs,
  },
  form: {
    gap: spacing.md,
  },
  hero: {
    gap: spacing.sm,
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
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  statusBox: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.lg,
    gap: spacing.xs,
    padding: spacing.md,
  },
  statusText: {
    color: colors.muted,
    ...typography.body,
  },
  statusTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 21,
  },
  subtitle: {
    color: colors.muted,
    ...typography.subtitle,
  },
  successText: {
    color: colors.success,
    fontSize: 13,
    lineHeight: 19,
  },
  switchModeButton: {
    alignSelf: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  switchModeText: {
    color: colors.primaryDark,
    ...typography.button,
  },
  title: {
    color: colors.text,
    ...typography.pageTitle,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
