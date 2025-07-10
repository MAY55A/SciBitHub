import { fetchProject } from "@/src/lib/fetch-data";
import { notFound } from "next/navigation";
import { ProjectHeader } from "@/src/components/projects/project-header";
import { ActivityStatus, ProjectStatus } from "@/src/types/enums";
import { NotAvailable } from "@/src/components/errors/not-available";
import { getProjectPermissions } from "@/src/lib/services/permissions-service";
import { RestrictedProjectMessage } from "@/src/components/projects/restricted-project-message";
import { SquareLoader } from "@/src/components/custom/loader";
import { cn } from "@/src/lib/utils";
import dynamic from "next/dynamic";
import Link from "next/link";

const ProjectOverview = dynamic(() => import('@/src/components/projects/project-overview'), { loading: () => <div className="w-full h-80 flex justify-center items-center "><SquareLoader /></div> });
const ProjectContribution = dynamic(() => import('@/src/components/projects/project-contribution'), { loading: () => <div className="w-full h-80 flex justify-center items-center "><SquareLoader /></div> });
const ProjectForum = dynamic(() => import('@/src/components/projects/project-forum'), { loading: () => <div className="w-full h-80 flex justify-center items-center "><SquareLoader /></div> });
const ProjectResults = dynamic(() => import('@/src/components/projects/project-results'), { loading: () => <div className="w-full h-80 flex justify-center items-center "><SquareLoader /></div> });

export default async function ProjectPage({ ...props }: {
    params: Promise<{ id: string }>,
    searchParams: Promise<{
        tab?: string,
        page?: string,
        query?: string,
        sort?: "asc" | "desc";
        orderBy?: string;
        creator?: string;
    }>
}) {
    const { id } = await props.params;
    const project = await fetchProject(id);

    if (!project || project.status !== ProjectStatus.PUBLISHED ) {
        return notFound();
    }

    if (project.deleted_at) {
        return NotAvailable({ type: "project" });
    }

    const searchParams = await props.searchParams;
    const currentTab = (await searchParams).tab || "overview";
    const { canViewContribution, canSendRequest, canViewResults, canEditResults } = await getProjectPermissions(project.id!, project.visibility, project.participation_level, project.creator?.id);

    const TabLink = ({ tab, children }: { tab: string, children: React.ReactNode }) => (
        <Link
            href={`?tab=${tab}`}
            scroll={false}
            className={cn("w-full text-center px-4 py-2 rounded-t-lg text-bold border-primary/50", currentTab === tab ? 'bg-background text-primary border-t border-l border-r' : 'bg-muted/50 border-b')}
        >
            {children}
        </Link>
    );
    return (
        <div className="w-full mx-auto p-6">
            <ProjectHeader project={project} />

            <div className="flex justify-evenly bg-muted/50 my-4 text-muted-foreground/80">
                <TabLink tab="overview">Overview</TabLink>
                <TabLink tab="contribution">Contribution</TabLink>
                <TabLink tab="forum">Forum</TabLink>
                <TabLink tab="results">Results</TabLink>
            </div>

            <div className="p-4 border border-t-0 rounded-b-lg">
                {currentTab === "overview" && <ProjectOverview project={project} />}

                {currentTab === "contribution" && (
                    project.activity_status === ActivityStatus.ONGOING ? (
                        canViewContribution ? (
                            <ProjectContribution projectId={project.id!} creator={project.creator?.id} />
                        ) : (
                            <RestrictedProjectMessage projectId={project.id!} canSendRequest={canSendRequest} />
                        )
                    ) : (
                        <div className="w-full flex-col justify-center rounded-lg p-10 py-24 my-8 border">
                            <h3 className="text-center">This project has been <strong className="capitalize">{project.activity_status}</strong></h3>
                            <p className="text-center text-sm text-muted-foreground">No more contributions can be made</p>
                        </div>
                    )
                )}

                {currentTab === "forum" && (
                    canViewContribution ? (
                        <ProjectForum projectId={project.id!} {...searchParams} />
                    ) : (
                        <RestrictedProjectMessage projectId={project.id!} canSendRequest={canSendRequest} />
                    )
                )}

                {currentTab === "results" && (
                    canViewResults ? (
                        <ProjectResults projectId={project.id!} canEdit={canEditResults} />
                    ) : (
                        <div className="w-full flex-col justify-center rounded-lg p-10 py-24 my-8 border">
                            <h3 className="text-center">This project's results are <strong className="capitalize text-primary">{project.visibility}</strong></h3>
                            <p className="text-center text-sm text-muted-foreground">Results are not available.</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}