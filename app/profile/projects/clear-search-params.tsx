"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ClearSearchParams() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());

        if (params.has("success") || params.has("error")) {
            params.delete("success");
            params.delete("error");

            // Update URL without reloading the page
            setTimeout(() => router.replace(`?${params.toString()}`, { scroll: false }),
                3000);
        }
    }, []);

    return null;
}