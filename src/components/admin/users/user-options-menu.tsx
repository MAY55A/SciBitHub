"use client"

import { Ellipsis, TriangleAlert } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu";
import { User } from "@/src/types/models";
import { useRouter } from "next/navigation";
import { CustomAlertDialog } from "@/src/components/custom/alert-dialog";
import { useToast } from "@/src/hooks/use-toast";
import { UserRole } from "@/src/types/enums";
import { alertUser, deleteUsers, updateBanStatus, updateVerified } from "@/src/lib/actions/admin/users-actions";
import { BanUserDialog } from "./ban-user-dialog";
import UserFormDialog from "./user-form-dialog";
import UserDetailsDialog from "./user-details-dialog";
import { useState } from "react";
import { AlertUserDialog } from "./alert-user-dialog";

export function UserOptionsMenu({
    user, updateRow, removeRow
}: {
    user: User, updateRow: (field: string, data: any) => void, removeRow: () => void
}) {
    const [showDialog, setShowDialog] = useState("");
    const router = useRouter();
    const { toast } = useToast();
    const isBanned = user.banned_until && new Date(user.banned_until) > new Date();

    const handleDelete = async (deletionType: "soft" | "hard") => {
        const res = await deleteUsers([user.id], [user.username], deletionType);
        toast({
            title: res.success ? "Success !" : "Error !",
            description: res.message,
            variant: res.success ? "default" : "destructive",
        });

        if (res.success) {
            if (deletionType === "hard") {
                removeRow();
            } else {
                updateRow("deleted_at", new Date().toISOString());
            }
        }
    }

    const toggleBanStatus = async (duration: string, banned_until: string | null) => {
        const res = await updateBanStatus(user.id, duration);
        toast({
            title: res.success ? "Success !" : "Error !",
            description: res.message,
            variant: res.success ? "default" : "destructive",
        });

        if (res.success) {
            updateRow("banned_until", banned_until);
            setShowDialog("");
        }
    }


    const handleAlert = async (message: string) => {
        const res = await alertUser(user.id, message);
        toast({
            title: res.success ? "Success !" : "Error !",
            description: res.message,
            variant: res.success ? "default" : "destructive",
        });
        setShowDialog("");
    }

    const toggleVerifiedStatus = async (isVerified: boolean) => {
        const res = await updateVerified(user.id, isVerified, user.metadata);
        toast({
            title: res.success ? "Success !" : "Error !",
            description: res.message,
            variant: res.success ? "default" : "destructive",
        });

        if (res.success) {
            updateRow("metadata.isVerified", isVerified);
        }
    }

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-6 w-6 p-0"><Ellipsis size={15} /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-60">
                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            className="px-4"
                            onClick={() => setShowDialog("user-details")}>
                            View Account Details
                        </DropdownMenuItem>
                        {!user.deleted_at && <>
                            <DropdownMenuItem
                                className="px-4"
                                disabled={!!user.deleted_at}
                                onClick={() => router.push(`/users/${user.id}`)}>
                                Visit Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="px-4"
                                onClick={() => setShowDialog("edit-account")}>
                                Edit Account
                            </DropdownMenuItem>
                            {user.role === UserRole.RESEARCHER && user.metadata?.isVerified &&
                                <DropdownMenuItem
                                    className="px-4"
                                    onClick={() => toggleVerifiedStatus(false)}>
                                    Unmark as Verified
                                </DropdownMenuItem>
                            }
                            {user.role === UserRole.RESEARCHER && !user.metadata?.isVerified &&
                                <DropdownMenuItem
                                    className="px-4"
                                    onClick={() => toggleVerifiedStatus(true)}>
                                    Mark as Verified
                                </DropdownMenuItem>
                            }
                        </>}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    {!user.deleted_at &&
                        <DropdownMenuItem
                            className="px-4 hover:text-yellow-600"
                            onClick={() => setShowDialog("alert-user")}>
                            Alert User
                        </DropdownMenuItem>
                    }
                    {!user.deleted_at && (
                        isBanned
                            ? <DropdownMenuItem
                                onSelect={(event) => {
                                    event.preventDefault(); // Prevent dialog from closing immediately when opened
                                }}
                                className="hover:text-destructive">
                                <CustomAlertDialog
                                    triggerText="Unban User"
                                    buttonVariant="ghost"
                                    title="Confirm Unban"
                                    description="Are you sure you want to unban this user ?"
                                    confirmText="Confirm Unban"
                                    onConfirm={() => toggleBanStatus("none", null)}
                                    buttonClass="h-full hover:text-destructive pl-0"
                                />
                            </DropdownMenuItem>
                            : <DropdownMenuItem
                                className="px-4 hover:text-destructive"
                                onClick={() => setShowDialog("ban-user")}>
                                Ban User
                            </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    {!user.deleted_at &&
                        <DropdownMenuItem
                            onSelect={(event) => {
                                event.preventDefault(); // Prevent dialog from closing immediately when opened
                            }}
                            className="hover:text-destructive">
                            <CustomAlertDialog
                                triggerText="Delete User"
                                buttonVariant="ghost"
                                confirmButtonVariant="destructive"
                                title="This action CANNOT be undone !"
                                description="The user's authentication account will be permanently deleted. Their data in the system will remain for auditing or record-keeping purposes, but they will no longer be able to log in."
                                confirmText="Delete User"
                                onConfirm={() => handleDelete("soft")}
                                buttonClass="h-full hover:text-destructive pl-0"
                            />
                        </DropdownMenuItem>
                    }
                    <DropdownMenuItem
                        onSelect={(event) => {
                            event.preventDefault(); // Prevent dialog from closing immediately when opened
                        }}
                        className="hover:text-destructive">
                        <CustomAlertDialog
                            triggerText="Permanently Delete"
                            buttonIcon={TriangleAlert}
                            buttonVariant="ghost"
                            confirmButtonVariant="destructive"
                            title="This action CANNOT be undone !"
                            description="The user's authentication account and all their associated data will be permanently deleted from the system."
                            confirmText="Permanently Delete User"
                            onConfirm={() => handleDelete("hard")}
                            buttonClass="h-full text-destructive pl-0"
                        />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu >
            {
                showDialog === "edit-account" &&
                <UserFormDialog
                    data={{ ...user, researcherType: user.metadata?.researcherType }}
                    onUpdate={(data: any) => updateRow("", data)} // Update the entire row with the new data
                    onClose={() => setShowDialog("")} />
            }
            {
                showDialog === "user-details" &&
                <UserDetailsDialog
                    user={user}
                    onClose={() => setShowDialog("")} />
            }
            {
                showDialog === "alert-user" &&
                <AlertUserDialog onConfirm={handleAlert} onClose={() => setShowDialog("")}/>
            }
            {
                showDialog === "ban-user" &&
                <BanUserDialog onConfirm={toggleBanStatus} onClose={() => setShowDialog("")}/>
            }
        </div >
    )
}