"use server";

import { createClient } from "@/src/utils/supabase/server";
import { UserInputData } from "../types/user-form-data";

export const updateEmail = async (newEmail: string) => {
    const supabase = await createClient();

    // Check if the new email is empty
    if (newEmail.length === 0) {
        return { success: false, message: 'New email required.' };
    }
    try {
        /*
        const identities = (await supabase.auth.getUser()).data.user?.identities;
        const noPassword = identities?.findIndex((provider) => provider.provider === 'email') === -1;
        const isNewEmailGmail = newEmail.endsWith('@gmail.com');

        // If the user doesnt have a password (Google-only signin) and the new email is not a Gmail, ask them to set a password
        if (noPassword && !isNewEmailGmail) {
            return { success: false, message: 'You are currently using google signin, please set a password before changing to a non-Gmail email.' };
        }
        */
        // Else update the email
        const { error } = await supabase.auth.updateUser({ email: newEmail });

        if (error) {
            return { success: false, message: error.message };
        }

        return { success: true, message: 'Please check your inbox to confirm the change.' };
    } catch {
        return { success: false, message: 'Error fetching current user details.' };
    }
};

export const updateInfo = async (data: Partial<UserInputData>) => {
    const supabase = await createClient();
    const currentUser = (await supabase.auth.getUser()).data.user;
    if (!currentUser) {
        return { success: false, message: "You are not authenticated." };
    }
    if (data.bio !== undefined) {
        const { data: user, error: fetchError } = await supabase
            .from('users')
            .select('metadata')
            .eq('id', currentUser.id)
            .single();

        if (fetchError) {
            console.error('Error fetching user metadata:', fetchError);
            return { success: false, message: 'Error fetching user metadata.' };
        }
        const updatedMetadata = {
            ...user.metadata, // Preserve existing fields
            bio: data.bio, // Update the interests field
        };
        const { error } = await supabase
            .from('users')
            .update({ username: data.username, country: data.country, metadata: updatedMetadata })
            .eq('id', currentUser.id);
        if (error) {
            console.error('Error updating user metadata:', error);
            return { success: false, message: 'Error updating user metadata.' };
        }
    } else {
        const { error } = await supabase
            .from('users')
            .update({ username: data.username, country: data.country })
            .eq('id', currentUser.id);
        if (error) {
            console.error('Error updating user info:', error);
            return { success: false, message: 'Error updating user info.' };
        }
    }
    return { success: true, message: "Profile updated successfully." };
};

export const updateMetadata = async (metadata: any) => {
    const supabase = await createClient();
    const currentUser = (await supabase.auth.getUser()).data.user;
    if (!currentUser) {
        return { success: false, message: "You are not authenticated." };
    }
    // Step 1: Fetch the existing metadata
    const { data: user, error: fetchError } = await supabase
        .from('users')
        .select('metadata')
        .eq('id', currentUser.id)
        .single();

    if (fetchError) {
        console.error('Error fetching user metadata:', fetchError);
        return { success: false, message: 'Error fetching user data.' };
    }

    // Step 2: Update the metadata
    const updatedMetadata = {
        ...user.metadata, // Preserve existing fields
        ...metadata, // Update the interests field
    };

    // Step 3: Save the updated metadata
    const { error: updateError } = await supabase
        .from('users')
        .update({ metadata: updatedMetadata })
        .eq('id', currentUser.id);

    if (updateError) {
        console.error('Error updating user metadata:', updateError);
        return { success: false, message: 'Error updating profile.' };
    }
    return { success: true, message: "Profile updated successfully." };
};

export const updateProfilePicture = async (userId: string, file: File) => {
    const supabase = await createClient();

    // Update the file in Supabase Storage
    const { error } = await supabase.storage
        .from('avatars')
        .update(userId, file);

    if (error) {
        console.error('Error uploading profile picture:', error);
        return { success: false, message: error.message };
    }

    // Generate a unique query parameter (timestamp)
    const timestamp = Date.now();
    // Get the public URL of the uploaded file
    const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(userId);

    const publicUrlWithTimestamp = `${publicUrlData.publicUrl}?v=${timestamp}`;

    // Save the new public URL to the user's profile
    const { error: updateError } = await supabase
        .from('users')
        .update({ profile_picture: publicUrlWithTimestamp })
        .eq('id', userId);

    if (updateError) {
        console.error('Error updating profile picture: ', updateError);
        return { success: false, message: 'Error updating profile picture.' };
    }

    return { success: true, message: 'Profile picture updated successfully.' };
};

export const removeProfilePicture = async (userId: string) => {
    const supabase = await createClient();

    // remove the file in Supabase Storage
    const { error } = await supabase.storage
        .from('avatars')
        .remove([userId]);

    if (error) {
        console.error('Error deleting profile picture:', error);
        return { success: false, message: error.message };
    }

    // remove the url from the database
    const { error: updateError } = await supabase
        .from('users')
        .update({ profile_picture: null })
        .eq('id', userId);

    if (updateError) {
        console.error('Error removing profile picture: ', updateError);
        return { success: false, message: 'Error removing profile picture.' };
    }
    return { success: true, message: 'Profile picture removed successfully.' };
};

// soft delete user account
export const softDeleteAccount = async (userId: string, userName: string) => {
    const supabase = await createClient();
    if (userId !== (await supabase.auth.getUser()).data.user?.id) {
        return { success: false, message: 'You are not authorized to delete this account.' };
    }
    try {
        // update deleted_at in database
        const { error: dbError } = await supabase
            .from('users')
            .update({
                deleted_at: new Date().toISOString(),
                username: `${userName} (deleted)`, // mark the username as deleted to allow reusing it
                profile_picture: null
            })
            .eq('id', userId);

        if (dbError) {
            console.error('Error deleting user from db:', dbError);
            throw dbError;
        }

        // delete the Supabase Auth account
        const { error: AuthError } = await supabase.auth.admin.deleteUser(userId);

        if (AuthError) {
            console.error('Error deleting Supabase Auth account:', AuthError);
            throw AuthError;
        }

        // remove profile picture in Supabase Storage to save space since it is not needed for auditing
        await supabase.storage
            .from('avatars')
            .remove([userId]);

        return { success: true, message: 'Account deleted successfully!' };
    } catch (error) {
        console.error('Error deleting user:', error);
        return { success: false, message: 'Failed to delete account.' };
    }
}