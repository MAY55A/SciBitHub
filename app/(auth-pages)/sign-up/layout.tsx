"use client";

import dynamic from "next/dynamic";

const MultistepFormContextProvider = dynamic(
    () => import("../../../src/contexts/multistep-form-context"),
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
            <MultistepFormContextProvider>{children}</MultistepFormContextProvider>
        </main>
    );
}