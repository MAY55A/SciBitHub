import { createClient } from "@/src/utils/supabase/server";
import Search from "@/src/components/custom/search-bar";
import { Suspense } from "react";
import DiscussionFormDialog from "@/src/components/discussions/discussion-form-dialog";
import Discussions from "@/src/components/discussions/discussions";
import DiscussionsSkeleton from "@/src/components/skeletons/discussions-skeleton";

export default async function MyProjects(props: {
    searchParams?: Promise<{
        query?: string;
        status?: string;
        page?: string;
    }>;
}) {

    const supabase = await createClient();
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
        return <p>You are not authenticated</p>;
    }

    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';
    const status = searchParams?.status;
    const currentPage = Number(searchParams?.page) || 1;

    return (
        <div className="w-full flex flex-col gap-8 items-center rounded-lg mt-6">
            <div className="w-full flex flex-wrap items-center justify-between gap-8 border-b border-muted-foreground/30 p-8 rounded-t-lg">
                <Search placeholder="Search my discussions..." />
                <DiscussionFormDialog />
            </div>
            <Suspense key={query + currentPage} fallback={<DiscussionsSkeleton />}>
                <Discussions editable={true} creator={user.id} query={query} status={status} currentPage={currentPage} />
            </Suspense>
        </div>
    );
}

