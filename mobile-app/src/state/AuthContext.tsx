import type { Session, User } from '@supabase/supabase-js';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { AppState } from 'react-native';

import { isSupabaseConfigured, supabase } from '../services/supabase';

type SignInResult = {
  ok: boolean;
  message?: string;
  needsEmailConfirmation?: boolean;
};

type AuthContextValue = {
  errorMessage: string | null;
  isConfigured: boolean;
  isReady: boolean;
  isSigningIn: boolean;
  isSigningUp: boolean;
  session: Session | null;
  user: User | null;
  clearAuthError: () => void;
  signInWithPassword: (email: string, password: string) => Promise<SignInResult>;
  signUpWithPassword: (email: string, password: string) => Promise<SignInResult>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [isReady, setIsReady] = useState(!isSupabaseConfigured);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setIsReady(true);
      return undefined;
    }

    const client = supabase;
    let mounted = true;

    client.auth
      .getSession()
      .then(({ data, error }) => {
        if (!mounted) {
          return;
        }

        if (error) {
          setErrorMessage(error.message);
        }

        setSession(data.session);
      })
      .finally(() => {
        if (mounted) {
          setIsReady(true);
        }
      });

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setErrorMessage(null);
    });

    client.auth.startAutoRefresh();
    const appStateSubscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        client.auth.startAutoRefresh();
      } else {
        client.auth.stopAutoRefresh();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
      appStateSubscription.remove();
      client.auth.stopAutoRefresh();
    };
  }, []);

  const clearAuthError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  const signInWithPassword = useCallback(async (email: string, password: string): Promise<SignInResult> => {
    if (!supabase) {
      const message = 'Supabase is not configured for this app.';
      setErrorMessage(message);
      return { ok: false, message };
    }

    setIsSigningIn(true);
    setErrorMessage(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setIsSigningIn(false);

    if (error) {
      setErrorMessage(error.message);
      return { ok: false, message: error.message };
    }

    setSession(data.session);
    return { ok: true };
  }, []);

  const signUpWithPassword = useCallback(async (email: string, password: string): Promise<SignInResult> => {
    if (!supabase) {
      const message = 'Supabase is not configured for this app.';
      setErrorMessage(message);
      return { ok: false, message };
    }

    setIsSigningUp(true);
    setErrorMessage(null);

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    setIsSigningUp(false);

    if (error) {
      setErrorMessage(error.message);
      return { ok: false, message: error.message };
    }

    setSession(data.session);
    return {
      ok: true,
      needsEmailConfirmation: !data.session,
    };
  }, []);

  const signOut = useCallback(async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }

    setSession(null);
    setErrorMessage(null);
  }, []);

  const value = useMemo(
    () => ({
      clearAuthError,
      errorMessage,
      isConfigured: isSupabaseConfigured,
      isReady,
      isSigningIn,
      isSigningUp,
      session,
      signInWithPassword,
      signUpWithPassword,
      signOut,
      user: session?.user ?? null,
    }),
    [
      clearAuthError,
      errorMessage,
      isReady,
      isSigningIn,
      isSigningUp,
      session,
      signInWithPassword,
      signOut,
      signUpWithPassword,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
