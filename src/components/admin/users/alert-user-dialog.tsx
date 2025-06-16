"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";

export function AlertUserDialog({ onConfirm, onClose }: { onConfirm: (msg: string) => void, onClose: () => void }) {
    const [open, setOpen] = useState(true);
    const [message, setMessage] = useState("");
    const [confirmed, setConfirmed] = useState(false);

    const handleAlert = () => {
        onConfirm(message);
        setOpen(false);
        setConfirmed(false);
        setMessage("");
    };

    const handleConfirm = () => {
        setConfirmed(true);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(open) => {
                setOpen(open);
                if (!open) {
                    document.body.style.overflow = "";
                    onClose();
                }
            }}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{confirmed ? "Confirm Alert" : "Set Alert Message"}</DialogTitle>
                </DialogHeader>

                {!confirmed ? (
                    <form>
                        <textarea
                            className="w-full max-h-80 overflow-y-auto mb-4 placeholder:text-muted-foreground font-retro p-4"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Enter your alert message here..." />
                        <DialogFooter>
                            <Button type="submit" onClick={handleConfirm} disabled={!message || message.length < 10}>
                                Continue
                            </Button>
                        </DialogFooter>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <p className="font-retro">
                            Are you sure you want to send the following alert to this user?<br />
                            <strong>"{message}"</strong>
                        </p>                        <DialogFooter>
                            <Button variant="ghost" onClick={() => setConfirmed(false)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleAlert}>
                                Confirm Alert
                            </Button>
                        </DialogFooter>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}