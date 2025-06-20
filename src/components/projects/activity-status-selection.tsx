'use client'

import { ActivityStatus } from "@/src/types/enums"
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

export function ActivityStatusSelection() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const params = new URLSearchParams(searchParams);
    const currentStatus = params.get('activityStatus') as ActivityStatus ?? "all";

    const handleFilter = (status: ActivityStatus | "all") => {
        params.set('page', '1');
        if (status !== "all") {
            params.set('activityStatus', status);
        } else {
            params.delete('activityStatus');
        }
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <RadioGroup
            defaultValue={currentStatus}
            onValueChange={(status) => handleFilter(status as ActivityStatus | "all")}
            className="flex gap-4 px-6 font-retro"
        >
            {["all", ...Object.values(ActivityStatus)].map(status => (
                <div className="flex items-center space-x-2" key={status}>
                    <RadioGroupItem
                        value={status}
                        id={status}
                    />
                    <Label htmlFor={status}>{status}</Label>
                </div>
            ))}
        </RadioGroup>
    )
}