"use client";

import { UserInputData } from "@/src/types/user-form-data";
import { createContext, ReactNode, useContext, useState } from "react";


interface MultistepSignupFormContextType {
    formData: UserInputData;
    updateFormData: (data: Partial<UserInputData>) => void;
    clearFormData: () => void;
    formDataIsFilled: () => boolean;
}

const MultistepSignupFormContext = createContext<
    MultistepSignupFormContextType | undefined
>(undefined);

const STORAGE_KEY = "multistep_signup_form_data";

export default function MultistepSignupFormContextProvider({
    children,
}: {
    children: ReactNode;
}) {
    const initialFormData: UserInputData = {
        username: "",
        email: "",
        password: "",
        role: "contributor",
        fieldsOfInterest: [],
        researcherType: null,
        country: ""
    };

    const [formData, setFormData] = useState<UserInputData>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : initialFormData;
    });

    const updateFormData = (data: Partial<UserInputData>) => {
        const updatedData = { ...formData, ...data };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
        setFormData(updatedData);
    };

    const formDataIsFilled = () => {
        return formData.username.length > 0 && formData.country.length > 0 && formData.fieldsOfInterest.length > 0;
    };

    const clearFormData = () => {
        setFormData(initialFormData);
        localStorage.removeItem(STORAGE_KEY);
    };

    return (
        <MultistepSignupFormContext.Provider
            value={{ formData, updateFormData, clearFormData, formDataIsFilled }}
        >
            {children}
        </MultistepSignupFormContext.Provider>
    );
}

export function useMultistepSignupFormContext() {
    const context = useContext(MultistepSignupFormContext);
    if (context === undefined) {
        throw new Error(
            "useMultistepSignupFormContext must be used within a MultistepSignupFormContextProvider",
        );
    }
    return context;
}