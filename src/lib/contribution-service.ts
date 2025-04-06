import { ModerationLevel, ValidationStatus } from "../types/models";
import { uploadFileToMinIO } from "../utils/minio/client";
import { createClient } from "../utils/supabase/client";

export const createContribution = async (data: any, taskId: string, moderation: ModerationLevel) => {
    const supabase = createClient();
    const user = await supabase.auth.getUser();

    if (!user.data.user) {
        return { success: false, message: "You are not authenticated." };
    }

    if (!data) {
        return { success: false, message: "Contribution data is required." };
    }

    const userId = user.data.user.id;
    const contributionDir = `contributions/task-${taskId}`;

    // Function to handle file uploads
    const uploadFile = async (file: File) => {
        const filePath = `${contributionDir}/${Date.now()}-${userId}`;
        try {
            await uploadFileToMinIO(file, filePath);
            return filePath;
        } catch (error) {
            console.error("Error uploading file:", error);
            throw new Error(`Failed to upload file: ${file.name}`);
        }
    };

    // Process data fields, replacing files with storage paths
    const processedData = { ...data };
    for (const key in data) {
        if (data[key].files) {
            const fileArray = Array.from(data[key].files as FileList);
            processedData[key].files = await Promise.all(fileArray.map(uploadFile));
        }
    }

    // Create contribution object
    const contribution = {
        task: taskId,
        user: userId,
        data: processedData,
        status: moderation === ModerationLevel.NONE ? ValidationStatus.APPROVED : ValidationStatus.PENDING,
    };

    // Insert into Supabase
    const { error } = await supabase.from("contributions").insert(contribution);
    if (error) {
        console.error("Database error:", error.message);
        return { success: false, message: "Failed to save contribution" };
    }

    return { success: true, message: "Contribution saved successfully" };
};


export const hasUserContributed = async (userId: string, taskId: string): Promise<boolean> => {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('contributions')
        .select('id')
        .eq('user', userId)
        .eq('task', taskId)
        .maybeSingle();

    if (error) {
        console.error("Error fetching contribution:", error);
        return false;
    }

    return !!data;
};