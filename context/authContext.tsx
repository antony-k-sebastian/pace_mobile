import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContextType, UserType } from "@/types";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { createUser } from "@/services/userService";

const AuthContext = createContext<AuthContextType | null>(null);

// wraps the app so all child can access the auth context
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserType | null>(null);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);

  // fetching the current user on startup
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        await updateUserData(data.user.id);
        router.replace("/(tabs)/home");
      } else {
        setUser(null);
        router.replace("/(auth)/authScreen");
      }
      setIsLoading(false);
    };

    fetchUser();

    // listen for login/logout events
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          updateUserData(session.user.id);
          router.replace("/(tabs)/home");
        } else {
          setUser(null);
          router.replace("/(auth)/authScreen");
        }
      }
    );
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return { success: false, msg: error.message };
    return { success: true };
  };

  const register = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

  

    if (error) return { success: false, msg: error.message };

    if (data.user) {
      const result = await createUser({
        id: data.user.id,
        email,
        name,
      });
    }
    return { success: true };
  };

  const updateUserData = async (uid: string) => {
    //await updateLastLogin(uid);
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", uid)
      .single();
    if (!error && data) {
      setUser({
        uid: data.id,
        email: data.email,
        name: data.name,
        image: data.image || null,
      });
    }
  };

  const contextValue: AuthContextType = {
    user,
    setUser,
    login,
    register,
    updateUserData,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// use auth hook to access the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be wrapped inside AuthProvider");
  }
  return context;
};
