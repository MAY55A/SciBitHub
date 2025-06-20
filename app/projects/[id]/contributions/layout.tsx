import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function Layout({
    params,
    children,
}: {
    params: { id: string };
    children: React.ReactNode;
}) {
    const { id } = params;

    return (
        <div className="w-full p-4">
            <Link href={`/projects/${id}`}>
                <span className="flex items-center gap-1 font-semibold text-sm underline font-retro hover:text-primary">
                    <ChevronLeft size={15} />
                    Back to Project
                </span>
            </Link>
            {children}
        </div>
    );
}