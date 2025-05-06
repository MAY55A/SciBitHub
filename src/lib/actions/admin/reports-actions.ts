"use server";

import { ReportStatus } from "@/src/types/enums";
import { createAdminClient } from "@/src/utils/supabase/admin";

const supabase = createAdminClient();

export const updateReportStatus = async (id: string, status: ReportStatus) => {
    const { error } = await supabase.from('reports').update({status}).eq('id', id);

    if (error) {
        console.log("Error updating status:", error.message);
        return { success: false, message: "Failed to update report status." };
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