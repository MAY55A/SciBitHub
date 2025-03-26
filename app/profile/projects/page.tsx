import Link from "@/src/components/custom/Link";
import { createClient } from "@/src/utils/supabase/server";
import Search from "../../../src/components/custom/search-bar";
import { Suspense } from "react";
import Projects from "../../../src/components/projects/projects";
import Pagination from "../../../src/components/custom/pagination";
import { fetchProjects } from "@/src/lib/fetch-data";
import ProjectsSkeleton from "@/src/components/skeletons/projects-skeleton";
import { ProjectStatus } from "@/src/types/models";
import { FormMessage } from "@/src/components/custom/form-message";
import ClearSearchParams from "./clear-search-params";

export default async function MyProjects(props: {
    searchParams?: Promise<{
        query?: string;
        page?: string;
        status?: ProjectStatus;
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
    const pages = await fetchProjects(
        user.id,
        query,
        status
    );
    const totalPages = pages?.totalPages;


    return (
        <div className="w-full flex flex-col gap-8 items-center rounded-lg mt-6">
            {/* This component removes the success/error from the URL */}
            <ClearSearchParams />
            <div className="w-full flex flex-wrap items-center justify-between gap-8 border-b border-muted-foreground/30 p-8 rounded-t-lg">
                <Search placeholder="Search my projects..." />
                <Link href={'/projects/create'} className='w-full max-w-[300px] font-bold bg-primary text-primary-foreground hover:bg-primary/90 hover:text-secondary-foreground text-center p-2 border border-primary rounded-lg'>
                    Start A New Project
                </Link>
            </div>
            {error !== undefined &&
                <FormMessage message={{ error }} classname="self-start pl-4"></FormMessage>
            }
            {success !== undefined &&
                <FormMessage message={{ success }} classname="self-start pl-4"></FormMessage>
            }
            <Suspense key={query + currentPage} fallback={<ProjectsSkeleton />}>
                <Projects editable={true} creator={user.id} query={query} status={status} currentPage={currentPage} />
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                {totalPages ? <Pagination totalPages={totalPages} /> : undefined}
            </div>
        </div>
    );
}

