import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getLocalizedAuthError } from './authErrors';

describe('auth error localization', () => {
  it('localizes Supabase email rate limit errors', () => {
    assert.equal(
      getLocalizedAuthError('email rate limit exceeded', 'zh'),
      '验证邮件发送过于频繁，请稍后再试；如果账号已创建，请切换到“使用已有账号”登录。',
    );
    assert.equal(
      getLocalizedAuthError('email rate limit exceeded', 'en'),
      'Email verification is being rate limited. Try again later, or use existing account if it was already created.',
    );
  });

  it('falls back to the original message when no localized copy exists', () => {
    assert.equal(getLocalizedAuthError('Unexpected auth error', 'zh'), 'Unexpected auth error');
  });
});
