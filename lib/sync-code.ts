/**
 * 6 位同步码工具
 *
 * 演示场景：手机 APP 显示一个 6 位同步码（例如 "HQ-A3XK"），
 * 用户在网站 /inbox?code=HQ-A3XK 打开，即可看到 APP 端保存的内容。
 *
 * 不强制注册，演示更轻；登录用户优先使用 user_id。
 */

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // 去掉易混字符 0/O/1/I

export function generateSyncCode(): string {
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
  }
  return code
}

export function normalizeSyncCode(code: string | null | undefined): string | null {
  if (!code) return null
  const cleaned = code
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 12)
  return cleaned.length >= 4 ? cleaned : null
}
