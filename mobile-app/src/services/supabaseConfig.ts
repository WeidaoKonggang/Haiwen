type Env = Record<string, string | undefined>;

export type SupabaseConfig = {
  url: string;
  anonKey: string;
};

const PLACEHOLDER_PATTERNS = ['replace_with_', 'your_', '填入', '你的'];

export function resolveSupabaseConfig(env: Env = process.env): SupabaseConfig | null {
  const url = cleanEnvValue(env.EXPO_PUBLIC_SUPABASE_URL);
  const anonKey = cleanEnvValue(env.EXPO_PUBLIC_SUPABASE_ANON_KEY);

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}

function cleanEnvValue(value: string | undefined) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return '';
  }

  const normalized = trimmed.toLowerCase();
  if (PLACEHOLDER_PATTERNS.some((pattern) => normalized.includes(pattern))) {
    return '';
  }

  return trimmed;
}
