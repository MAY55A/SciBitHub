"use client";

import { useProjectEdit } from "@/src/contexts/project-edit-context";
import { Task } from "@/src/types/models";
import { createClient } from "@/src/utils/supabase/client";
import { useEffect } from "react";

async function fetchTasks(projectId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("project", projectId)
    if (error || !data || data.length === 0) return [];
    return data.map((task: Task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        tutorial: task.tutorial,
        type: task.type,
        datasetPath: task.data_source,
        dataType: task.data_type,
        targetCount: task.target_count ?? null,
        fields: task.fields.map(field => ({
            label: field.label,
            type: field.type,
            required: field.required,
            placeholder: field.placeholder,
            description: field.description,
            params: field.params
        }))
    }));
}

export default function ProjectEditWrapper({ projectId, children }: { projectId: string, children: React.ReactNode }) {
    const { updateData } = useProjectEdit();

    useEffect(() => {
        fetchTasks(projectId).then(fetchedTasks => {
            updateData({ tasks: fetchedTasks });
        });
    }, [projectId]);

    return children;
}