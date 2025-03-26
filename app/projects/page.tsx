import Link from "@/src/components/custom/Link";
import { Suspense } from "react";
import { fetchProjects } from "@/src/lib/fetch-data";
import ProjectsSkeleton from "@/src/components/skeletons/projects-skeleton";
import Search from "@/src/components/custom/search-bar";
import Projects from "@/src/components/projects/projects";
import Pagination from "@/src/components/custom/pagination";
import { ProjectProgress, ProjectStatus } from "@/src/types/models";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

export default async function Page(props: {
    searchParams?: Promise<{
        query?: string;
        page?: string;
        sort?: "asc" | "desc";
        orderBy?: string;
        creator?: string;
        progress?: ProjectProgress;
    }>;
}) {

    const searchParams = await props.searchParams;
    const query = searchParams?.query;
    const currentPage = Number(searchParams?.page) || 1;
    const sort = searchParams?.sort;
    const orderBy = searchParams?.orderBy;
    const progress = searchParams?.progress;
    //const status = ProjectStatus.PUBLISHED;
    const status = undefined;

    const creator = searchParams?.creator;
    const pages = await fetchProjects(
        creator,
        query,
        status,
        progress
    );
    const totalPages = pages?.totalPages;


    return (
        <div className="w-full flex flex-col items-center">
            <Hero />
            <div className="w-full flex flex-col gap-8 items-center rounded-lg mt-6 p-4">
                <div className="w-full flex justify-between gap-8 border-b border-muted-foreground/30 p-8 rounded-t-lg">
                    <Search placeholder="Search projects..." />
                </div>
                <Suspense key={query || '' + currentPage} fallback={<ProjectsSkeleton />}>
                    <Projects creator={creator} query={query} status={status} currentPage={currentPage} orderBy={orderBy} sort={sort} progress={progress} />
                </Suspense>
                <div className="mt-5 flex w-full justify-center">
                    {totalPages ? <Pagination totalPages={totalPages} /> : undefined}
                </div>
            </div>
        </div>
    );
}

function Hero() {
    return (
        <div className="relative w-full h-[50vh]">
            <div className="z-[-1]">
                <Image
                    priority
                    src="/images/bg-6.jpg"
                    fill
                    alt="projects hero image"
                    className="object-cover object-center opacity-40"
                />
            </div>

            <div className="relative flex flex-col justify-between w-full h-full text-foreground p-8">
                <div className="mt-16">
                    <h1 className="text-4xl font-bold text-primary">Projects</h1>
                    <p className="text-muted-foreground">Discover projects in various domains.</p>
                </div>
                <div className="text-right">
                    <Link href={'/projects/create'} className='text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 hover:text-secondary-foreground py-2 px-4 border border-primary rounded-lg'>
                        start a project
                    </Link>
                </div>
            </div>
        </div>
    );
}