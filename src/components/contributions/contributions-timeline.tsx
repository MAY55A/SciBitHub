'use client';

import { eachDayOfInterval, endOfYear, format, getYear, isWithinInterval, parseISO, startOfYear, subDays, subMonths } from 'date-fns';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/src/components/ui/tooltip';
import { cn } from '@/src/lib/utils';
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';

export function ContributionMap({ contributions, years }: { contributions: Map<string, number>, years: string[] }) {
    const [filteredData, setFilteredData] = useState<Map<string, number>>(new Map());
    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [allDates, setAllDates] = useState(eachDayOfInterval({ start: subMonths(new Date(), 6), end: new Date() }));
    const [totalContributions, setTotalContributions] = useState<number>(0);

    const getLevel = (count: number): string => {
        if (count === 0) return 'bg-muted border-green/30 border';
        if (count < 3) return 'bg-green/30';
        if (count < 6) return 'bg-green/60';
        if (count < 10) return 'bg-green/80';
        return 'bg-green';
    };

    useEffect(() => {
        const load = async () => {
            const endDate = new Date();
            const defaultStart = subMonths(endDate, 6);
            const filtered = new Map(
                Array.from(contributions.entries()).filter(([date]) =>
                    isWithinInterval(parseISO(date), { start: defaultStart, end: endDate })
                )
            );
            setFilteredData(filtered);
            setTotalContributions(Array.from(filtered.values()).reduce((acc, count) => acc + count, 0));
        };

        load();
    }, [contributions]);

    const handleYearSelect = (year: string) => {
        setSelectedYear(year);
        const filtered = new Map(
            Array.from(contributions.entries()).filter(([date]) => getYear(parseISO(date)).toString() === year)
        );
        setFilteredData(filtered);
        setTotalContributions(Array.from(filtered.values()).reduce((acc, count) => acc + count, 0));
        setAllDates(eachDayOfInterval({
            start: startOfYear(year),
            end: endOfYear(year)
        }));
    };

    return (
        <Card className='bg-muted/30'>
            <CardHeader>
                <div className='flex flex-wrap justify-between items-center'>
                    <h2 className="text-lg font-bold">Contributions Map</h2>
                    <span className='text-muted-foreground text-xs font-retro'>{selectedYear || "Last 6 Months"}</span>
                </div>
                <span className='text-muted-foreground text-sm font-retro'>Total Contributions: {totalContributions}</span>
            </CardHeader >
            <CardContent className="flex flex-wrap gap-1 w-full max-w-3xl">
                {allDates.map((date) => {
                    const dateStr = format(date, 'yyyy-MM-dd');
                    const count = filteredData?.get(dateStr) || 0;
                    return (
                        <Tooltip key={dateStr}>
                            <TooltipTrigger asChild>
                                <div
                                    className={cn(
                                        'w-3 h-3 rounded-sm transition-colors',
                                        getLevel(count)
                                    )}
                                />
                            </TooltipTrigger>
                            <TooltipContent className='font-retro'>
                                <p>{format(date, 'MMM d, yyyy')}</p>
                                <p>{count} contribution{count !== 1 ? 's' : ''}</p>
                            </TooltipContent>
                        </Tooltip>
                    );
                })}
            </CardContent>
            <CardFooter className='flex flex-wrap justify-center gap-2 mt-4'>
                {years.map((y) =>
                    <Button
                        key={y}
                        variant={selectedYear === y ? 'outline' : 'ghost'}
                        className={selectedYear === y ? '' : 'border text-muted-foreground'}
                        title='filter contributions by year'
                        onClick={() => handleYearSelect(y)}
                    >
                        {y}
                    </Button>
                )}
            </CardFooter>
        </Card >
    );
}
