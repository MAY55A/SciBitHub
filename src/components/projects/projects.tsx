import { ProjectCard } from "@/src/components/projects/project-card";
import { fetchProjects } from "@/src/lib/fetch-data";
import { ProjectStatus, ActivityStatus } from "@/src/types/enums";
import { Project } from "@/src/types/models";
import { FileText } from "lucide-react";

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

    const projects = await fetchProjects(
        creator,
        query,
        domain,
        status,
        activityStatus,
        tags,
        currentPage,
        orderBy,
        sort,
        limit,
    );
    return projects?.data && projects.data.length > 0 ?
        editable ?
            <div className="flex flex-wrap justify-center items-center gap-8">
                {projects.data.map((project: Project) => (
                    <div className="" key={project.id}>
                        <ProjectCard editable={editable} project={project} />
                    </div>
                ))}
            </div> :
            <div className="w-full flex flex-col gap-8 sm:flex-row justify-center items-stretch ">
                <div className="flex flex-col justify-between items-center gap-8 flex-1">
                    {projects.data.slice(0, 2).map((project: Project) => (
                        <div className="h-full" key={project.id}>
                            <ProjectCard editable={editable} project={project} />
                        </div>
                    ))}
                </div>
                {projects.data.length > 2 && (
                    <div className="flex flex-col gap-8 flex-1">
                        {projects.data.slice(2, 5).map((project: Project) => (
                            <div className="" key={project.id}>
                                <ProjectCard editable={editable} project={project} />
                            </div>
                        ))}
                    </div>
                )}
            </div> :
        <EmptyState status={status} />
        ;
}

function EmptyState({ status }: { status?: string }) {
    return (
        <div className="flex flex-col items-center text-center p-10 mt-10">
            <FileText className="w-20 h-20 text-muted-foreground" />
            <p className="mt-4 text-lg font-semibold text-muted-foreground">No {status} projects found</p>
        </div>
    );
}