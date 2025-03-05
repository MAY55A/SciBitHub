"use client";

import { useRouter } from "next/navigation";
import { useMultistepFormContext } from "../../../../src/contexts/multistep-form-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputData, inputDataSchema } from "@/src/types/user-form-data";
import { motion } from "framer-motion";
import { Button } from "@/src/components/ui/button";
import Card from "@/src/components/ui/motion-card";
import { Building, GraduationCap, User } from "lucide-react";
import { ResearcherType } from "@/src/types/models";


export default function ResearcherTypeSelection() {
    const router = useRouter();
    const { formData, updateFormData } = useMultistepFormContext();
    const form = useForm({
        resolver: zodResolver(inputDataSchema.pick({ researcherType: true })),
        defaultValues: { researcherType: formData.researcherType },
    });
    const { setValue, watch, handleSubmit } = form;
    const selectedType = watch("researcherType");

    const handleSelectType = (researcherType: ResearcherType) => {
        setValue("researcherType", researcherType);
    };

    const onSubmit = (data: Partial<InputData>) => {
        updateFormData(data);
        router.push("/sign-up/fields-of-interest");
    };

    return (
        <motion.form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center gap-10 pt-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <h2 className="text-xl font-semibold">Choose Your Research Style</h2>

            <div className="grid grid-rows-2 grid-cols-2 gap-4 [&>*:nth-child(3)]:col-span-2 [&>*:nth-child(3)]:place-self-center">
                <Card
                    title="Casual"
                    content="Start a research project as an individual, just for fun or curiosity."
                    icon={User}
                    isSelected={selectedType === "casual"}
                    onClick={() => handleSelectType(ResearcherType.CASUAL)}
                />
                <Card
                    title="Academic"
                    content="Conduct research for studies, as a student, or as a professional researcher."
                    icon={GraduationCap}
                    isSelected={selectedType === "academic"}
                    onClick={() => handleSelectType(ResearcherType.ACADEMIC)}
                />
                <Card
                    title="Organisation"
                    content="Create and manage research projects as an organization or institution."
                    icon={Building}
                    isSelected={selectedType === "organization"}
                    onClick={() => handleSelectType(ResearcherType.ORGANIZATION)}
                />
            </div>

            <div className="flex gap-4 w-full max-w-md">
                {/* Go Back Button */}
                <Button variant={"secondary"} type="button" className="w-full" onClick={() => router.push("/sign-up/role")}>
                    Go Back
                </Button>
                {/* Continue Button (Disabled if no type is selected) */}
                <Button
                    className="w-full"
                    type="submit"
                    disabled={!selectedType}
                >
                    Continue
                </Button>
            </div>
        </motion.form>
    );
}