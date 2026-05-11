import type { Language } from '../types';

type LocalizedError = Record<Language, string>;

const errorMessages: Array<{
  patterns: string[];
  message: LocalizedError;
}> = [
  {
    patterns: ['email rate limit exceeded', 'rate limit'],
    message: {
      en: 'Email verification is being rate limited. Try again later, or use existing account if it was already created.',
      zh: '验证邮件发送过于频繁，请稍后再试；如果账号已创建，请切换到“使用已有账号”登录。',
    },
  },
  {
    patterns: ['invalid login credentials', 'invalid credentials'],
    message: {
      en: 'Email or password is incorrect. Please check and try again.',
      zh: '邮箱或密码不正确，请检查后重试。',
    },
  },
  {
    patterns: ['user already registered', 'already registered', 'already exists'],
    message: {
      en: 'This email is already registered. Use existing account to sign in.',
      zh: '这个邮箱已经注册过，请使用已有账号登录。',
    },
  },
  {
    patterns: ['password should be at least', 'weak password'],
    message: {
      en: 'Password is too short. Please use a stronger password.',
      zh: '密码太短，请使用更强的密码。',
    },
  },
  {
    patterns: ['email not confirmed', 'confirm your email'],
    message: {
      en: 'Please confirm your email before signing in.',
      zh: '请先完成邮箱确认，然后再登录。',
    },
  },
  {
    patterns: ['network request failed', 'failed to fetch'],
    message: {
      en: 'Network request failed. Please check your connection and try again.',
      zh: '网络请求失败，请检查网络后重试。',
    },
  },
];

export function getLocalizedAuthError(message: string | null | undefined, language: Language) {
  if (!message) {
    return null;
  }

  const normalized = message.toLowerCase();
  const matched = errorMessages.find((errorMessage) =>
    errorMessage.patterns.some((pattern) => normalized.includes(pattern)),
  );

  return matched ? matched.message[language] : message;
}
