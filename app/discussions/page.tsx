import Search from "@/src/components/custom/search-bar";
import { Suspense } from "react";
import ProjectsSkeleton from "@/src/components/skeletons/projects-skeleton";
import Pagination from "@/src/components/custom/pagination";
import { fetchDiscussions } from "@/src/lib/fetch-data";
import { HeroSection } from "@/src/components/custom/hero-section";
import Discussions from "@/src/components/discussions/discussions";
import DiscussionFormDialog from "@/src/components/discussions/discussion-form-dialog.tsx";

export default async function Page(props: {
    searchParams?: Promise<{
        query?: string;
        page?: string;
        sort?: "asc" | "desc";
        orderBy?: string;
        creator?: string;
    }>;
}) {

    const searchParams = await props.searchParams;
    const query = searchParams?.query;
    const currentPage = Number(searchParams?.page) || 1;
    const sort = searchParams?.sort;
    const orderBy = searchParams?.orderBy;

    const creator = searchParams?.creator;
    const pages = await fetchDiscussions(
        creator,
        query,
    );
    const totalPages = pages?.totalPages;

    return (
        <div className="w-full flex flex-col items-center">
            <HeroSection image="/images/bg-9.jpg" title="Discussions" subtitle="Engage in meaningful discussions with the community">
                <div className="text-right">
                    <DiscussionFormDialog />
                </div>
            </HeroSection>
            <div className="w-full flex flex-col gap-8 items-center rounded-lg mt-6 p-4">
                <div className="w-full flex justify-between gap-8 border-b border-muted-foreground/30 p-8 rounded-t-lg">
                    <Search placeholder="Search discussions..." />
                </div>
                <Suspense key={query || '' + currentPage} fallback={<ProjectsSkeleton />}>
                    <Discussions creator={creator} query={query} currentPage={currentPage} orderBy={orderBy} sort={sort} />
                </Suspense>
                <div className="mt-5 flex w-full justify-center">
                    {totalPages ? <Pagination totalPages={totalPages} /> : undefined}
                </div>
            </div>
        </div>
    );
}