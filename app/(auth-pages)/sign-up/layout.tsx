"use client";

import dynamic from "next/dynamic";

const MultistepSignupFormContextProvider = dynamic(
    () => import("../../../src/contexts/multistep-signup-form-context"),
    {
        ssr: false,
    },
);

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="flex items-center justify-center sm:h-[calc(100vh-8rem)] pt-4">
            <MultistepSignupFormContextProvider>{children}</MultistepSignupFormContextProvider>
        </main>
    );
}