import Search from "@/src/components/custom/search-bar";
import { Suspense } from "react";
import { HeroSection } from "@/src/components/custom/hero-section";
import Discussions from "@/src/components/discussions/discussions";
import DiscussionFormDialog from "@/src/components/discussions/discussion-form-dialog";
import { CategoriesCarousel } from "@/src/components/discussions/categories-carousel";
import { TagsFilter } from "@/src/components/custom/tags-filter";
import { SortByDropdown } from "@/src/components/discussions/sort-by-dropdown";
import DiscussionsSkeleton from "@/src/components/skeletons/discussions-skeleton";

export default async function Page(props: {
    searchParams?: Promise<{
        query?: string;
        status?: string;
        category?: string;
        tags?: string;
        page?: string;
        sort?: "asc" | "desc";
        orderBy?: string;
        creator?: string;
    }>;
}) {

    const searchParams = await props.searchParams;
    const query = searchParams?.query;
    const status = searchParams?.status;
    const category = searchParams?.category;
    const tags = searchParams?.tags ? searchParams.tags.split(',') : undefined;
    const currentPage = Number(searchParams?.page) || 1;
    const sort = searchParams?.sort;
    const orderBy = searchParams?.orderBy;
    const creator = searchParams?.creator;

    return (
        <div className="w-full flex flex-col items-center">
            <HeroSection image="/images/bg-9.jpg" title="Discussions" subtitle="Join public conversations, explore ideas, and challenge perspectives">
                <div>
                    <DiscussionFormDialog />
                </div>
            </HeroSection>
            <div className="w-full flex flex-col gap-8 items-center rounded-lg mt-6 p-4">
                <h2 className="font-semibold text-lg">Filter by Category</h2>
                <CategoriesCarousel />
                <TagsFilter for="discussions" />
                <div className="w-full flex justify-between gap-8 border-b border-muted-foreground/30 p-8 rounded-t-lg">
                    <Search placeholder="Search discussions..." />
                    <SortByDropdown />
                </div>
                <Suspense key={query || '' + currentPage} fallback={<DiscussionsSkeleton />}>
                    <Discussions creator={creator} query={query} status={status} category={category} tags={tags} currentPage={currentPage} orderBy={orderBy} sort={sort} />
                </Suspense>
            </div>
        </div>
    );
}