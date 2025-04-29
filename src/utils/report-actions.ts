"use server";

import { createClient } from "@/src/utils/supabase/server";
import { ReportInputData } from "../types/report-form-data";

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

    const { error } = await supabase.from("reports").insert(report);
    if (error) {
        console.error("Database error:", error.message);
        return { success: false, message: "Failed to submit report." };
    }

    return { success: true, message: "Report submitted successfully." };
};