import { ContributionBody } from "@/src/components/contributions/contribution-body";
import { ContributionHeader } from "@/src/components/contributions/contribution-header";
import { NotAuthorized } from "@/src/components/errors/not-authorized";
import { fetchContribution } from "@/src/lib/fetch-data";
import { createClient } from "@/src/utils/supabase/server";
import { notFound } from "next/navigation";

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
        return <NotAuthorized />;
    }

    const contribution = await fetchContribution(id);
    if (!contribution) {
        return notFound();
    }

    const isContributor = contribution.user.id === user.id;
    const isCreator = contribution.task.project.creator.id === user.id;
    if (!isContributor && !isCreator) {
        return <NotAuthorized />;
    }

    return (
        <div className="w-full max-w-[1200px] flex flex-col gap-8 p-8">
            <h1 className="text-2xl font-bold text-primary">Contribution Details</h1>
            <ContributionHeader contribution={contribution} showActions={isCreator}/>
            <ContributionBody data={contribution.data}/>
        </div>
    );
}