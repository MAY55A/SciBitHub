"use client";

import { createContext, useContext, useEffect, useState } from "react";
import useSupabaseClient from "@/src/utils/supabase/client";
import { User } from "@/src/types/models";
import { useRouter } from "next/navigation";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    fetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const supabase = useSupabaseClient();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchUser = async () => {
        setLoading(true);
        try {
            const { data: sessionData } = await supabase.auth.getSession();
            const supaUser = sessionData?.session?.user;

            if (supaUser) {
                const { data: userData, error } = await supabase
                    .from("users")
                    .select("*")
                    .eq("id", supaUser.id)
                    .single();

                if (!error && userData) {
                    setUser({ ...userData, email: supaUser.email });
                } else {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Error fetching user:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, _session) => {
            fetchUser();
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}