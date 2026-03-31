import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";

interface AuthContextType {
  session: Session | null;
  user: User | any | null; // Allow PHP user objects
  loading: boolean;
  signOut: () => Promise<void>;
  isPhpAuth: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPhpAuth, setIsPhpAuth] = useState(false);

  useEffect(() => {
    // 1. Check PHP Session Bridge (Hostgator)
    const checkPhpAuth = async () => {
      try {
        const response = await fetch('/api/check-auth.php');
        const data = await response.json();
        if (data.authenticated && data.user) {
          console.log("AuthBridge: Logged in via PHP", data.user);
          setUser({
            ...data.user,
            user_metadata: { full_name: data.user.name, avatar_url: null },
            email: data.user.email,
            is_external: true
          });
          setIsPhpAuth(true);
          setLoading(false);
          return true;
        }
      } catch (e) {
        console.warn("AuthBridge: PHP session not found or error", e);
      }
      return false;
    };

    // 2. Check active Supabase session
    const init = async () => {
      const phpLoggedIn = await checkPhpAuth();
      if (phpLoggedIn) return;

      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    init();

    // 3. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isPhpAuth) return; // Keep PHP auth if active
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signOut, isPhpAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
