"use client";

import { useRouter } from "next/navigation";
import { useMultistepFormContext } from "../../../../src/contexts/multistep-form-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputData, inputDataSchema } from "@/src/types/user-form-data";
import { Button } from "@/src/components/ui/button";
import CardGridSelect from "@/src/components/ui/card-grid-select";
import { researchDomains } from "@/src/data/fields";
import { motion } from "framer-motion";


export default function FieldsOfInterestSelection() {
    const router = useRouter();
    const { formData, updateFormData } = useMultistepFormContext();
    const form = useForm({
        resolver: zodResolver(inputDataSchema.pick({ fieldsOfInterest: true, role: true })),
        defaultValues: { fieldsOfInterest: formData.fieldsOfInterest },
    });
    const { setValue, watch, handleSubmit } = form;
    const selectedInterests = watch("fieldsOfInterest");
    const handleSelect = (newSelection: string[]) => {
        setValue("fieldsOfInterest", newSelection);
    };
    const onSubmit = () => {
        updateFormData({ ...formData, fieldsOfInterest: selectedInterests });
        router.push("/sign-up/confirmation");
    };

    const goBack = () => {
        formData.role === "researcher" ? router.push("/sign-up/researcher-type") : router.push("/sign-up/role")
    };

return (
    <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center gap-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
    >
        <h2 className="text-xl font-medium">Select Your Fields Of Interest</h2>
        <CardGridSelect
            options={researchDomains}
            value={selectedInterests}
            showDescription={true}
            onChange={handleSelect}
        />

        <div className="flex gap-4 w-full max-w-md">
            {/* Go Back Button */}
            <Button variant={"secondary"} type="button" className="w-full" onClick={goBack}>
                Go Back
            </Button>
            {/* Continue Button (Disabled if no field is selected) */}
            <Button
                type="submit"
                onClick={onSubmit}
                className="w-full"
                disabled={selectedInterests.length === 0}
            >
                Continue
            </Button>
        </div>
    </motion.form>
);
}