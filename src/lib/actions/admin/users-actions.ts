"use server";

import { createAdminClient } from "@/src/utils/supabase/admin";
import { BasicUserInputData } from "@/src/types/user-form-data";
import { NotificationType } from "@/src/types/enums";

export const adminResetPassword = async (userId: string, newPassword: string) => {
    const supabase = createAdminClient();
    const { error } = await supabase.auth.admin.updateUserById(userId, {
        password: newPassword
    }); // logs out after sussessful password reset

    if (error) {
        console.log("Error resetting password:", error.message);
        return { success: false, message: error.message };
    }
    return { success: true, message: "Password reset successfully, now logging out..." };
};

export const addUser = async (data: BasicUserInputData) => {
    const supabase = createAdminClient();
    const { data: username } = await supabase.from('users').select('username').eq('username', data.username).single();
    if (username) {
        return { success: false, message: "Username already exists." };
    }

    const { data: { user: authUser }, error: authError } = await supabase.auth.admin.createUser({
        email: data.email,
        password: data.password,
        app_metadata: { role: data.role },
    });
    if (authError || !authUser) {
        console.log("Error creating account:", authError?.message);
        return { success: false, message: authError?.message ?? "Failed to create new account." };
    }

    const userData = {
        id: authUser.id,
        username: data.username,
        role: data.role,
        metadata: {
            isVerified: data.role === "researcher" ? false : undefined,
            researcherType: data.researcherType
        }
    };

    const { data: user, error: dbError } = await supabase.from('users').insert(userData).select().single();
    if (dbError) {
        console.log("Error adding user:", dbError.message);
        console.log("Deleting account...");
        const { error: authError } = await supabase.auth.admin.deleteUser(authUser.id);
        if (authError) {
            console.log("Error deleting account:", authError.message);
        }
        return { success: false, message: "Failed to add new user." };
    }

    return { success: true, message: "New user added successfully.", user };
};


export const updateUser = async (data: BasicUserInputData) => {
    const supabase = createAdminClient();
    const { data: user } = await supabase.from('users').select('metadata').eq('id', data.id).single();
    // remove researcherType from metadata to allow updating it to undefined if the new researcherType is undefined
    const { researcherType, ...metadata } = user?.metadata;
    const userData = {
        username: data.username,
        role: data.role,
        metadata: {
            ...metadata, researcherType: data.researcherType
        }
    };
    const { error, data: updatedUser } = await supabase.from('users').update(userData).eq('id', data.id).select().single();
    if (error) {
        console.log("Error updating user:", error.message);
        return { success: false, message: "Failed to update user." };
    }

    const { error: authError } = await supabase.auth.admin.updateUserById(
        data.id!,
        {
            email: data.email,
            password: data.password,
            app_metadata: { role: data.role }
        });
    if (authError) {
        console.log("Error updating account:", authError.message);
        return { success: false, message: "Failed to update account." };
    }
    updatedUser.email = data.email;

    const notification = {
        recipient_id: data.id,
        message_template: `Your account has been updated by an admin !`,
        action_url: data.role === "admin" ? "/admin/account-settings" : "/profile/settings",
    };

    const { error: notifError } = await supabase.from("notifications").insert(notification);
    if (notifError) {
        console.log("Database notification error:", notifError.message);
    }

    return { success: true, message: "User updated successfully.", user: updatedUser };
};

export const updateBanStatus = async (userId: string, duration: string) => {
    const supabase = createAdminClient();

    const { error: authError, data: { user } } = await supabase.auth.admin.updateUserById(userId, { ban_duration: duration });
    if (authError) {
        console.log("Error updating ban status:", authError.message);
        return { success: false, message: "Failed to update ban status." };
    }
    const action = duration === "none" ? "unbanned" : "banned for " + duration;

    const notification = {
        recipient_id: userId,
        message_template: `Your account has been ${action} !`,
    };

    const { error: notifError } = await supabase.from("notifications").insert(notification);
    if (notifError) {
        console.log("Database notification error:", notifError.message);
    }

    return { success: true, message: `User ${action} successfully.` };
};


export const updateVerified = async (userId: string, isVerified: boolean, metadata: any) => {
    const supabase = createAdminClient();
    const newMetadata = { ...metadata, isVerified };
    const { error } = await supabase.from('users').update({ metadata: newMetadata }).eq('id', userId);

    if (error) {
        console.log("Error updating 'is verified' status:", error.message);
        return { success: false, message: "Failed to update 'is verified' status." };
    }
    const action = isVerified ? "marked as verified" : "unmarked as verified ";

    const notification = {
        recipient_id: userId,
        message_template: `Your researcher account has been ${action} !`,
    };

    const { error: notifError } = await supabase.from("notifications").insert(notification);
    if (notifError) {
        console.log("Database notification error:", notifError.message);
    }

    return { success: true, message: `Researcher ${action} successfully.` };
};

export const alertUser = async (userId: string, message: string) => {
    const supabase = createAdminClient();

    const notification = {
        recipient_id: userId,
        message_template: "You have a new alert from an admin: " + message,
        type: NotificationType.WARNING
    };

    const { error: notifError } = await supabase.from("notifications").insert(notification);
    if (notifError) {
        console.log("Database notification error:", notifError.message);
        return { success: false, message: "Failed to alert user." };
    }

    return { success: true, message: `User alerted successfully.` };
};

export const deleteUsers = async (ids: string[], usernames?: string[], deletionType: "soft" | "hard" = "soft") => {

    const supabase = createAdminClient();
    let deleted = 0;
    let failed = 0;

    for (let i = 0; i < ids.length; i++) {
        // Update deleted_at in database
        const { error: dbError, data } = deletionType === "soft"
            ? await supabase.from('users').update({
                deleted_at: new Date().toISOString(),
                username: `${usernames![i]} (deleted)`, // mark the username as deleted to allow reusing it
                profile_picture: null
            }).eq('id', ids[i])
            : await supabase.from('users').delete().eq('id', ids[i]).select("deleted_at").single();

        if (dbError) {
            console.log('Error deleting user from db:', dbError);
            failed++;
            continue;
        }

        // Delete the Supabase Auth account if not already deleted before
        if (!data?.deleted_at) {
            const { error: authError } = await supabase.auth.admin.deleteUser(ids[i]);
            if (authError) {
                console.log('Error deleting Supabase Auth account:', authError);
                failed++;
                continue;
            }
        }

        // Remove profile picture in Supabase Storage to save space since it is not needed for auditing
        await supabase.storage.from('avatars').remove([ids[i]]);
    }

    return { success: failed === 0, message: failed === 0 ? "User(s) deleted successfully." : `Deleted ${deleted} user(s), failed to delete ${failed} user(s).` };
};