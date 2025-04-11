import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { FieldInputData, fieldInputDataSchema } from "@/src/types/project-form-data";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { FileFieldParams } from "./file-field-params";
import { NumberFieldParams } from "./number-field-params";
import { TextFieldParams } from "./text-field-params";
import { SelectFieldParams } from "./select-field-params";
import { useEffect, useState } from "react";
import { LucideIcon } from "lucide-react";
import { FieldType } from "@/src/types/enums";

export default function TaskFieldSetup({ className, icon: Icon, triggerText, title, onSubmit, data }: { className: string, icon?: LucideIcon, triggerText?: string, title: string, onSubmit: (data: any) => void, data?: FieldInputData }) {
    const [open, setOpen] = useState(false);
    const fieldForm = useForm({
        resolver: zodResolver(fieldInputDataSchema),
        defaultValues: { required: true, label: "", type: "", ...data },
    });
    const type = fieldForm.watch("type");

    useEffect(() => {
        fieldForm.setValue("params", {});
    }, [type]);

    const handleSubmit = (data: FieldInputData) => {
        const params = fieldForm.getValues("params");
        if (data.type === "select") {
            if (!params?.options || params.options.length < 2) {
                fieldForm.setError("params.options", { type: "required", message: "Select field must have at least two options" });
                return;
            }
            const uniqueOptions = new Set(params.options);
            if (uniqueOptions.size !== params.options.length) {
                fieldForm.setError("params.options", { type: "required", message: "Each option must be unique" });
                return;
            }
        }
        onSubmit({ ...data, params });
        fieldForm.reset();
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {Icon ?
                    <Button title={title} variant="ghost" className={className} onClick={() => setOpen(true)}><Icon size={15} /></Button> :
                    <Button variant="outline" className="w-24" onClick={() => setOpen(true)}>{triggerText}</Button>
                }
            </DialogTrigger>
            <DialogContent className="lg:min-w-[600px] md:min-w-[600px] sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        Define field configuration here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <Form {...fieldForm}>
                    <form onSubmit={fieldForm.handleSubmit(handleSubmit)} className="space-y-4 p-4">
                        <FormField
                            control={fieldForm.control}
                            name="label"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-green">Label</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Field label" />
                                    </FormControl>
                                    <FormMessage></FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={fieldForm.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-green">Description</FormLabel>
                                    <FormControl>
                                        <textarea {...field} placeholder="Field Description" className="border p-2 w-full rounded placeholder:text-muted-foreground text-sm" />
                                    </FormControl>
                                    <FormMessage></FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={fieldForm.control}
                            name="placeholder"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-green">Placeholder</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Field placeholder" value={field.value || ""} />
                                    </FormControl>
                                    <FormMessage></FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={fieldForm.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-green">Type</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.values(FieldType).map((type) => (
                                                    <SelectItem value={type} key={type}>{type}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage></FormMessage>
                                </FormItem>
                            )}
                        />
                        {type == "number" &&
                            <NumberFieldParams />
                        }
                        {(type == "text" || type == "textarea") &&
                            <TextFieldParams />
                        }
                        {type == "file" &&
                            <FileFieldParams />
                        }
                        {type == "select" &&
                            <SelectFieldParams />
                        }
                        <FormField
                            control={fieldForm.control}
                            name="required"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-green">Is required ?</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            value={field.value ? "true" : "false"}
                                            onValueChange={(value) => {
                                                field.onChange(value === "true");
                                            }}
                                            className="w-full flex gap-8 px-6 pt-4">
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="true" id="true" />
                                                <Label htmlFor="true">Yes</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="false" id="false" />
                                                <Label htmlFor="false">No</Label>
                                            </div>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage></FormMessage>
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="button" onClick={fieldForm.handleSubmit(handleSubmit)}>Save changes</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}