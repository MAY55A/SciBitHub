'use client'

import { columns } from "@/src/components/contributions/columns";
import { contributionsFilters } from "@/src/components/contributions/filters";
import { ContributionsGroupActions } from "@/src/components/contributions/group-actions";
import { SquareLoader } from "@/src/components/custom/loader";
import { DataTable } from "@/src/components/data-table/data-table";
import { Forbidden } from "@/src/components/errors/forbidden";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { useAuth } from "@/src/contexts/AuthContext";
import { ProjectStatus } from "@/src/types/enums";
import { Contribution } from "@/src/types/models";
import { createClient } from "@/src/utils/supabase/client";
import { notFound, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
    const router = useRouter();
    const pathname = usePathname();
    const projectId = pathname.split("/")[2];
    const { user, loading: authLoading } = useAuth();

    const [taskId, setTaskId] = useState<string | null>(null);
    const [tasks, setTasks] = useState<{ id: string, title: string }[]>([]);
    const [contributions, setContributions] = useState<Contribution[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<"notfound" | "forbidden" | null>(null);

    // Fetch tasks
    useEffect(() => {
        if (!user || !projectId) return;

        const supabase = createClient();
        const fetchTasks = async () => {
            const { data: tasksData } = await supabase
                .from("tasks")
                .select("id, title, project:projects(creator, status)")
                .eq("project", projectId)
                .is("deleted_at", null)
                .order("created_at");
            const project = tasksData?.[0]?.project as { creator: string, status: ProjectStatus } | undefined;

            if (!tasksData || tasksData.length === 0 || project?.status !== ProjectStatus.PUBLISHED) {
                setError("notfound");
                return;
            }
            if (project?.creator !== user.id) {
                setError("forbidden");
                return;
            }

            setTasks(tasksData);
            setTaskId(tasksData[0].id);
        };

        fetchTasks();
    }, [user, projectId]);

    // Fetch contributions for selected task
    useEffect(() => {
        if (!taskId) return;

        const supabase = createClient();
        const fetchContributions = async () => {
            setLoading(true);
            const { data: contribs } = await supabase
                .from("contributions")
                .select("*, user:users(id, username, deleted_at)")
                .eq("task", taskId)
                .is("deleted_at", null);

            setContributions(contribs ?? []);
            setLoading(false);
        };

        fetchContributions();
    }, [taskId]);

    if (!authLoading && !user) {
        router.push(`/sign-in?redirect_to=/projects/${projectId}/contributions`);
        return null;
    }
    if (error === "notfound") {
        return notFound();
    }
    if (error === "forbidden") {
        return <Forbidden message="You do not have the permission to view contributions for this project." />;
    }

    if (!taskId) {
        return (
            <div className="flex items-center justify-center h-80 mt-16">
                < SquareLoader size="lg" />
            </div >
        );
    }

    return (
        <Tabs className="mt-4 p-8" value={taskId}>
            < TabsList className="w-full h-full flex flex-wrap justify-evenly bg-muted/50 m-4" >
                {
                    tasks.map(task => (
                        <TabsTrigger
                            value={task.id}
                            key={task.id}
                            onClick={() => setTaskId(task.id)}
                            className="flex-1 whitespace-nowrap text-center"
                        >
                            {task.title}
                        </TabsTrigger>
                    ))
                }
            </TabsList >

            {loading
                ? <div className="flex items-center justify-center h-80 mt-16">
                    < SquareLoader />
                </div >
                : <TabsContent value={taskId} className="h-full mt-16">
                    <h2 className="text-center font-semibold text-lg mt-8">Contributions</h2>
                    <DataTable
                        columns={columns}
                        data={contributions}
                        searchColumn="contributor"
                        filters={contributionsFilters}
                    >
                        <ContributionsGroupActions />
                    </DataTable>
                </TabsContent>
            }
        </Tabs >
    );
}