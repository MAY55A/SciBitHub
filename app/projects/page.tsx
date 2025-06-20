import { Suspense } from "react";
import ProjectsSkeleton from "@/src/components/skeletons/projects-skeleton";
import Search from "@/src/components/custom/search-bar";
import { HeroSection } from "@/src/components/custom/hero-section";
import Projects from "@/src/components/projects/projects";
import { ActivityStatus, ProjectStatus } from "@/src/types/enums";
import { DomainsCarousel } from "@/src/components/projects/domains-carousel";
import { SortByDropdown } from "@/src/components/projects/sort-by-dropdown";
import { TagsFilter } from "@/src/components/custom/tags-filter";
import { CreateProjectButton } from "@/src/components/projects/create-project-button";
import { ActivityStatusSelection } from "@/src/components/projects/activity-status-selection";

export default async function Page(props: {
    searchParams?: Promise<{
        query?: string;
        domain?: string;
        page?: string;
        sort?: "asc" | "desc";
        orderBy?: string;
        creator?: string;
        activityStatus?: ActivityStatus;
        tags?: string;
    }>;
}) {

    const searchParams = await props.searchParams;
    const query = searchParams?.query;
    const domain = searchParams?.domain;
    const currentPage = Number(searchParams?.page) || 1;
    const sort = searchParams?.sort;
    const orderBy = searchParams?.orderBy;
    const activityStatus = searchParams?.activityStatus;
    const tags = searchParams?.tags?.split(',') || undefined;
    const status = ProjectStatus.PUBLISHED;
    const creator = searchParams?.creator;

    return (
        <div className="w-full flex flex-col items-center">
            <HeroSection image="/images/bg-6.jpg" title="Projects" subtitle="Discover and contribute to a wide range of community-driven projects across diverse domains, from science and technology to art and social impact.">
                <CreateProjectButton />
            </HeroSection>
            <div className="w-full flex flex-col gap-8 items-center rounded-lg mt-6 p-12">
                <h2 className="text-lg font-semibold">Filter by Research Domain</h2>
                <DomainsCarousel />
                <TagsFilter for="projects" />
                <div className="w-full flex justify-right gap-8 border-b border-muted-foreground/30 py-8 rounded-t-lg">
                    <Search placeholder="Search projects..." />
                    <ActivityStatusSelection/>
                    <SortByDropdown />
                </div>
                <Suspense key={query || '' + currentPage} fallback={<ProjectsSkeleton />}>
                    <Projects creator={creator} query={query} domain={domain} status={status} currentPage={currentPage} orderBy={orderBy} sort={sort} activityStatus={activityStatus} tags={tags} />
                </Suspense>
            </div>
        </div>
    );
}