'use client'

import { useAuth } from "@/src/contexts/AuthContext";
import { useEffect } from "react";

// This component is used to trigger user updates after login
export default function UserUpdator() {
    const { user, loading, fetchUser } = useAuth();

    useEffect(() => {
        if (!loading && !user) {
            fetchUser();
        }
    }, []);

    return null;
}