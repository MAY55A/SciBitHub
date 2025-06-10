"use client"

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { User } from "@/src/types/models";
import { UserRole } from "@/src/types/enums";
import { Badge } from "@/src/components/ui/badge";
import { format } from "date-fns";




export default function UserDetailsDialog({ user, onClose }: { user: User, onClose: () => void }) {
    const [open, setOpen] = useState(true);
    const isBanned = user.banned_until && new Date(user.banned_until) > new Date();

    return (
        <Dialog
            open={open}
            onOpenChange={(open) => {
                setOpen(open);
                !open && onClose()
            }}
        >
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>User Details</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 text-sm font-retro">
                    <div>
                        <span className="font-semibold">ID:</span> {user.id}
                    </div>

                    <div>
                        <span className="font-semibold">Username:</span> {user.username}
                    </div>

                    <div>
                        <span className="font-semibold">Email:</span> {user.email}
                    </div>

                    <div>
                        <span className="font-semibold">Role:</span> {user.role}
                    </div>

                    {user.role === UserRole.RESEARCHER && user.metadata?.researcherType && (
                        <div>
                            <span className="font-semibold">Researcher Type:</span> {user.metadata.researcherType}
                        </div>
                    )}

                    {user.role === UserRole.RESEARCHER && (
                        <div>
                            <span className="font-semibold">Is Verified:</span> {user.metadata?.isVerified ? "Yes" : "No"}
                        </div>
                    )}

                    {user.country && (
                        <div>
                            <span className="font-semibold">Country:</span> {user.country}
                        </div>
                    )}

                    <div>
                        <span className="font-semibold">Status:</span>{" "}
                        <Badge
                            variant="secondary"
                            className={
                                user.deleted_at
                                    ? "text-destructive border-destructive"
                                    : isBanned
                                        ? "text-yellow-500 border-yellow-500"
                                        : "text-green-500 border-green-500"
                            }
                        >
                            {user.deleted_at ? "Deleted"
                                : isBanned
                                    ? "Banned"
                                    : "Active"
                            }
                        </Badge>
                    </div>

                    {user.banned_until && (
                        <div>
                            <span className="font-semibold">Banned Until:</span>{" "}
                            {format(new Date(user.banned_until), "PPPpp")}
                        </div>
                    )}

                    {user.created_at && (
                        <div>
                            <span className="font-semibold">Created At:</span>{" "}
                            {format(new Date(user.created_at), "PPPpp")}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}