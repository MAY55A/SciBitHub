'use client';

import { useAuth } from "@/src/contexts/AuthContext";
import { useToast } from "@/src/hooks/use-toast";
import { useEffect, useState } from "react";
import { createRequests } from "@/src/utils/request-actions";
import { RequestType } from "@/src/types/enums";
import { createClient } from "@/src/utils/supabase/client";
import { CustomAlertDialog } from "../custom/alert-dialog";
import Link from "next/link";

export function RestrictedProjectMessage({ projectId, canSendRequest }: { projectId: string, canSendRequest: boolean }) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasInvitation, setHasInvitation] = useState(false);
    const [hasRequested, setHasRequested] = useState(false);
    const supabase = createClient();


    const getExistingRequests = async () => {
        const { data: existingInvitation } = await supabase.
            from("participation_requests").
            select("id")
            .eq("project_id", projectId)
            .eq("user_id", user!.id)
            .eq("type", RequestType.INVITATION)
            .is("deleted_at", null)
            .limit(1)
            .single();
        if (existingInvitation) {
            setHasInvitation(true);
            return;
        }

        const { data: previousRequest } = await supabase.
            from("participation_requests").
            select("id")
            .eq("project_id", projectId)
            .eq("user_id", user!.id)
            .eq("type", RequestType.APPLICATION)
            .is("deleted_at", null)
            .limit(1)
            .single();
        if (previousRequest) {
            setHasRequested(true);
            return;
        }
    }

    useEffect(() => {
        if (!!user && canSendRequest) {
            getExistingRequests();
        }
    })

    const sendRequest = async () => {
        setIsSubmitting(true);
        const res = await createRequests(projectId, [user!.id], RequestType.APPLICATION);
        setIsSubmitting(false);
        toast({
            title: res.success ? "Request sent" : "Error",
            description: res.message,
            variant: res.success ? "default" : "destructive",
        })
    }


    return (
        <div className="w-full h-80 flex-col justify-center rounded-lg p-10 py-32 my-8 border">
            <h3 className="text-center">This project is <strong className="text-primary t">Restricted</strong></h3>
            {hasInvitation ?
                <p className="text-center text-sm text-muted-foreground">
                    You have been invited to this project.<br />
                    <Link href={"/profile/participation-requests"} className="underline">check your invitations</Link>
                </p>
                : hasRequested ?
                    <p className="text-center text-sm text-muted-foreground">You have already sent a participation request.</p>
                    : canSendRequest &&
                    <p className="text-center text-sm text-muted-foreground">
                        You can
                        <CustomAlertDialog
                            triggerText="send a request"
                            buttonVariant="link"
                            buttonClass="text-green"
                            buttonDisabled={isSubmitting}
                            title="Request to participate"
                            description="You can send a request to the project creator to participate in this project."
                            confirmText="Send request"
                            onConfirm={sendRequest} />
                        for participation.
                    </p>
            }
        </div>
    );
}