'use client';

import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { debounce } from '@/src/utils/utils';
import { SearchIcon } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function Search({ placeholder }: { placeholder: string }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const handleSearch = debounce((term) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', '1');
        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <div className="relative min-w-60 flex flex-1 flex-shrink-0">
            <Label htmlFor="search" className="sr-only">
                Search
            </Label>
            <Input
                className="peer block w-full rounded-md border py-[9px] pl-10 text-sm outline-2 text-muted-foreground"
                placeholder={placeholder}
                onChange={(e) => {
                    handleSearch(e.target.value);
                }}
                defaultValue={searchParams.get('query')?.toString()}
            />
            <SearchIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground" />
        </div>
    );
}