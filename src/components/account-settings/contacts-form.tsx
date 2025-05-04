"use client"

import { Message, FormMessage } from "@/src/components/custom/form-message";
import { Button } from "@/src/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage as FieldMessage } from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { UserInputData, userInputDataSchema } from "@/src/types/user-form-data";
import { updateMetadata } from "@/src/lib/actions/account-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export function ContactsForm({ ...contacts }: { contactEmail: string, phone: string, contacts: string[] }) {
    const [initialContacts, setInitialContacts] = useState(contacts);
    const form = useForm({
        resolver: zodResolver(userInputDataSchema.pick({ contactEmail: true, phone: true, contacts: true })),
        defaultValues: contacts,
    });
    const [message, setMessage] = useState<Message | null>(null);
    const [newContact, setNewContact] = useState("");

    const handleAddContact = () => {
        if (newContact.length > 0) {
            if (form.getValues('contacts')!.includes(newContact)) {
                form.setError("contacts", { message: "Contact already exists" });
                return;
            }
            form.clearErrors('contacts');
            form.setValue('contacts', [...form.getValues('contacts')!, newContact]);
            setNewContact('');
        }
    }
    const handleDeleteContact = (index: number) => {
        const contacts = [...form.getValues('contacts')!];
        contacts.splice(index, 1);
        form.setValue('contacts', contacts);
    }
    const onSubmit = async (data: Partial<UserInputData>) => {
        setMessage(null);
        if (JSON.stringify(data) === JSON.stringify(initialContacts)) {
            setMessage({ error: "No changes were made." });
            return;
        }
        if (data.phone!.length > 0 && !/^\+[0-9]{3}-[0-9]*$/.test(data.phone!)) {
            form.setError("phone", { message: "Phone number must be in the format +123-1234567890." });
            return;
        }
        if (data.contactEmail!.length > 0 && !z.string().email().safeParse(data.contactEmail!).success) {
            form.setError("contactEmail", { message: "Please enter a valid email address." });
            return;
        }

        const res = await updateMetadata(data);
        if(res.success) {
            setInitialContacts({...initialContacts, ...data});
            setMessage({ success: res.message });
        } else {
            setMessage({ error: res.message });
        }
    }

    const reset = () => {
        form.setValue("contactEmail", initialContacts.contactEmail);
        form.setValue("contacts", initialContacts.contacts);
        form.setValue("phone", initialContacts.phone);
        setNewContact('');
        setMessage(null);
    }

    return (
        <Form {...form}>
            <form
                className="border rounded-lg p-10 flex flex-col gap-6"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <h2 className="text-primary font-semibold">Contact</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    This is how others can contact you.
                </p>
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                                <Input
                                    type="phone"
                                    placeholder="+234-1234567890"
                                    disabled={form.formState.isSubmitting}
                                    {...field} />
                            </FormControl>
                            <FieldMessage></FieldMessage>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="me@example.com"
                                    disabled={form.formState.isSubmitting}
                                    {...field} />
                            </FormControl>
                            <FieldMessage></FieldMessage>
                        </FormItem>
                    )}
                />
                {/* Contacts Section */}
                {/* Display Existing Contacts */}
                <FormField
                    control={form.control}
                    name="contacts"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Additional Contacts</FormLabel>
                            <FormControl>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        {field.value?.map((contact, index) => (
                                            <div key={index} className="flex items-center justify-between">
                                                <Input
                                                    value={contact}
                                                    readOnly={true}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDeleteContact(index)}
                                                    disabled={form.formState.isSubmitting}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Add New Contact */}
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Add a new contact"
                                            value={newContact}
                                            onChange={(e) => setNewContact(e.target.value)}
                                            disabled={form.formState.isSubmitting}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleAddContact}
                                            disabled={newContact.length === 0}
                                        >
                                            Add
                                        </Button>
                                    </div>
                                </div>
                            </FormControl>
                            <FieldMessage></FieldMessage>
                        </FormItem>
                    )}
                />
                {message && <FormMessage message={message} />}

                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <Button type="reset" variant="secondary" size="sm" onClick={reset}>
                        Reset
                    </Button>
                    <Button
                        type="submit" size="sm"
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting ? "Saving..." : "Save"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}