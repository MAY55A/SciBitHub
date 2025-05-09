"use client"

import { startTransition, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/src/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage as FormFieldMessage } from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { useToast } from "@/src/hooks/use-toast";
import { useRouter } from "next/navigation";
import { BasicUserInputData, basicUserInputDataSchema } from "@/src/types/user-form-data";
import { addUser, updateUser } from "@/src/lib/actions/admin/users-actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { ResearcherType, UserRole } from "@/src/types/enums";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import { Label } from "@/src/components/ui/label";
import { UserPlus } from "lucide-react";




export default function UserFormDialog({ data, onUpdate, onClose }: { data?: BasicUserInputData, onUpdate?: (data: any) => void; onClose?: () => void }) {
    const [open, setOpen] = useState(!!data);
    const { toast } = useToast();
    const router = useRouter();
    const form = useForm({
        resolver: zodResolver(basicUserInputDataSchema),
        defaultValues: { username: data?.username ?? "", email: data?.email ?? "", role: data?.role ?? "", password: data ? undefined : "", researcherType: data?.researcherType, id: data?.id },
    });
    const currentRole = form.watch("role");

    useEffect(() => {
        if (currentRole !== UserRole.RESEARCHER && form.getValues("researcherType")) {
            form.setValue("researcherType", undefined);
        }
    }, [currentRole]);

    const handleCreate = async (formData: BasicUserInputData) => {
        const res = await addUser(formData);
        toast({
            title: res.success ? "Success !" : "Error !",
            description: res.message,
            variant: res.success ? "default" : "destructive",
        })
        if (res.success) {
            form.reset();
            startTransition(() => {
                setOpen(false);
                location.reload();
            });
        }
    }

    const handleEdit = async (formData: BasicUserInputData) => {
        //when password is empty, set it to undefined to avoid updating the password
        if (formData.password === "") {
            formData.password = undefined;
        }
        const res = await updateUser(formData);

        toast({
            title: res.success ? "Success !" : "Error !",
            description: res.message,
            variant: res.success ? "default" : "destructive",
        });

        if (res.success) {
            startTransition(() => {
                setOpen(false);
                onClose && onClose();
                onUpdate && res.user && onUpdate(res.user);
            });
        }
    }

    const handleSubmit = async (formData: BasicUserInputData) => {

        if (data) {
            await handleEdit(formData);
        } else {
            await handleCreate(formData);
        }
    }

    const resetForm = async () => {
        form.reset();
        form.clearErrors();
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(open) => {
                setOpen(open);
                !open && onClose && onClose()
            }}
        >
            <DialogTrigger asChild>
                {!data &&
                    <Button onClick={() => setOpen(true)} className="w-full flex gap-2 font-semibold"><UserPlus size={16}/> Add a New User</Button>
                }
            </DialogTrigger>

            <DialogContent className="lg:min-w-[700px] md:min-w-[700px] sm:max-w-[425px] max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>{data ? "Edit Account Info" : "Create a New Account"}</DialogTitle>
                    <DialogDescription>
                        Enter user info here.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 p-4 max-h-[80vh] overflow-y-auto ">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-green">Username</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="account username" />
                                    </FormControl>
                                    <FormFieldMessage></FormFieldMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-green">Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="account email" />
                                    </FormControl>
                                    <FormFieldMessage></FormFieldMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-green">{data ? "New Password" : "Password"}</FormLabel>
                                    <FormControl>
                                        <Input
                                            defaultValue={field.value}
                                            onChange={field.onChange}
                                            type="password"
                                            placeholder="account password"
                                            onBlur={(e) => {
                                                field.onBlur();
                                                const currentValue = form.getValues("password");
                                                const trimmed = e.target.value.trim();

                                                if (data && trimmed === "" && currentValue !== undefined) {
                                                    console.log("set password to undefined");
                                                    form.setValue("password", undefined, { shouldDirty: true });
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    <FormFieldMessage></FormFieldMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-green">Role</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choose role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(UserRole).map((role) => (
                                                <SelectItem value={role} key={role}>{role}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormFieldMessage></FormFieldMessage>
                                </FormItem>
                            )}
                        />
                        {currentRole === UserRole.RESEARCHER && (
                            <FormField
                                control={form.control}
                                name="researcherType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-green">Researcher Type</FormLabel>
                                        <RadioGroup
                                            {...field}
                                            defaultValue={field.value}
                                            onValueChange={field.onChange}
                                            className="w-full flex flex-wrap gap-8 px-6 pt-4"
                                        >
                                            {Object.values(ResearcherType).map(type => (
                                                <div className="flex items-center space-x-2" key={type}>
                                                    <RadioGroupItem
                                                        value={type}
                                                        id={type}
                                                    />
                                                    <Label htmlFor={type}>{type}</Label>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                        <FormFieldMessage></FormFieldMessage>
                                    </FormItem>
                                )}
                            />
                        )}
                        <DialogFooter>
                            <Button type="reset" disabled={form.formState.isSubmitting} onClick={resetForm} variant="outline" className="mr-2">
                                reset
                            </Button>
                            <Button type="submit" disabled={form.formState.isSubmitting || !form.formState.isDirty}>
                                {form.formState.isSubmitting ? "saving..." : data ? "Save changes" : "Create account"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}