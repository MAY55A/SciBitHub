"use client"

import { CustomAlertDialog } from "@/src/components/custom/alert-dialog";
import { softDeleteAccount } from "@/src/utils/account-actions";
import { useAuth } from "@/src/contexts/AuthContext";
import { useState } from "react";
import { useToast } from "@/src/hooks/use-toast";
import { UserRole } from "@/src/types/enums";

export default function DeleteAccount() {
    const { user } = useAuth();
    const [isDeleting, setIsDeleting] = useState(false);
    const { toast } = useToast();


    const deleteAccount = async () => {
        if (!user || isDeleting) return;
        setIsDeleting(true);
        const res = await softDeleteAccount(user.id, user.username);
        setIsDeleting(false);
        toast({
            description: res.message,
            variant: res.success ? "default" : "destructive",
        });
        if (res.success) {
            window.location.href = '/';
        }
    }

    return (
        <div className="flex flex-col w-full max-w-md p-4 gap-16 mt-16 [&>input]:mb-4">
            <h1 className="text-2xl font-medium">Delete Account</h1>
            <p className="text-sm text-foreground/60">
                Deleting your account will remove your ability to sign in and mark your profile as deleted. 
                However, your {user?.role === UserRole.RESEARCHER ? "projects" : "contributions"}, discussions, forum topics, and replies will remain available to others under "Deleted user".
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
