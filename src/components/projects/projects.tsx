import { ProjectCard } from "@/src/components/projects/project-card";
import { fetchProjects } from "@/src/lib/fetch-data";
import { ProjectStatus, ProjectProgress } from "@/src/types/enums";
import { Project } from "@/src/types/models";
import { FolderOpen, X } from "lucide-react";

export default async function Projects({
    editable,
    query,
    currentPage,
    orderBy,
    status,
    sort,
    limit,
    creator,
    progress
}: {
    editable?: boolean;
    query?: string;
    currentPage?: number;
    orderBy?: string;
    status?: ProjectStatus;
    sort?: "asc" | "desc";
    limit?: number;
    creator?: string;
    progress?: ProjectProgress
}) {

    const projects = await fetchProjects(
        creator,
        query,
        status,
        progress,
        currentPage,
        orderBy,
        sort,
        limit,
    );
    return (
        <div className="flex flex-wrap min-h-80 justify-center gap-8 rounded-lg mt-6">
            {projects?.data && projects.data.length > 0 ?
                projects.data.map((project: Project) => (
                    <ProjectCard editable={editable} project={project} key={project.id} />
                )) :
                <EmptyState status={status} />
            }
        </div>
    );
}

function EmptyState({ status }: { status?: string }) {
    return (
        <div className="flex flex-col items-center text-center p-10 mt-10">
            <FolderOpen className="w-20 h-20 text-muted-foreground" />
            <p className="mt-4 text-lg font-semibold text-muted-foreground">No {status} projects found</p>
        </div>
    );
}