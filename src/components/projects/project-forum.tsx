import { Suspense } from "react";
import { FeaturedTopics } from "../forums/featured-topics";
import TopicFormDialog from "../forums/topic-form-dialog";
import Topics from "../forums/topics";
import Search from "../custom/search-bar";
import { fetchForumTopics } from "@/src/lib/fetch-data";
import Pagination from "../custom/pagination";

export default async function ProjectForum({ ...props }: {
    projectId: string,
    query?: string;
    page?: string;
    sort?: "asc" | "desc";
    orderBy?: string;
    creator?: string;
}) {

    const currentPage = Number(props.page) || 1;
    const pages = await fetchForumTopics(
        props.projectId,
        props.query,
        props.creator
    );
    const totalPages = pages?.totalPages;

    return (
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
            <div className="col-span-1 lg:col-span-2 p-8">
                <TopicFormDialog projectId={props.projectId} />
                <div className="h-full w-full flex flex-col gap-4 items-center border border-input rounded-lg mt-6 p-4">
                    <div className="w-full p-8 ">
                        <Search placeholder="Search topics..." />
                    </div>
                    <Suspense key={props.query || '' + currentPage} fallback={null}>
                        <Topics project={props.projectId} query={props.query} currentPage={currentPage} orderBy={props.orderBy} sort={props.sort} />
                    </Suspense>
                    <div className="mt-5 flex w-full justify-center">
                        {totalPages ? <Pagination totalPages={totalPages} /> : undefined}
                    </div>
                </div>
            </div>
            <div className="relative">
                <FeaturedTopics project={props.projectId} />
            </div>
        </div>
    );
}