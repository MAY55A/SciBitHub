import { SupabaseClient } from "@supabase/supabase-js";
import { TaskFilesMap } from "@/src/contexts/multistep-project-form-context";
import { ProjectInputData, TaskInputData } from "@/src/types/project-form-data";
import { deleteFromMinIO, uploadFileToMinIO } from "@/src/utils/minio/client";
import { createClient } from "@/src/utils/supabase/client";
import { base64ToFile } from "@/src/utils/utils";
import { ParticipationLevel, ProjectStatus, RequestType } from "@/src/types/enums";


export const createProject = async (inputData: Partial<ProjectInputData>, status: ProjectStatus, files: TaskFilesMap) => {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
        return { success: false, message: "You are not authenticated." };
    }

    if (!inputData) {
        return { success: false, message: "Project data is required." };
    }

    // Insert the new project into the database
    const { shortDescription, longDescription, coverImage, tasks, participants, participationLevel, moderationLevel, ...filteredInputData } = inputData;
    const { data: projectData, error: projectError } = await supabase
        .from("projects")
        .insert({
            ...filteredInputData,
            short_description: shortDescription,
            long_description: longDescription,
            participation_level: participationLevel,
            moderation_level: moderationLevel,
            creator: user.data.user.id,
            status: status,
        })
        .select("id")
        .single(); // Retrieve inserted project ID

    if (projectError || !projectData) {
        console.error("Database error:", projectError?.message);
        return { success: false, message: "Failed to save project" };
    }

    const projectId = projectData.id;

    // Upload cover image if provided
    if (coverImage) {
        const res = await uploadCoverImage(supabase, coverImage, projectId);
        if (!res.success) {
            return res;
        }
    }

    if (tasks && tasks.length > 0) {
        const res = await insertTasks(supabase, tasks, projectId, files);
        if (!res.success) {
            return res;
        }
    }

    // Insert project invitations
    if (participationLevel === ParticipationLevel.RESTRICTED && participants && participants.length > 0) {
        const invitations = participants.map(p => ({
            user_id: p.id,
            project_id: projectId,
            type: RequestType.INVITATION,
            requested_at: status === "published" ? new Date().toISOString() : undefined,
        }));

        const { error: invitationsError } = await supabase.from("participation_requests").insert(invitations);
        if (invitationsError) {
            console.error("Database error:", invitationsError.message);
            return { success: false, message: "Failed to save participation requests" };
        }
    }
    return { success: true, message: "Project created successfully!" };
};

export const insertTasks = async (
    supabase: SupabaseClient<any, "public", any>,
    tasks: TaskInputData[],
    projectId: string,
    files: TaskFilesMap
) => {
    const tasksData = tasks.map((task) => {
        const { targetCount, dataSource, dataType, datasetPath, ...rest } = task;
        return {
            ...rest,
            target_count: targetCount,
            data_type: dataType,
            project: projectId,
        };
    });

    const { data: insertedTasks, error: tasksError } = await supabase.from("tasks").insert(tasksData).select("id");
    if (tasksError) {
        console.error("Database error:", tasksError.message);
        return { success: false, message: "Failed to save tasks" };
    }

    // update file paths and upload files
    const tasksWithFiles = (await Promise.all(
        insertedTasks.map(async (task, taskIndex) => {
            const taskId = task.id;
            const taskDir = `projects/${projectId}/task-${taskId}/dataset`;
            const hasFiles = files[taskIndex] && files[taskIndex].length > 0;

            if (hasFiles) {
                try {
                    // Upload files to MinIO
                    await Promise.all(
                        files[taskIndex].map(async (file, fileIndex) => {
                            const filePath = `${taskDir}/${fileIndex}-${file.name}`;
                            await uploadFileToMinIO(file, filePath);
                        })
                    );
                } catch (error) {
                    console.error(`Failed to upload task ${taskIndex + 1} dataset`, error);
                    return null;
                }
                // Update the task with the correct file path
                return {
                    ...task,
                    data_source: taskDir
                };

            } else {
                return null;
            }

        })
    )).filter(task => task !== null);

    const { error: updateError } = await supabase
        .from("tasks")
        .update(tasksWithFiles)
        .match({ id: tasksWithFiles.map(task => task.id) });

    if (updateError) {
        console.error("Error updating tasks with file paths:", updateError.message);
        return { success: false, message: "Failed to update tasks with file paths" };
    }

    return { success: true, message: "Tasks created successfully!" };
};

export const updateProject = async (initialData: Partial<ProjectInputData>, newData: Partial<ProjectInputData>, files: TaskFilesMap) => {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
        return { success: false, message: "You are not authenticated." };
    }
    if (user.data.user.id !== initialData.creator) {
        return { success: false, message: "You are not allowed to edit this project." };
    }
    if (!newData) {
        return { success: false, message: "Project's new data is required." };
    }
    const { shortDescription, longDescription, coverImage, tasks, participants, participationLevel, moderationLevel, ...filteredInputData } = newData;

    if (initialData.coverImage !== coverImage) {
        console.log("updating cover image");
        if (coverImage) {
            const res = await uploadCoverImage(supabase, coverImage, initialData.id!);
            if (!res.success) {
                return res;
            }
        } else {
            const res = await deleteCoverImage(supabase, initialData.id!);
            if (!res.success) {
                return res;
            }
        }
    }
    if (JSON.stringify(initialData.tasks) !== JSON.stringify(newData.tasks)) {
        const res = await updateTasks(supabase, newData, initialData, files);
        if (!res.success) {
            return res;
        }
    }
    if (JSON.stringify(initialData.participants) !== JSON.stringify(participants)) {
        console.log("updating participants");
        const res = await updateParticipants(supabase, participants, initialData.participants, initialData.id!, newData.status!);
        if (!res.success) {
            return res;
        }
    }

    const { error: updateError } = await supabase.from("projects").update(
        {
            ...filteredInputData,
            short_description: shortDescription,
            long_description: longDescription,
            participation_level: participationLevel,
            moderation_level: moderationLevel,
            updated_at: new Date().toISOString()
        }).eq("id", initialData.id);

    if (updateError) {
        console.error("Database error:", updateError.message);
        return { success: false, message: "Failed to update project" };
    }

    return { success: true, message: "Project updated successfully!" };
}


export const updateTasks = async (supabase: SupabaseClient<any, "public", any>, newData: any, initialData: any, files: TaskFilesMap) => {
    console.log("Updating tasks");
    if (initialData.tasks && initialData.tasks.length > 0) {
        const newTaskIds = new Set(newData.tasks?.map((t: TaskInputData) => t.id) ?? []);
        const tasksToDelete = initialData.tasks.filter((task: TaskInputData) => !newTaskIds.has(task.id));
        if (tasksToDelete.length > 0) {
            const res = await deleteTasks(supabase, tasksToDelete);
            if (!res.success) {
                return res;
            }
        }
    }

    if (newData.tasks && newData.tasks.length > 0) {
        const newTasksFiles: TaskFilesMap = {};
        const updatedTasksFiles: TaskFilesMap = {};
        const newTasks: any[] = [];
        const updatedTasks: any[] = [];

        newData.tasks.forEach((task: TaskInputData, index: number) => {
            if (task.id) {
                updatedTasksFiles[updatedTasks.length] = files[index];
                updatedTasks.push(task);
            } else {
                newTasksFiles[newTasks.length] = files[index];
                newTasks.push(task);
            }
        });

        updatedTasks.forEach(async (task, taskIndex) => {
            const initialTask = initialData.tasks.find((t: TaskInputData) => t.id === task.id);
            const hasFiles = updatedTasksFiles[taskIndex] && updatedTasksFiles[taskIndex].length > 0;
            console.log("Updating task:", task);
            console.log("Initial task:", initialTask);

            if (hasFiles || JSON.stringify(task) !== JSON.stringify(initialTask)) {
                const { targetCount, dataSource, dataType, datasetPath, ...rest } = task;
                const taskDir = `projects/${initialData.id}/task-${task.id}/dataset`;

                if (hasFiles) {
                    try {
                        await Promise.all(
                            updatedTasksFiles[taskIndex].map(async (file, fileIndex) => {
                                const filePath = `${taskDir}/${fileIndex}-${file.name}`;
                                await uploadFileToMinIO(file, filePath);
                            })
                        );
                    } catch (error) {
                        console.error("Error uploading task dataset:", error);
                        return { success: false, message: `Failed to upload task "${task.title}" dataset` };
                    }
                }
                const taskData = {
                    ...rest,
                    target_count: targetCount,
                    data_source: hasFiles ? taskDir : datasetPath,
                    data_type: dataType,
                    updated_at: new Date().toISOString()
                };

                const { id, ...updatedTask } = taskData;
                const { error: updateError } = await supabase.from("tasks").update(updatedTask).eq("id", id);
                if (updateError) {
                    console.error("Database error:", updateError.message);
                    return { success: false, message: "Failed to update tasks" };
                }
            }
        });

        if (newTasks.length > 0) {
            const res = await insertTasks(supabase, newTasks, initialData.id, newTasksFiles);
            if (!res.success) {
                return res;
            }
        }
    }

    return { success: true, message: "Tasks updated successfully!" };
}

const deleteTasks = async (supabase: SupabaseClient<any, "public", any>, tasks: TaskInputData[]) => {
    tasks.forEach(async (task) => {
        const { count } = await supabase.from("contributions").select("*", { count: "exact", head: true }).eq("task", task.id);
        // hard delete if no contributions exist
        if (!count) {
            const { error: deleteError } = await supabase.from("tasks").delete().eq("id", task.id);
            if (deleteError) {
                console.error("Database error:", deleteError.message);
                return { success: false, message: "Failed to delete task." };
            }
            if (task.datasetPath) {
                await deleteFromMinIO(task.datasetPath, true);
            }

        // soft delete if contributions exist
        } else {
            const { error: updateError } = await supabase.from("tasks").update({ deleted_at: new Date().toISOString() }).eq("id", task.id);
            if (updateError) {
                console.error("Database error:", updateError.message);
                return { success: false, message: "Failed to delete task." };
            }
        }
    });
    return { success: true, message: "Tasks deleted successfully!" };
}

const uploadCoverImage = async (supabase: SupabaseClient<any, "public", any>, coverImage: string, projectId: string) => {
    const imageBlob = base64ToFile(coverImage);
    if (!imageBlob) {
        console.error("Invalid cover image format.");
        return { success: false, message: "Failed to upload cover image" };
    }
    const imagePath = `cover_images/${projectId}`;
    const { error: uploadError } = await supabase.storage
        .from("projects")
        .update(imagePath, imageBlob);

    if (uploadError) {
        console.error("Error uploading cover image:", uploadError);
        return { success: false, message: "Failed to upload cover image" };
    } else {
        const { data } = supabase.storage.from("projects").getPublicUrl(imagePath);
        const coverImageUrl = `${data.publicUrl}?v=${Date.now()}`; // Cache-busting URL
        await supabase.from("projects").update({ cover_image: coverImageUrl }).eq("id", projectId);
        return { success: true, message: "Cover image updated successfully!" };
    }
}
const deleteCoverImage = async (supabase: SupabaseClient<any, "public", any>, projectId: string) => {
    await supabase.storage
        .from("projects")
        .remove([`cover_images/${projectId}`]);
    await supabase.from("projects").update({ cover_image: null }).eq("id", projectId);
    return { success: true, message: "Cover image deleted successfully!" };
}

const updateParticipants = async (supabase: SupabaseClient<any, "public", any>, participants: any, oldParticipants: any, projectId: string, status: string) => {
    if (participants.length > 0) {
        const existingInvitationIds = new Set(oldParticipants?.map((p: any) => p.user_id) ?? []);
        const newInvitations: any[] = [];
        const invitationsToKeep = new Set();

        participants.forEach((p: any) => {
            if (!existingInvitationIds.has(p.id)) {
                newInvitations.push({
                    user_id: p.id,
                    project_id: projectId,
                    type: RequestType.INVITATION,
                    requested_at: status === "published" ? new Date().toISOString() : undefined,
                });
            } else {
                invitationsToKeep.add(p.id);
            }
        });

        // Insert new invitations
        if (newInvitations.length > 0) {
            const { error: insertError } = await supabase.from("participation_requests").insert(newInvitations);
            if (insertError) {
                console.error("Database error:", insertError.message);
                return { success: false, message: "Failed to save participation requests" };
            }
        }

        // Remove invitations that are no longer in the participants list
        const invitationsToDelete = Array.from(existingInvitationIds.difference(invitationsToKeep));

        if (invitationsToDelete.length > 0) {
            const { error: deleteError } = await supabase.from("participation_requests").delete().in("user_id", invitationsToDelete);
            if (deleteError) {
                console.error("Database error:", deleteError.message);
                return { success: false, message: "Failed to remove old invitations" };
            }
        }
    }
    return { success: true, message: "Participants updated successfully!" };
}