'use client';

import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from '../ui/pagination';

export default function CustomPagination({ totalPages }: { totalPages: number }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    const safeTotalPages = Math.max(totalPages, 1);
    const rawPage = Number(searchParams.get('page')) || 1;
    const currentPage = Math.min(Math.max(rawPage, 1), safeTotalPages);

    // Keep the URL in sync with the clamped page so a stale/out-of-range
    // ?page value never lingers after the invalid state is displayed once.
    useEffect(() => {
        if (rawPage === currentPage) return;
        const params = new URLSearchParams(searchParams);
        params.set('page', currentPage.toString());
        router.replace(`${pathname}?${params.toString()}`);
    }, [rawPage, currentPage, pathname, router, searchParams]);

    const isFirstPage = currentPage <= 1;
    const isLastPage = currentPage >= safeTotalPages;

    const createPageURL = (pageNumber: number) => {
        if (pageNumber < 1 || pageNumber > safeTotalPages) return;
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <Pagination>
            <PaginationContent>
                {/* Previous Button */}
                <PaginationItem>
                    <PaginationPrevious
                        disabled={isFirstPage}
                        className='text-xs text-foreground aria-disabled:text-muted-foreground cursor-pointer'
                        onClick={() => createPageURL(currentPage - 1)}
                    />
                </PaginationItem>

                {/* Current Button */}
                <PaginationItem>
                    <PaginationLink
                        isActive
                    >
                        {currentPage}
                    </PaginationLink>
                </PaginationItem>

                {/* Next Button */}
                <PaginationItem>
                    <PaginationNext
                        disabled={isLastPage}
                        className='text-xs text-foreground aria-disabled:text-muted-foreground cursor-pointer'
                        onClick={() => createPageURL(currentPage + 1)}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}