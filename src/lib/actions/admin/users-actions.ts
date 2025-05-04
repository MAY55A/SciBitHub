"use server";

import { createAdminClient } from "@/src/utils/supabase/admin";
import { BasicUserInputData } from "@/src/types/user-form-data";

export const addAdmin = async () => {
    console.log("Adding admin...");
    const supabase = createAdminClient();
    const user = await supabase.auth.getUser();
    const res = await supabase.auth.admin.updateUserById(user!.data!.user!.id, {
        app_metadata: { role: 'admin' }
    });
    console.log(res);
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
    return { success: true, message: "User updated successfully.", user: updatedUser };
};

export const updateBanStatus = async (userId: string, duration: string) => {
    const supabase = createAdminClient();

    const { error: authError, data: { user } } = await supabase.auth.admin.updateUserById(userId, { ban_duration: duration });
    if (authError) {
        console.log("Error updating ban status:", authError.message);
        return { success: false, message: "Failed to update ban status." };
    }

    return { success: true, message: duration === "none" ? "User unbanned successfully." : "User banned successfully.", banned_until: user?.banned_until };
};


export const updateVerified = async (userId: string, isVerified: boolean, metadata: any) => {
    const supabase = createAdminClient();
    const newMetadata = { ...metadata, isVerified };
    const { error } = await supabase.from('users').update({ metadata: newMetadata }).eq('id', userId);

    if (error) {
        console.log("Error updating 'is verified' status:", error.message);
        return { success: false, message: "Failed to update 'is verified' status." };
    }
    return { success: true, message: isVerified ? "Researcher marked as verified." : "Researcher unmarked as verified." };
};

export const deleteUser = async (id: string) => {
    const supabase = createAdminClient();
    const { error } = await supabase.from('users').update({ deleted_at: new Date().toISOString() }).eq('id', id);
    if (error) {
        console.log("Error updating deleted_at:", error.message);
        return { success: false, message: "Failed to delete user." };
    }

    const { error: authError } = await supabase.auth.admin.deleteUser(id, true);
    if (authError) {
        console.log("Error deleting account:", authError.message);
        return { success: false, message: "Failed to delete account." };
    }

    return { success: true, message: "User deleted successfully." };
};