"use client"

import { projectInputDataSchema, ProjectInputData } from "@/src/types/project-form-data";
import { ProjectStatus, ParticipationLevel, Scope, ProjectVisibility, ProjectVisibilityDescriptions, ParticipationLevelDescriptions, ModerationLevelDescriptions, ModerationLevel } from "@/src/types/enums";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form, FormDescription } from "../ui/form";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import ContributorsInput from "../custom/contributors-input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/src/lib/utils";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { useEffect, useState } from "react";
import CountrySelector from "../custom/countries-selector";
import { areEqualArrays } from "@/src/utils/utils";
import { CancelAlertDialog } from "./cancel-alert-dialog";

export function Step2({ data, onUpdate, onNext, onBack, onSaveStep, onSaveProject, dataChanged }: { data: ProjectInputData, onUpdate: (data: Partial<ProjectInputData>) => void, onNext: () => void, onBack: () => void, onSaveStep: () => void, onSaveProject: (data: Partial<ProjectInputData>, status: ProjectStatus) => void, dataChanged?: boolean }) {
    const form = useForm({
        resolver: zodResolver(projectInputDataSchema.pick({ visibility: true, participationLevel: true, moderationLevel: true, participants: true, scope: true, countries: true, deadline: true })),
        defaultValues: { ...data, countries: data.countries || undefined },
    });
    const [isSaved, setIsSaved] = useState(false);

    const saveData = (data: Partial<ProjectInputData>) => {
        if (data.participationLevel === ParticipationLevel.RESTRICTED && (!data.participants || data.participants.length < 2)) {
            form.setError("participants", { message: "You must choose at least two contributors." });
            return;
        }
        if (data.scope === Scope.REGIONAL && (!data.countries || data.countries.length === 0)) {
            form.setError("countries", { message: "You must choose at least one country." });
            return;
        }
        if (data.participationLevel === ParticipationLevel.OPEN) {
            data.participants = undefined;
        }
        if (data.scope === Scope.GLOBAL) {
            data.countries = undefined;
        }
        onUpdate({ ...data });
        setIsSaved(true);
        onSaveStep();
    };

    const regionValue = form.watch("scope");

    const watchedFields = form.watch();
    useEffect(() => {
        const same = watchedFields.visibility === data.visibility &&
            watchedFields.participationLevel === data.participationLevel &&
            watchedFields.moderationLevel === data.moderationLevel &&
            watchedFields.scope === data.scope && watchedFields.deadline === data.deadline &&
            areEqualArrays(watchedFields.countries, data.countries) &&
            areEqualArrays(watchedFields.participants, data.participants);
        setIsSaved(same);
    }, [JSON.stringify(watchedFields)]);

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(saveData, (error) => console.log(error))}
                className="w-full flex flex-col gap-12 p-6 shadow-lg rounded-lg border animate-fade-slide">
                <FormField
                    control={form.control}
                    name="visibility"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-primary">Visibility Level</FormLabel>
                            <FormDescription>Controls who can view the project's results</FormDescription>
                            <FormControl>
                                <RadioGroup {...field}
                                    value={field.value}
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        if (value === ProjectVisibility.RESTRICTED) {
                                            form.setValue("participationLevel", ParticipationLevel.RESTRICTED);
                                        }
                                    }}
                                    className="w-full flex gap-8 px-6 pt-4">
                                    {Object.values(ProjectVisibility).map(value =>
                                        <div className="flex items-center space-x-2" key={value}>
                                            <RadioGroupItem value={value} id={value} />
                                            <Label htmlFor={value}>{value}</Label>
                                        </div>
                                    )}
                                </RadioGroup>
                            </FormControl>
                            <FormDescription>
                                {ProjectVisibilityDescriptions[field.value as ProjectVisibility]}
                            </FormDescription>
                            <FormMessage></FormMessage>
                        </FormItem>
                    )}
                />
                {(() => {
                    const visibilityValue = form.watch("visibility");

                    useEffect(() => {
                        if (visibilityValue === ProjectVisibility.RESTRICTED) {
                            form.setValue("participationLevel", ParticipationLevel.RESTRICTED);
                        }
                    }, [visibilityValue]);

                    return (
                        <FormField
                            control={form.control}
                            name="participationLevel"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-primary">Participation Level</FormLabel>
                                    <FormDescription>Controls who can participate in tasks</FormDescription>
                                    <FormControl>
                                        <RadioGroup
                                            {...field}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            className="w-full flex gap-8 px-6 pt-4"
                                        >
                                            {Object.values(ParticipationLevel).map(value => (
                                                <div className="flex items-center space-x-2" key={value}>
                                                    <RadioGroupItem
                                                        value={value}
                                                        id={value}
                                                        disabled={visibilityValue === ProjectVisibility.RESTRICTED}
                                                    />
                                                    <Label htmlFor={value}>{value}</Label>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                    </FormControl>
                                    <FormDescription>
                                        {ParticipationLevelDescriptions[field.value as ParticipationLevel]}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    );
                })()}
                {form.getValues("participationLevel") === ParticipationLevel.RESTRICTED &&
                    <FormField
                        control={form.control}
                        name="participants"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-primary">Invite allowed contributors</FormLabel>
                                <FormControl>
                                    <ContributorsInput value={field.value} onChange={field.onChange} />
                                </FormControl>
                                <FormMessage></FormMessage>
                            </FormItem>
                        )}
                    />
                }
                <FormField
                    control={form.control}
                    name="scope"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-primary">Research Scope</FormLabel>
                            <FormDescription>Defines the geographical focus of the project</FormDescription>
                            <FormControl>
                                <RadioGroup {...field} value={field.value} onValueChange={field.onChange} className="w-full flex gap-8 px-6 pt-4">
                                    {Object.values(Scope).map(value =>
                                        <div className="flex items-center space-x-2" key={value}>
                                            <RadioGroupItem value={value} id={value} />
                                            <Label htmlFor={value}>{value}</Label>
                                        </div>
                                    )}
                                </RadioGroup>
                            </FormControl>
                            <FormDescription>
                                {ModerationLevelDescriptions[field.value as ModerationLevel]}
                            </FormDescription>
                            <FormMessage></FormMessage>
                        </FormItem>
                    )}
                />
                {regionValue === Scope.REGIONAL &&
                    <CountrySelector name="countries" control={form.control} multiple={true} />
                }
                <FormField
                    control={form.control}
                    name="moderationLevel"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-primary">Moderation Level</FormLabel>
                            <FormDescription>Defines how much moderation is applied to contributions</FormDescription>
                            <FormControl>
                                <RadioGroup {...field} value={field.value} onValueChange={field.onChange} className="w-full flex gap-8 px-6 pt-4">
                                    {Object.values(ModerationLevel).map(value =>
                                        <div className="flex items-center space-x-2" key={value}>
                                            <RadioGroupItem value={value} id={value} />
                                            <Label htmlFor={value}>{value}</Label>
                                        </div>
                                    )}
                                </RadioGroup>
                            </FormControl>
                            <FormDescription>
                                {ModerationLevelDescriptions[field.value as ModerationLevel]}
                            </FormDescription>
                            <FormMessage></FormMessage>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="deadline"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel className="text-primary">Deadline (optional)</FormLabel>
                            <FormDescription>Project end date or goal completion timeline</FormDescription>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="ghost"
                                            className={cn(
                                                "w-[240px] pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                format(field.value, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                            date < new Date()
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="w-full flex justify-between">
                    <CancelAlertDialog
                        projectStatus={data.status}
                        saveProject={() => data.status && !dataChanged ? undefined : onSaveProject(data, data.status as ProjectStatus || ProjectStatus.DRAFT)}
                    />
                    <div className="flex gap-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onBack}
                        >
                            <ChevronLeft size={18} className="mr-2" />
                            Back
                        </Button>
                        {isSaved ?
                            <Button
                                type="button"
                                onClick={onNext}
                            >
                                Continue
                                <ChevronRight size={18} className="ml-2" />
                            </Button> :
                            <Button
                                type="submit"
                            >
                                {form.formState.isSubmitting ? "Saving..." : "Save"}
                            </Button>
                        }

                    </div>
                </div>
            </form>
        </Form>
    );
}