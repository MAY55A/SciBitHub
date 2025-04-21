import Link from "@/src/components/custom/Link";
import { Suspense } from "react";
import { fetchProjects } from "@/src/lib/fetch-data";
import ProjectsSkeleton from "@/src/components/skeletons/projects-skeleton";
import Search from "@/src/components/custom/search-bar";
import Pagination from "@/src/components/custom/pagination";
import { HeroSection } from "@/src/components/custom/hero-section";
import Projects from "@/src/components/projects/projects";
import { ActivityStatus } from "@/src/types/enums";

export default async function Page(props: {
    searchParams?: Promise<{
        query?: string;
        page?: string;
        sort?: "asc" | "desc";
        orderBy?: string;
        creator?: string;
        activityStatus?: ActivityStatus;
    }>;
}) {

    const searchParams = await props.searchParams;
    const query = searchParams?.query;
    const currentPage = Number(searchParams?.page) || 1;
    const sort = searchParams?.sort;
    const orderBy = searchParams?.orderBy;
    const activityStatus = searchParams?.activityStatus;
    //const status = ProjectStatus.PUBLISHED;
    const status = undefined;

    const creator = searchParams?.creator;
    const pages = await fetchProjects(
        creator,
        query,
        status,
        activityStatus
    );
    const totalPages = pages?.totalPages;


    return (
        <div className="w-full flex flex-col items-center">
            <HeroSection image="/images/bg-6.jpg" title="Projects" subtitle="Discover projects in various domains">
            <div className="text-right">
                    <Link href={'/projects/create'} className='text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 hover:text-secondary-foreground py-2 px-4 border border-primary rounded-lg'>
                        start a project
                    </Link>
                </div>
            </HeroSection>
            <div className="w-full flex flex-col gap-8 items-center rounded-lg mt-6 p-4">
                <div className="w-full flex justify-between gap-8 border-b border-muted-foreground/30 p-8 rounded-t-lg">
                    <Search placeholder="Search projects..." />
                </div>
                <Suspense key={query || '' + currentPage} fallback={<ProjectsSkeleton />}>
                    <Projects creator={creator} query={query} status={status} currentPage={currentPage} orderBy={orderBy} sort={sort} activityStatus={activityStatus} />
                </Suspense>
                <div className="mt-5 flex w-full justify-center">
                    {totalPages ? <Pagination totalPages={totalPages} /> : undefined}
                </div>
            </div>
        </div>
    );
}