"use client";

import { User } from "@/src/types/models";
import useSupabaseClient from "@/src/utils/supabase/client";
import { createContext, useContext, useEffect, useState } from "react";

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

    // Load user from local storage on initial render
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setLoading(false);
        } else {
            fetchUser();
        }
    }, []);

    // Fetch user from Supabase
    const fetchUser = async () => {
        setLoading(true);
        const { data: session } = await supabase.auth.getSession();

        if (session?.session?.user) {
            const { data: userData, error } = await supabase
                .from("users")
                .select("*")
                .eq("id", session.session.user.id)
                .single();

            if (!error) {
                setUser({...userData, email: session.session.user.email});
                localStorage.setItem("user", JSON.stringify(userData));
            }
        } else {
            setUser(null);
            localStorage.removeItem("user");
        }
        setLoading(false);
    };

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
            if (event === "SIGNED_OUT") {
                setUser(null);
                localStorage.removeItem("user");
            } else {
                fetchUser();
            }
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