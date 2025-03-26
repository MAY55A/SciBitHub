"use client";

import { useEffect } from "react";

export default function useNavigationGuard(isDirty: boolean) {
    useEffect(() => {
        const handlePopState = (event: PopStateEvent) => {
            if (isDirty) {
                const confirmLeave = confirm("You have unsaved changes. Are you sure you want to leave?");
                if (!confirmLeave) {
                    window.history.pushState(null, "", window.location.href); // Cancel navigation
                    event.preventDefault();
                }
            }
        };

        window.history.pushState(null, "", window.location.href); // Add initial state
        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, [isDirty]);

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [isDirty]);
}