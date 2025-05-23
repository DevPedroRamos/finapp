"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

type SupabaseContextType = {
  supabase: ReturnType<typeof createClientComponentClient>;
  user: any;
  signOut: () => Promise<void>;
};

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
      
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setUser(session?.user ?? null);
          router.refresh();
        }
      );

      return () => {
        authListener.subscription.unsubscribe();
      };
    };

    getUser();
  }, [supabase.auth, router]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const value = {
    supabase,
    user,
    signOut,
  };

  return (
    <SupabaseContext.Provider value={value}>
      {loading ? (
        <div className="flex h-screen items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        children
      )}
    </SupabaseContext.Provider>
  );
}

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error("useSupabase must be used inside SupabaseProvider");
  }
  return context;
};