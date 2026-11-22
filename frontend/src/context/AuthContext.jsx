import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { supabase } from '../config/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;

      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);
    });

    const initializeAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (mounted) {
          setSession(data.session);
          setUser(data.session?.user ?? null);
        }
      } catch (error) {
        console.error('Authentication initialization failed:', error);

        if (mounted) {
          setSession(null);
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedName || !normalizedEmail || !password) {
      throw new Error('Please complete all required fields.');
    }

    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: {
          full_name: normalizedName,
        },
      },
    });

    if (error) throw error;

    return data;
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      throw new Error('Email and password are required.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (error) throw error;

    return data;
  }, []);

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    setUser(null);
    setSession(null);
  }, []);

  const sendPasswordReset = useCallback(async (email) => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      throw new Error('Please enter your email address.');
    }

    const { data, error } =
      await supabase.auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

    if (error) throw error;

    return data;
  }, []);

  const updatePassword = useCallback(async (password) => {
    if (!password || password.length < 8) {
      throw new Error('Password must contain at least 8 characters.');
    }

    const { data, error } = await supabase.auth.updateUser({
      password,
    });

    if (error) throw error;

    return data;
  }, []);

  const updateProfile = useCallback(async (updates) => {
    const fullName = String(updates?.full_name || '').trim();

    if (!fullName) {
      throw new Error('Full name is required.');
    }

    const metadata = {
      full_name: fullName,
      phone: String(updates?.phone || '').trim(),
      company_name: String(updates?.company_name || '').trim(),
    };

    const { data, error } = await supabase.auth.updateUser({
      data: metadata,
    });

    if (error) throw error;

    setUser(data.user);

    return data.user;
  }, []);

  const refreshSession = useCallback(async () => {
    const { data, error } = await supabase.auth.refreshSession();

    if (error) throw error;

    setSession(data.session);
    setUser(data.session?.user ?? null);

    return data.session;
  }, []);

  const role = user?.app_metadata?.role || 'customer';

  const isAuthenticated = Boolean(user);
  const isAdmin = role === 'admin';
  const isCustomer = role === 'customer';

  const value = useMemo(() => ({
    user,
    session,
    loading,
    role,
    isAuthenticated,
    isAdmin,
    isCustomer,
    register,
    login,
    logout,
    sendPasswordReset,
    updatePassword,
    updateProfile,
    refreshSession,
  }), [
    user,
    session,
    loading,
    role,
    isAuthenticated,
    isAdmin,
    isCustomer,
    register,
    login,
    logout,
    sendPasswordReset,
    updatePassword,
    updateProfile,
    refreshSession,
  ]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider.');
  }

  return context;
}
