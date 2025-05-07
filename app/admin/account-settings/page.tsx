"use client"

import { useAuth } from "@/src/contexts/AuthContext";
import { EmailForm } from "@/src/components/account-settings/email-form";
import { PersonalInformationForm } from "@/src/components/account-settings/personal-info-form";
import { ContactsForm } from "@/src/components/account-settings/contacts-form";
import { ProfilePictureUpload } from "@/src/components/account-settings/profile-picture-form";
import { AccountSettingsSkeleton } from "@/src/components/skeletons/account-settings-skeleton";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/src/components/account-settings/reset-password-form";

export default function Settings() {
    const { user, loading } = useAuth();
    if (loading || !user) {
        return <AccountSettingsSkeleton />;
    }

    return (
        <Suspense fallback={<AccountSettingsSkeleton />}>
            <div className="w-full max-w-[800px] flex flex-col gap-6">
                <EmailForm currentEmail={user!.email} />
                <PersonalInformationForm username={user!.username} country={user!.country ?? ""} bio={user!.metadata?.bio || ""} />
                <ProfilePictureUpload userId={user!.id} image={user!.profile_picture} imageFallback={user.username.substring(0, 2).toUpperCase()} />
                <ContactsForm contactEmail={user!.metadata?.contactEmail || ""} phone={user!.metadata?.phone || ""} contacts={user!.metadata?.contacts || []} />
                <ResetPasswordForm userId={user.id} />
            </div>
        </Suspense>
    );
}
