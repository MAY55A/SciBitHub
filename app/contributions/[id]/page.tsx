import { ContributionBody } from "@/src/components/contributions/contribution-body";
import { ContributionHeader } from "@/src/components/contributions/contribution-header";
import { Forbidden } from "@/src/components/errors/forbidden";
import { NotAvailable } from "@/src/components/errors/not-available";
import { fetchContribution } from "@/src/lib/fetch-data";
import { createClient } from "@/src/utils/supabase/server";
import { notFound, redirect } from "next/navigation";

export default async function Page({
    params,
}: {
    params: { id: string };
}) {

    const { id } = await params;
    if (!id) {
        return notFound();
    }

    const supabase = await createClient();
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
        redirect(`/sign-in?redirect_to=contributions/${id}`);
    }

    const contribution = await fetchContribution(id);
    if (!contribution) {
        return notFound();
    }

    if(contribution.deleted_at) {
        return NotAvailable({ type: "contribution" });
    }

    const isContributor = contribution.user?.id === user.id;
    const isCreator = contribution.task.project.creator?.id === user.id;
    if (!isContributor && !isCreator) {
        return <Forbidden message="You do not have the permission to view this contribution" />;
    }

    return (
        <div className="w-full max-w-[1200px] flex flex-col gap-8 p-8">
            <h1 className="text-2xl font-bold text-primary">Contribution Details</h1>
            <ContributionHeader contribution={contribution} showActions={isCreator}/>
            <ContributionBody data={contribution.data}/>
        </div>
    );
}