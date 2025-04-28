import { fetchProject } from "@/src/lib/fetch-data";
import { notFound } from "next/navigation";
import { ProjectHeader } from "@/src/components/projects/project-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { ProjectOverview } from "@/src/components/projects/project-overview";
import Link from "next/link";
import { ProjectContribution } from "@/src/components/projects/project-contribution";
import ProjectForum from "@/src/components/projects/project-forum";
import { ActivityStatus } from "@/src/types/enums";
import { NotAvailable } from "@/src/components/errors/not-available";
import { ProjectResults } from "@/src/components/projects/project-results";
import { getProjectPermissions } from "@/src/lib/permissions-service";
import { RestrictedProjectMessage } from "@/src/components/projects/restricted-project-message";

export default async function ProjectPage({ ...props }: {
    params: { id: string },
    searchParams: {
        tab?: string,
        page?: string,
        query?: string,
        sort?: "asc" | "desc";
        orderBy?: string;
        creator?: string;
    }
}) {
    const { id } = await props.params;
    const project = await fetchProject(id);

    if (!project) {
        return notFound();
    }

    if (project.deleted_at) {
        return NotAvailable({ type: "project" });
    }

    const searchParams = await props.searchParams;
    const currentTab = (await searchParams).tab || "overview";
    const { canViewContribution, canSendRequest, canViewResults, canEditResults } = await getProjectPermissions(project.id!, project.creator.id, project.visibility, project.participation_level);

    return (
        <div className="w-full mx-auto p-6">
            <ProjectHeader project={project} />
            <Tabs defaultValue={currentTab} className="mt-4 p-8">
                <TabsList className="flex justify-evenly bg-muted/50 my-4">
                    <Link href={`?tab=overview`} scroll={false} className="w-full">
                        <TabsTrigger value="overview" className="w-full">Overview</TabsTrigger>
                    </Link>
                    <Link href={`?tab=contribution`} scroll={false} className="w-full">
                        <TabsTrigger value="contribution" className="w-full">Contribution</TabsTrigger>
                    </Link>
                    <Link href={`?tab=forum`} scroll={false} className="w-full">
                        <TabsTrigger value="forum" className="w-full">Forum</TabsTrigger>
                    </Link>
                    <Link href={`?tab=results`} scroll={false} className="w-full">
                        <TabsTrigger value="results" className="w-full">Results</TabsTrigger>
                    </Link>
                </TabsList>

                <TabsContent value="overview">
                    <ProjectOverview project={project} />
                </TabsContent>

                <TabsContent value="contribution">
                    {project.activity_status === ActivityStatus.ONGOING ? (
                        canViewContribution ? (
                            <ProjectContribution projectId={project.id!} creator={project.creator.id} />
                        ) : <RestrictedProjectMessage projectId={project.id!} canSendRequest={canSendRequest} />
                    ) : <div className="w-full flex-col justify-center rounded-lg p-10 py-24 my-8 border">
                        <h3 className="text-center">This project has been <strong className="capitalize">{project.activity_status}</strong></h3>
                        <p className="text-center text-sm text-muted-foreground">No more contributions can be made</p>
                    </div>
                    }
                </TabsContent>

                <TabsContent value="forum">
                    <ProjectForum projectId={project.id!} {...searchParams} />
                </TabsContent>

                <TabsContent value="results">
                    {canViewResults ?
                        <ProjectResults projectId={project.id!} canEdit={canEditResults} />
                        : <div className="w-full flex-col justify-center rounded-lg p-10 py-24 my-8 border">
                            <h3 className="text-center">This project is <strong className="capitalize">{project.visibility}</strong></h3>
                            <p className="text-center text-sm text-muted-foreground">Results are not available.</p>
                        </div>
                    }
                </TabsContent>
            </Tabs>
        </div>
    );
}