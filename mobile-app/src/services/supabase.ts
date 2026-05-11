import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

import { createSupabaseAuthStorage } from './supabaseAuthStorage';
import { resolveSupabaseConfig } from './supabaseConfig';

export const supabaseConfig = resolveSupabaseConfig();

export const supabase = supabaseConfig
  ? createClient(supabaseConfig.url, supabaseConfig.anonKey, {
      auth: {
        storage: createSupabaseAuthStorage(AsyncStorage),
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;

export const isSupabaseConfigured = Boolean(supabase);
