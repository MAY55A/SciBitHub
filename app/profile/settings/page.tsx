"use client"

import { useAuth } from "@/src/contexts/AuthContext";
import { EmailForm } from "../../../src/components/account-settings/email-form";
import { PersonalInformationForm } from "../../../src/components/account-settings/personal-info-form";
import { ContactsForm } from "../../../src/components/account-settings/contacts-form";
import { InterestsForm } from "../../../src/components/account-settings/interests-form";
import { ProfilePictureUpload } from "../../../src/components/account-settings/profile-picture-form";
import { AccountSettingsSkeleton } from "@/src/components/skeletons/account-settings-skeleton";
import { Suspense } from "react";
import { OraganizationDetailsForm } from "@/src/components/account-settings/organization-details-form";
import { EducationDetailsForm } from "@/src/components/account-settings/Education-details-form copy";
import { ResearcherType } from "@/src/types/enums";

export default function Settings() {
    const { user, loading } = useAuth();
    if (loading || !user) {
        return <AccountSettingsSkeleton />;
    }

    return (
        <Suspense fallback={<AccountSettingsSkeleton />}>
            <div className="flex flex-col gap-6">
                <EmailForm currentEmail={user!.email} />
                <PersonalInformationForm username={user!.username} country={user!.country} bio={user!.metadata?.bio || ""} />
                <ProfilePictureUpload userId={user!.id} image={user!.profile_picture} />
                { user!.metadata?.researcherType === ResearcherType.ORGANIZATION && <OraganizationDetailsForm name={user?.metadata.organizationName || ""} location={user?.metadata.location || ""}/>}
                { user!.metadata?.researcherType === ResearcherType.ACADEMIC && <EducationDetailsForm degree={user?.metadata.academicDegree || ""} institution={user?.metadata.institutionName || ""}/>}
                <InterestsForm interests={user!.metadata?.interests ?? []} />
                <ContactsForm contactEmail={user!.metadata?.contactEmail || ""} phone={user!.metadata?.phone || ""} contacts={user!.metadata?.contacts || []} />
            </div>
        </Suspense>
    );
}
