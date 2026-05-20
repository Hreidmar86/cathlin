import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ADMIN_EMAILS } from "../lib/config";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return undefined;
    }

    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null);
      setLoading(false);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function signInWithMagicLink(email) {
    if (!supabase) throw new Error("Supabase är inte konfigurerat.");

    const normalizedEmail = String(email || "").trim().toLowerCase();
    const { error } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        shouldCreateUser: false
      }
    });

    if (error) throw error;
  }

  async function signOut() {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  const value = useMemo(() => {
    const email = session?.user?.email?.toLowerCase() || "";

    return {
      session,
      user: session?.user ?? null,
      userEmail: email,
      isAdmin: Boolean(email && ADMIN_EMAILS.includes(email)),
      loading,
      authEnabled: isSupabaseConfigured,
      signInWithMagicLink,
      signOut
    };
  }, [session, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
