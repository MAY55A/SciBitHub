"use client"

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog";
import { useToast } from "@/src/hooks/use-toast";
import { useRouter } from "next/navigation";
import { RequestType } from "@/src/types/enums";
import { createRequests } from "@/src/utils/request-actions";
import ContributorsInput from "../custom/contributors-input";
import { PublicUser } from "@/src/types/models";


export default function RequestFormDialog({ projectId }: { projectId: string }) {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [invitedUsers, setInvitedUsers] = useState<PublicUser[]>([]);
    const { toast } = useToast();
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setIsSubmitting(true);
        const res = await createRequests(projectId, invitedUsers.map(u => u.id), RequestType.INVITATION);
        setIsSubmitting(false);

        toast({
            description: res.message,
            variant: res.success ? "default" : "destructive",
        });

        if (res.success) {
            router.refresh();
            document.body.style.overflow = "";
            setOpen(false);
        }
    }

    return (
        //fix overflow issue when dialog is closed
        <Dialog open={open} onOpenChange={(open) => { setOpen(open); if (!open) document.body.style.overflow = ""; }}>
            <DialogTrigger asChild>
                <Button
                    onClick={() => setOpen(true)}>+ Invite Contributor</Button>
            </DialogTrigger>
            <DialogContent className="lg:min-w-[700px] md:min-w-[700px] sm:max-w-[425px]">
                <form onSubmit={handleSubmit} className="space-y-4 p-4">
                    <DialogHeader>
                        <DialogTitle>
                            Invite Contributor
                        </DialogTitle>
                        <DialogDescription>
                            Choose user(s) to invite as contributor(s) to this project.
                        </DialogDescription>
                    </DialogHeader>
                    <ContributorsInput value={invitedUsers} onChange={setInvitedUsers} />
                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={isSubmitting || invitedUsers.length === 0}
                        >
                            {isSubmitting ? "Inviting..." : "Invite"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}