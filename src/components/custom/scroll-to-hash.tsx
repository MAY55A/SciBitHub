"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollToHashElement() {
    const pathname = usePathname();

    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            const id = hash.slice(1);

            const tryScrollAndFocus = () => {
                const el = document.getElementById(id);
                if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "center" });
                    setTimeout(() => el.focus(), 500);
                } else {
                    // Try again after a short delay
                    setTimeout(tryScrollAndFocus, 200);
                }
            };

            // Start trying after a slight initial delay
            setTimeout(tryScrollAndFocus, 300);
        }
    }, [pathname]);

    return null;
}