"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui/form";
import { banDurationInputSchema } from "@/src/types/ban-duration-form-data";

export function BanUserDialog({ onConfirm, onClose }: { onConfirm: (durationFormatted: string) => void, onClose: () => void }) {
    const [open, setOpen] = useState(true);
    const [confirmed, setConfirmed] = useState(false);

    const form = useForm({
        resolver: zodResolver(banDurationInputSchema),
        defaultValues: { days: "", hours: "", minutes: "" },
    });

    const formatDuration = () => {
        const data = form.getValues();
        let duration = "";
        if (data.days !== "" && data.days !== "0") duration += `${data.days} day(s) `;
        if (data.hours !== "" && data.hours !== "0") duration += `${data.hours} hour(s) `;
        if (data.minutes !== "" && data.minutes !== "0") duration += `${data.minutes} minute(s)`;
        return duration.trim();
    };

    const handleBan = () => {
        const data = form.getValues();
        let duration = "";
        const days = data.days === "" ? 0 : parseInt(data.days);
        const hours = (data.hours === "" ? 0 : parseInt(data.hours)) + 24 * days;
        const minutes = data.minutes === "" ? 0 : parseInt(data.minutes);

        if (hours) duration += `${hours}h`;
        if (minutes) duration += `${minutes}m`;

        onConfirm(duration);
        setOpen(false);
        setConfirmed(false);
        form.reset();
    };

    const handleConfirm = () => {
        setConfirmed(true);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(open) => {
                setOpen(open);
                !open && onClose()
            }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{confirmed ? "Confirm Ban" : "Set Ban Duration"}</DialogTitle>
                </DialogHeader>

                {!confirmed ? (
                    <Form {...form}>
                        <form className="space-y-4" onSubmit={form.handleSubmit(handleConfirm)}>
                            <div className="grid grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="days"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-green">Days</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="number" placeholder="days" />
                                            </FormControl>
                                            <FormMessage></FormMessage>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="hours"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-green">Hours</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="number" placeholder="hours" />
                                            </FormControl>
                                            <FormMessage></FormMessage>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="minutes"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-green">Minutes</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="number" placeholder="minutes" />
                                            </FormControl>
                                            <FormMessage></FormMessage>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit">
                                    Continue
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                ) : (
                    <div className="space-y-4">
                        <p className="font-retro">Are you sure you want to ban this user for <strong>{formatDuration()}</strong>?</p>
                        <DialogFooter>
                            <Button variant="ghost" onClick={() => setConfirmed(false)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleBan}>
                                Confirm Ban
                            </Button>
                        </DialogFooter>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}