"use client"

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog";
import { useToast } from "@/src/hooks/use-toast";
import { updateSummary } from "@/src/lib/actions/project-actions";
import { MarkdownEditor } from "../custom/markdown-editor";
import { useRouter } from "next/navigation";


export default function ResultsSummaryFormDialog({ projectId, currentSummary }: { projectId: string, currentSummary: string }) {
    const [open, setOpen] = useState(false);
    const [summary, setSummary] = useState<string>(currentSummary);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    async function editSummary(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setIsSubmitting(true);
        const res = await updateSummary(projectId, summary.length ? summary : null);
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
                    variant="outline"
                    onClick={() => setOpen(true)}>{currentSummary && currentSummary.length ? "Edit Summary" : "Add Summary"}</Button>
            </DialogTrigger>
            <DialogContent className="lg:min-w-[700px] md:min-w-[700px] sm:max-w-[425px]">
                <form onSubmit={editSummary} className="space-y-4 p-4">
                    <DialogHeader>
                        <DialogTitle>
                            {currentSummary && currentSummary.length ? "Edit Results Summary" : "Add Your Own Results Summary"}
                        </DialogTitle>
                        <DialogDescription>
                            Write your results summary here.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[70vh] overflow-y-auto">
                        <MarkdownEditor
                            value={summary}
                            onChange={setSummary}
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={isSubmitting || summary === currentSummary}
                        >
                            {isSubmitting ? "Saving..." : "Save"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}