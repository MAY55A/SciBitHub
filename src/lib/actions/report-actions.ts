"use server";

import { createClient } from "@/src/utils/supabase/server";
import { ReportInputData } from "@/src/types/report-form-data";
import { NotificationTarget } from "@/src/types/enums";

export const createReport = async (data: ReportInputData) => {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();

    if (!user.data.user) {
        return { success: false, message: "You are not authenticated." };
    }

    if (!data) {
        return { success: false, message: "Report data is required." };
    }

    const report = {
        ...data,
        reporter: user.data.user.id,
    };

    const { error, data: reportData } = await supabase.from("reports").insert(report).select("id").single();
    if (error) {
        console.log("Database error:", error.message);
        return { success: false, message: "Failed to submit report." };
    }
    
    // Send notification to all admins
    const notification = {
        target: NotificationTarget.TO_ALL_ADMINS,
        message_template: `{user.username} submitted a new reported on a ${data.reported_type} ⚠ .`,
        user_id: user.data.user.id,
        action_url: `/admin/reports?id=${reportData.id}`
    }

    const { error: notifError } = await supabase.from("notifications").insert(notification);
    if (notifError) {
        console.log("Database notification error:", notifError.message);
    }

    return { success: true, message: "Report submitted successfully." };
};