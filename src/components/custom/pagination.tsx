'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from '../ui/pagination';

export default function CustomPagination({ totalPages }: { totalPages: number }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const currentPage = Number(searchParams.get('page')) || 1;

    const createPageURL = (pageNumber: number | string) => {
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
                        aria-disabled={currentPage === 1}
                        className='text-xs text-foreground aria-disabled:text-muted-foreground aria-disabled:cursor-not-allowed cursor-pointer'
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
                        aria-disabled={currentPage === totalPages}
                        className='text-xs text-foreground aria-disabled:text-muted-foreground aria-disabled:cursor-not-allowed cursor-pointer'
                        onClick={() => createPageURL(currentPage + 1)}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}