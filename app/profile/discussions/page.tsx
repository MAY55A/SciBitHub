import { createClient } from "@/src/utils/supabase/server";
import Search from "../../../src/components/custom/search-bar";
import { Suspense } from "react";
import Pagination from "../../../src/components/custom/pagination";
import { fetchDiscussions } from "@/src/lib/fetch-data";
import ProjectsSkeleton from "@/src/components/skeletons/projects-skeleton";
import { FormMessage } from "@/src/components/custom/form-message";
import DiscussionFormDialog from "@/src/components/discussions/discussion-form-dialog";
import Discussions from "@/src/components/discussions/discussions";

export default async function MyProjects(props: {
    searchParams?: Promise<{
        query?: string;
        status?: string;
        page?: string;
        success?: string;
        error?: string;
    }>;
}) {

    const supabase = await createClient();
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
        return <p>You are not authenticated</p>;
    }

    const searchParams = await props.searchParams;
    const success = searchParams?.success;
    const error = searchParams?.error;
    const query = searchParams?.query || '';
    const status = searchParams?.status;
    const currentPage = Number(searchParams?.page) || 1;
    const pages = await fetchDiscussions(
        user.id,
        query,
        status
    );
    const totalPages = pages?.totalPages;


    return (
        <div className="w-full flex flex-col gap-8 items-center rounded-lg mt-6">
            <div className="w-full flex flex-wrap items-center justify-between gap-8 border-b border-muted-foreground/30 p-8 rounded-t-lg">
                <Search placeholder="Search my discussions..." />
                <DiscussionFormDialog />
            </div>
            {error !== undefined &&
                <FormMessage message={{ error }} classname="self-start pl-4"></FormMessage>
            }
            {success !== undefined &&
                <FormMessage message={{ success }} classname="self-start pl-4"></FormMessage>
            }
            <Suspense key={query + currentPage} fallback={<ProjectsSkeleton />}>
                <Discussions editable={true} creator={user.id} query={query} status={status} currentPage={currentPage} />
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                {totalPages ? <Pagination totalPages={totalPages} /> : undefined}
            </div>
        </div>
    );
}

