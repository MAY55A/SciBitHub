"use server";

import { ReportStatus } from "@/src/types/enums";
import { createAdminClient } from "@/src/utils/supabase/admin";

const supabase = createAdminClient();

export const updateReportStatus = async (id: string, status: ReportStatus) => {
    const { error, data: report } = await supabase.from('reports').update({status}).eq('id', id).select('reporter, reported_type, reported_link').single();

    if (error) {
        console.log("Error updating status:", error.message);
        return { success: false, message: "Failed to update report status." };
    }

    const notification = {
        recipient_id: report.reporter,
        message_template: `Your report to this ${report.reported_type} has been ${status}.`,
        action_url: report.reported_link,
    };

    const { error: notifError } = await supabase.from("notifications").insert(notification);
    if (notifError) {
        console.log("Database notification error:", notifError.message);
    }

    return { success: true, message: `Report ${status} successfully.` };
};

export const deleteReport = async (id: string) => {
    const { error } = await supabase.from('reports').delete().eq('id', id);

    if (error) {
        console.log("Error deleting report:", error.message);
        return { success: false, message: "Failed to delete report." };
    }

    return { success: true, message: `Report deleted successfully.` };
};

export const deleteReports = async (ids: string[]) => {
    const { error } = await supabase.from('reports').delete().in('id', ids);

    if (error) {
        console.log("Error deleting reports:", error.message);
        return { success: false, message: "Failed to delete reports." };
    }

    return { success: true, message: `Reports deleted successfully.` };
}