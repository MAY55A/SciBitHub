import { createClient } from "@/src/utils/supabase/server";
import { listFilesFromPath } from "@/src/utils/minio/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, CloudOff } from "lucide-react";
import DatasetManager from "@/src/components/project-creation/dataset-manager";

const fetchTask = async (id: string) => {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();
    const { data, error } = await supabase
        .from("tasks")
        .select("title, data_type, data_source, project:projects(creator)")
        .eq("id", id)
        .single();

    if (error) {
        console.log("Error fetching task:", error);
        return null;
    }
    return { data, canEdit: (data.project as unknown as { creator: string }).creator === user.data.user?.id };
}

export default async function Page(props: { params: { id: string } }) {
    const { id } = await props.params;
    const res = await fetchTask(id);

    if (!res) {
        return notFound();
    }
    const { data, canEdit } = res;
    const files = await listFilesFromPath(data.data_source, data.data_type);

    return (
        <div className="w-full p-8 space-y-6">
            <Link href="/tasks/[id]" as={`/tasks/${id}`}>
                <span className="flex items-center gap-1 font-semibold text-sm underline font-retro">
                    <ChevronLeft size={15} />
                    {"Task: " + data.title}
                </span>
            </Link>
            <h2 className="text-xl font-semibold text-center text-primary">Manage Dataset Files</h2>
            {files ?
                <DatasetManager initialFiles={files} sourcePath={data.data_source} dataType={data.data_type} canEdit={canEdit} />
                : <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4 font-retro border rounded-lg">
                    <CloudOff className="mb-2 text-primary" size={40} />
                    <p>Dataset is currently unavailable.</p>
                    <p className="text-sm text-muted-foreground">We're having trouble connecting to the storage system. Please try again later.</p>
                </div>}
        </div>
    );
}