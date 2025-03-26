'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationEllipsis, PaginationNext } from '../ui/pagination';

export default function CustomPagination({ totalPages }: { totalPages: number }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    return (
        <Pagination>
            <PaginationContent>
                {/* Previous Button */}
                {currentPage !== 1 &&
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => createPageURL(currentPage - 1)}
                        />
                    </PaginationItem>
                }

                {/* Current Button */}
                <PaginationItem>
                    <PaginationLink
                        isActive
                    >
                        {currentPage}
                    </PaginationLink>
                </PaginationItem>

                {/* Next Button */}
                {currentPage !== totalPages &&
                    <PaginationItem>
                        <PaginationNext
                            onClick={() => createPageURL(currentPage + 1)}
                        />
                    </PaginationItem>
                }
            </PaginationContent>
        </Pagination>
    );
}