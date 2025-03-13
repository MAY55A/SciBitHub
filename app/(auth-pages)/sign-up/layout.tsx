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
        <main className="py-12">
            <MultistepSignupFormContextProvider>{children}</MultistepSignupFormContextProvider>
        </main>
    );
}