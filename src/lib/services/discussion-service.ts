import { DiscussionInputData } from "@/src/types/discussion-form-data";
import { NotificationType } from "@/src/types/enums";
import { deleteFromMinIO, uploadFileToMinIO } from "@/src/utils/minio/client";
import { createClient } from "@/src/utils/supabase/client";

export const createDiscussion = async (data: DiscussionInputData, files: File[]) => {
    const supabase = createClient();
    const user = await supabase.auth.getUser();

    if (!user.data.user) {
        return { success: false, message: "You are not authenticated." };
    }

    if (!data) {
        return { success: false, message: "Discussion data is required." };
    }

    const userId = user.data.user.id;

    const { error, data: discussion } = await supabase
        .from("discussions")
        .insert({ ...data, creator: userId })
        .select("id")
        .single();

    if (error || !discussion) {
        console.log("Database error:", error?.message);
        return { success: false, message: "Failed to create discussion." };
    }

    const uploadedPaths: string[] = [];
    let failedCount = 0;

    for (const file of files) {
        const filePath = `discussions/${discussion.id}/${file.name}`;
        try {
            await uploadFileToMinIO(file, filePath);
            uploadedPaths.push(filePath);
        } catch (err) {
            console.log("Failed to upload file:", file.name, err);
            failedCount++;
        }
    }

    if (uploadedPaths.length > 0) {
        const { error: updateError } = await supabase
            .from("discussions")
            .update({ files: uploadedPaths })
            .eq("id", discussion.id);

        if (updateError) {
            console.log("Failed to update discussion with file paths:", updateError.message);
            return {
                success: false,
                message: "Files uploaded but failed to update discussion.",
            };
        }
    }

    if (failedCount > 0) {
        return {
            success: true,
            message: `${uploadedPaths.length} file(s) uploaded. ${failedCount} failed.`,
        };
    }

    // notify admins
    const notification = {
        type: NotificationType.TO_ALL_ADMINS,
        message_template: `{user.username} created a new discussion {discussion.title} .`,
        discussion_id: discussion.id,
        user_id: userId,
        action_url: `/discussions/${discussion.id}`,
    }
    const { error: notifError } = await supabase.from("notifications").insert(notification);
    if (notifError) {
        console.log("Database notification error:", notifError.message);
    }

    return {
        success: true,
        message: "Discussion created successfully.",
    };
};

export const updateDiscussion = async (data: DiscussionInputData, newfiles: File[], keptFiles: string[]) => {
    const supabase = createClient();
    const user = await supabase.auth.getUser();

    if (!user.data.user) {
        return { success: false, message: "You are not authenticated." };
    }

    if (user.data.user.id !== data.creator) {
        return { success: false, message: "You are not authorized." };
    }

    if (!data) {
        return { success: false, message: "Discussion new data is required." };
    }

    // Upload new files and store their paths
    const newFilesPaths: string[] = [];
    let failedCount = 0;

    for (const file of newfiles) {
        const filePath = `discussions/${data.id}/${file.name}`;
        try {
            await uploadFileToMinIO(file, filePath);
            newFilesPaths.push(filePath);
        } catch (err) {
            console.log("Failed to upload file:", file.name, err);
            failedCount++;
        }
    }

    // Delete files not in keptFiles, and await all deletions
    const deletions = data.files?.map(async (file) => {
        if (!keptFiles.includes(file)) {
            await deleteFromMinIO(file);
        }
    });

    if (deletions?.length) {
        await Promise.all(deletions);
    }

    if (failedCount > 0) {
        return {
            success: true,
            message: `${newFilesPaths.length} file(s) uploaded. ${failedCount} failed.`,
        };
    }

    const { error } = await supabase
        .from("discussions")
        .update({ ...data, files: [...newFilesPaths, ...keptFiles], updated_at: new Date().toISOString() })
        .eq("id", data.id);

    if (error) {
        console.log("Database error:", error?.message);
        return { success: false, message: "Failed to save changes." };
    }

    return {
        success: true,
        message: "Changes saved successfully.",
    };
};