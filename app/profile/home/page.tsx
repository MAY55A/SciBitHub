"use client"

import ProfileSkeleton from "@/src/components/skeletons/profile-skeleton";
import { useAuth } from "@/src/contexts/AuthContext";
import { ResearcherProfile } from "../../../src/components/profile/researcher-profile";
import { ContributorProfile } from "../../../src/components/profile/contributor-profile";
import { UserRole } from "@/src/types/enums";
import { useEffect } from "react";

export default function MyProfile() {
    const { user, loading, fetchUser } = useAuth();

    useEffect(() => {
        if(!loading && !user) {
            fetchUser();
        }
    }, []);

    if (loading || !user) {
        return <ProfileSkeleton />;
    }

    return (
        <div className="flex flex-col gap-4 rounded-lg mt-6">
            {user.role === UserRole.RESEARCHER ? (
                <ResearcherProfile user={user} />
            ) : (
                <ContributorProfile user={user} />
            )}
        </div>
    );
}