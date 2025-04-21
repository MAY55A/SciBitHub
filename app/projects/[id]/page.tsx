import { fetchProject } from "@/src/lib/fetch-data";
import { notFound } from "next/navigation";
import { ProjectHeader } from "../../../src/components/projects/project-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { ProjectOverview } from "../../../src/components/projects/project-overview";
import Link from "next/link";
import { ProjectContribution } from "@/src/components/projects/project-contribution";
import ProjectForum from "@/src/components/projects/project-forum";
import { ActivityStatus } from "@/src/types/enums";
import { NotAvailable } from "@/src/components/errors/not-available";

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

    return (
        <div className="w-full mx-auto p-6">
            <ProjectHeader project={project} />
            <Tabs defaultValue={currentTab} className="mt-4 p-8">
                <TabsList className="flex justify-evenly bg-muted/50 my-4">
                    <Link href={`?tab=overview`} scroll={false} className="w-full">
                        <TabsTrigger value="overview" className="w-full">Overview</TabsTrigger>
                    </Link>
                    {project.activity_status === ActivityStatus.ONGOING &&
                        <Link href={`?tab=contribution`} scroll={false} className="w-full">
                            <TabsTrigger value="contribution" className="w-full">Contribution</TabsTrigger>
                        </Link>
                    }
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
                {project.activity_status === ActivityStatus.ONGOING &&
                    <TabsContent value="contribution">
                        <ProjectContribution projectId={project.id!} creator={project.creator.id}/>
                    </TabsContent>
                }
                <TabsContent value="forum">
                    <ProjectForum projectId={project.id!} {...searchParams} />
                </TabsContent>
                <TabsContent value="results">
                </TabsContent>
            </Tabs>
        </div>
    );
}