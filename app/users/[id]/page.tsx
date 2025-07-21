import { ContributorProfile } from "@/src/components/profile/contributor-profile";
import { ResearcherProfile } from "@/src/components/profile/researcher-profile";
import { fetchUser } from "@/src/lib/fetch-data";
import { UserRole } from "@/src/types/enums";
import { notFound } from "next/navigation";

export default async function Page({ ...props }: {
    params: Promise<{ id: string }>
}) {
    const { id } = await props.params;
    const user = await fetchUser(id);

    if (!user || user.role === UserRole.ADMIN) {
        return notFound();
    }

    return (
        <div className="container min-h-[70vh] flex justify-center items-center mt-6">
            {user.role === UserRole.RESEARCHER ? (
                <ResearcherProfile user={user} />
            ) : (
                <ContributorProfile user={user} />
            )}
        </div>
    );
}