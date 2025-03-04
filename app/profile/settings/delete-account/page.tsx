"use client"

import { CustomAlertDialog } from "@/src/components/custom/alert-dialog";
import { softDeleteAccount } from "@/src/utils/account-actions";
import { useAuth } from "@/src/contexts/AuthContext";
import { useState } from "react";

export default function DeleteAccount() {
    const { user } = useAuth();
    const [isDeleting, setIsDeleting] = useState(false);

    const deleteAccount = async () => {
        if (!user || isDeleting) return;
        setIsDeleting(true);
        const res = await softDeleteAccount(user.id);
        setIsDeleting(false);
        if (res.success) {
            window.location.href = '/';
        } else {
            console.error("Failed to delete account:", res.message);
            alert("Failed to delete account. Please try again later.");
        }
    }

    return (
        <div className="flex flex-col w-full max-w-md p-4 gap-16 mt-16 [&>input]:mb-4">
            <h1 className="text-2xl font-medium">Delete Account</h1>
            <p className="text-sm text-foreground/60">
                Deleting your account will permanently remove your profile and personal information. However, your projects and discussions will remain available for others.
            </p>
            <CustomAlertDialog
                buttonVariant="destructive"
                buttonDisabled={!user || isDeleting}
                triggerText={isDeleting ? 'Deleting...' : 'Delete'}
                title={"Warning: This action is irreversible!"}
                description={"Are you sure you want to delete your account? This action cannot be undone."}
                confirmText={isDeleting ? 'Deleting...' : 'Yes, Delete My Account'}
                confirmButtonVariant="destructive"
                onConfirm={deleteAccount}
            />
        </div>
    );
}
