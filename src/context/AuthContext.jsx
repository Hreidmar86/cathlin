import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ADMIN_EMAILS } from "../lib/config";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

const AuthContext = createContext(null);

const USERNAME_TO_EMAIL = {
  cathyyy: "cathyyy@cr.local",
  robin: "robin@cr.local"
};

const EMAIL_TO_USERNAME = {
  "cathyyy@cr.local": "Cathyyy",
  "robin@cr.local": "Robin"
};

function resolveEmailFromUsername(username) {
  const normalizedUsername = String(username || "").trim().toLowerCase();
  return USERNAME_TO_EMAIL[normalizedUsername] || "";
}

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

  async function signInWithPassword(username, password) {
    if (!supabase) throw new Error("Supabase är inte konfigurerat.");

    const email = resolveEmailFromUsername(username);
    const normalizedPassword = String(password || "");

    if (!email) {
      throw new Error("Fel användarnamn eller lösenord.");
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: normalizedPassword
    });

    if (error) {
      throw new Error("Fel användarnamn eller lösenord.");
    }
  }

  async function signOut() {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  const value = useMemo(() => {
    const email = session?.user?.email?.toLowerCase() || "";
    const username = EMAIL_TO_USERNAME[email] || "";

    return {
      session,
      user: session?.user ?? null,
      userEmail: email,
      username,
      isAdmin: Boolean(email && ADMIN_EMAILS.includes(email)),
      loading,
      authEnabled: isSupabaseConfigured,
      signInWithPassword,
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
