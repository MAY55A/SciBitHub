import { ProjectCard } from "@/src/components/projects/project-card";
import { fetchProjects } from "@/src/lib/fetch-data";
import { ProjectStatus, ActivityStatus } from "@/src/types/enums";
import { Project } from "@/src/types/models";
import { FileText } from "lucide-react";
import Pagination from "../custom/pagination";

export default async function Projects({
    editable,
    query,
    domain,
    currentPage,
    orderBy,
    status,
    sort,
    limit,
    creator,
    activityStatus,
    tags
}: {
    editable?: boolean;
    query?: string;
    domain?: string;
    currentPage?: number;
    orderBy?: string;
    status?: ProjectStatus;
    sort?: "asc" | "desc";
    limit?: number;
    creator?: string;
    activityStatus?: ActivityStatus;
    tags?: string[];
}) {
    const { data: projects = [], totalPages = 0 } = await fetchProjects(
        creator,
        query,
        domain,
        status,
        activityStatus,
        tags,
        currentPage,
        orderBy,
        sort,
        limit
    );

    if (projects.length === 0) {
        return <EmptyState status={status} activityStatus={activityStatus} />;
    }
    return (
        <div className="w-full flex flex-col gap-16 items-center mt-6">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {projects.map((project: Project) => (
                    <div className="" key={project.id}>
                        <ProjectCard editable={editable} project={project} />
                    </div>
                ))}
            </div>
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages ?? 0} />
            </div>
        </div>
    );
}

function EmptyState({ status, activityStatus }: { status?: string, activityStatus?: ActivityStatus }) {
    return (
        <div className="flex flex-col items-center text-center p-10 mt-10">
            <FileText className="w-20 h-20 text-muted-foreground" />
            <p className="mt-4 text-lg font-semibold text-muted-foreground">No {activityStatus ?? status} projects found</p>
        </div>
    );
}