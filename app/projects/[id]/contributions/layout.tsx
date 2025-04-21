import { NotAuthorized } from "@/src/components/errors/not-authorized";
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { ProjectStatus } from "@/src/types/enums";
import { createClient } from "@/src/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import Link from "next/link";
import { notFound } from "next/navigation";


async function fetchTasks(supabase: SupabaseClient<any, "public", any>, projectId: string) {
    const { data, error } = await supabase
        .from("tasks")
        .select(`id, title, project:projects(id,creator, status)`)
        .eq("project", projectId)
        .is("deleted_at", null)
        .order("created_at");
    if (error) return null;
    return data;
}
async function getProjectTasks(id: string) {
    const supabase = await createClient();

    const [userResponse, tasksResponse] = await Promise.all([
        supabase.auth.getUser(),
        fetchTasks(supabase, id),
    ]);

    const user = userResponse.data.user;
    const tasks = tasksResponse;

    return { user, tasks };
}

export default async function Layout({
    params,
    children,
}: {
    params: Promise<{ id: string }>;
    children: React.ReactNode;
}) {
    const { id } = await params;
    const { user, tasks } = await getProjectTasks(id);
    if (!tasks || tasks.length === 0 || tasks[0].project.status !== ProjectStatus.PUBLISHED) return notFound();
    if (!user || tasks[0].project.creator !== user.id) return <NotAuthorized />;

    return (
        <div className="w-full">
            <Tabs defaultValue={tasks[0].id} className="mt-4 p-8">
                <h1 className="text-center font-semibold text-lg">Tasks</h1>
                <TabsList className="w-full h-full flex flex-wrap justify-evenly bg-muted/50 m-4">
                    {tasks.map(task => (
                        <Link href={`?task=${task.id}`} scroll={false} className="flex-grow" key={task.id}>
                            <TabsTrigger value={task.id} className="w-full whitespace-nowrap text-center">
                                {task.title}
                            </TabsTrigger>
                        </Link>
                    ))}
                </TabsList>
                {children}
            </Tabs>
        </div>
    );
}