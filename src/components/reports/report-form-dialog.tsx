"use client"

import { useEffect, useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog";
import { useToast } from "@/src/hooks/use-toast";
import { useForm } from "react-hook-form";
import { ReportInputData, reportInputDataSchema } from "@/src/types/report-form-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { createReport } from "@/src/utils/report-actions";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { ReportReason } from "@/src/types/enums";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Flag } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { useAuth } from "@/src/contexts/AuthContext";
import { createClient } from "@/src/utils/supabase/client";


export default function ReportFormDialog({ id, type }: { id: string, type: string }) {
    const [open, setOpen] = useState(false);
    const [hasConfirmed, setHasConfirmed] = useState(false);
    const [hasReported, setHasReported] = useState(false);
    const { user } = useAuth();
    const { toast } = useToast();

    const form = useForm({
        resolver: zodResolver(reportInputDataSchema),
        defaultValues: { reported: id, reported_type: type },
    });

    async function checkReported() {
        const supabase = createClient();
        const { data } = await supabase
            .from("reports")
            .select("id")
            .eq("reported", id)
            .eq("reporter", user?.id)
            .maybeSingle();

        setHasReported(data !== null);
    }

    useEffect(() => {
        checkReported();
    }, [])

    async function handleSubmit(formData: ReportInputData) {
        const res = await createReport(formData);

        toast({
            description: res.message,
            variant: res.success ? "default" : "destructive",
        });

        if (res.success) {
            document.body.style.overflow = "";
            setHasReported(true);
            setOpen(false);
        }
    }

    return (
        //fix overflow issue when dialog is closed
        <Dialog open={open} onOpenChange={(open) => { setOpen(open); if (!open) document.body.style.overflow = ""; }}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    title="report"
                    onClick={() => setOpen(true)}
                >
                    <Flag size={15} color="red" opacity={0.5} />
                </Button>
            </DialogTrigger>
            {hasReported ?
                <DialogContent>
                    <DialogTitle className="m-8 text-md font-normal">You’ve already reported this item.<br/> Thank you for your feedback.</DialogTitle>
                </DialogContent>
                : <DialogContent className="lg:min-w-[700px] md:min-w-[700px] sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            Report {type}
                        </DialogTitle>
                        <DialogDescription>
                            Enter details about the cause of this report.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 p-4 max-h-[80vh] overflow-y-auto">
                            <FormField
                                control={form.control}
                                name="reason"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-primary">Reason</FormLabel>
                                        <RadioGroup
                                            {...field}
                                            defaultValue={field.value}
                                            onValueChange={field.onChange}
                                            className="w-full flex flex-col gap-4 px-6"
                                        >
                                            {Object.values(ReportReason).map(reason => (
                                                <div className="flex items-center space-x-2" key={reason}>
                                                    <RadioGroupItem
                                                        value={reason}
                                                        id={reason}
                                                    />
                                                    <Label htmlFor={reason}>{reason}</Label>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                        <FormMessage></FormMessage>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-primary">Additional Details</FormLabel>
                                        <FormControl>
                                            <textarea
                                                {...field}
                                                placeholder="Add any context or explanation you think would help us review this report..."
                                                className="min-h-28 border p-2 w-full rounded placeholder:text-muted-foreground text-sm" />
                                        </FormControl>
                                        <FormMessage></FormMessage>
                                    </FormItem>
                                )}
                            />
                            <DialogFooter className="pt-8 gap-2">
                                <div className="items-top flex space-x-2">
                                    <Checkbox id="term"
                                        onCheckedChange={(checked) => setHasConfirmed(checked.valueOf() as boolean)}
                                        checked={hasConfirmed}
                                    />
                                    <div className="grid gap-1.5 leading-none">
                                        <Label
                                            htmlFor="term"
                                            className={hasConfirmed ? "opacity-100" : "opacity-50"}
                                        >
                                            I confirm that this report is accurate and made in good faith.
                                            I understand that I cannot delete or edit this report once submitted.
                                        </Label>
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    disabled={!hasConfirmed || form.formState.isSubmitting}
                                >
                                    {form.formState.isSubmitting ? "Submitting..." : "Submit"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>}
        </Dialog>
    );
}