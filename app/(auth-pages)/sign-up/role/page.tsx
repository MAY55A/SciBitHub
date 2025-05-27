"use client";

import { useRouter } from "next/navigation";
import { useMultistepSignupFormContext } from "@/src/contexts/multistep-signup-form-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserInputData, userInputDataSchema } from "@/src/types/user-form-data";
import { motion } from "framer-motion";
import { Button } from "@/src/components/ui/button";
import Card from "@/src/components/ui/motion-card";
import { FlaskConical, User } from "lucide-react";


export default function RoleSelection() {
    const router = useRouter();
    const { formData, updateFormData } = useMultistepSignupFormContext();
    const form = useForm({
        resolver: zodResolver(userInputDataSchema.pick({ role: true })),
        defaultValues: { role: formData.role },
    });
    const { setValue, watch, handleSubmit } = form;
    const selectedRole = watch("role");

    const handleSelectRole = (role: "contributor" | "researcher") => {
        setValue("role", role);
    };

    const onSubmit = (data: Partial<UserInputData>) => {
        updateFormData(data);

        if (selectedRole === "researcher") {
            router.push("/sign-up/researcher-type");
        } else {
            router.push("/sign-up/fields-of-interest");
        }
    };

    return (
        <motion.form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 w-72 sm:w-96 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <h2 className="text-xl font-semibold text-center">Choose Your Role</h2>

            <div className="flex flex-col gap-10 py-4">
                {/* Contributor Card */}
                <Card
                    title="Contributor"
                    content="Join and contribute to projects."
                    icon={User}
                    isSelected={selectedRole === "contributor"}
                    onClick={() => handleSelectRole("contributor")}
                />
                {/* Researcher Card */}
                <Card
                    title="Researcher"
                    content="Create and publish research projects"
                    icon={FlaskConical}
                    isSelected={selectedRole === "researcher"}
                    onClick={() => handleSelectRole("researcher")}
                />
            </div>

            <div className="flex gap-4 w-full">
                {/* Go Back Button */}
                <Button variant={"secondary"} type="button" className="w-full" onClick={() => router.push("/sign-up/name-and-country")}>
                    Go Back
                </Button>
                {/* Continue Button (Disabled if no role is selected) */}
                <Button className="w-full"
                    type="submit"
                    disabled={!selectedRole}
                >
                    Continue
                </Button>
            </div>
        </motion.form>
    );
}