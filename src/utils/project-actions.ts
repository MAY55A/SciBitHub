"use server";

import { createClient } from "@/src/utils/supabase/server";
import { ProjectInputData } from "../types/project-form-data";
import { ParticipationLevel, ProjectStatus, RequestType } from "../types/models";
import { base64ToFile } from "./utils";



export const createProject = async (inputData: Partial<ProjectInputData>, status: ProjectStatus) => {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
        return { success: false, message: "You are not authenticated." };
    }

    if (!inputData) {
        return { success: false, message: "Project data is required." };
    }

    // Insert the new project into the database
    const { coverImage, tasks, participants, participationLevel, moderationLevel, ...filteredInputData } = inputData;
    const { data: projectData, error: projectError } = await supabase
        .from("projects")
        .insert({
            ...filteredInputData,
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
    let coverImageUrl = null;
    if (coverImage) {
        const imageBlob = base64ToFile(coverImage);
        if (!imageBlob) {
            console.error("Invalid cover image format.");
            return { success: false, message: "Failed to upload cover image" };
        }
        const imagePath = `cover_images/${projectId}`;
        const { error: uploadError } = await supabase.storage
            .from("projects")
            .upload(imagePath, imageBlob);

        if (uploadError) {
            console.error("Error uploading cover image:", uploadError);
            return { success: false, message: "Failed to upload cover image" };
        } else {
            const { data } = supabase.storage.from("projects").getPublicUrl(imagePath);
            coverImageUrl = `${data.publicUrl}?v=${Date.now()}`; // Cache-busting URL
        }
    }
    // Update cover image URL in project
    if (coverImageUrl) {
        await supabase.from("projects").update({ cover_image: coverImageUrl }).eq("id", projectId);
    }

    if (tasks && tasks.length > 0) {
        // Insert project tasks
        const tasksData = tasks.map(task => {
            const { targetCount, dataSource, ...rest } = task;
            return {
                ...rest,
                target_count: targetCount,
                data_source: dataSource,
                project: projectId, // Associate tasks with the project
            }
        });

        const { error: tasksError } = await supabase.from("tasks").insert(tasksData);
        if (tasksError) {
            console.error("Database error:", tasksError.message);
            return { success: false, message: "Failed to save tasks" };
        }
    }

    // Insert project invitations
    if (participationLevel === ParticipationLevel.RESTRICTED && participants && participants.length > 0) {
        const invitations = participants.map(p => ({
            user_id: p.id,
            project_id: projectId,
            type: RequestType.INVITATION,
            requested_at: status === 'draft' ? undefined : new Date().toISOString(),
        }));

        const { error: invitationsError } = await supabase.from("participation_requests").insert(invitations);
        if (invitationsError) {
            console.error("Database error:", invitationsError.message);
            return { success: false, message: "Failed to save participation requests" };
        }
    }
    return { success: true, message: "Project created successfully!" };
};