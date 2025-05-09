'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/src/components/ui/card';
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent
} from '@/src/components/ui/chart';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { useEffect, useMemo, useState, useTransition } from 'react';
import { createClient } from '@/src/utils/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { AreaGraphSkeleton } from './area-graph-skeleton';

const chartConfig = {
    users: {
        label: 'Users'
    },
    researchers: {
        label: 'Researchers',
        color: 'hsl(var(--primary))'
    },
    contributors: {
        label: 'Contributors',
        color: 'hsl(var(--green))'
    }
} satisfies ChartConfig;

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const intervals = [4, 6, 12];
const currentMonthIndex = new Date().getMonth();

export function UsersGrowthChart() {
    const [data, setData] = useState<{
        month: string;
        researchers: any;
        contributors: any;
    }[]>([]);
    const [selectedInterval, setSelectedInterval] = useState(4);
    const [isPending, startTransition] = useTransition();
    const supabase = createClient();

    useEffect(() => {
        startTransition(async () => {
            const { data, error } = await supabase.rpc('admin_users_growth', {
                months: selectedInterval,
            });
            if (!error) {
                const currentMonths = Array.from({ length: selectedInterval }).map((_, i) => {
                    const index = (currentMonthIndex - selectedInterval + 1 + i + 12) % 12;
                    return months[index];
                });

                const filled = currentMonths.map(month => {
                    const entry = data.find((d: any) => d.month === month);
                    return {
                        month,
                        researchers: entry?.researchers ?? 0,
                        contributors: entry?.contributors ?? 0,
                    };
                });
                setData(filled);
            } else {
                console.error(error);
            }
        });
    }, [selectedInterval]);

    if (data.length === 0) {
        return <AreaGraphSkeleton />;
    }

    return (
        <Card className='@container/card'>
            <CardHeader className='flex-row gap-3 justify-between'>
                <div>
                    <CardTitle>Account Registration History</CardTitle>
                    <CardDescription>
                        Showing total of new users for the last {selectedInterval} months
                    </CardDescription>
                </div>
                <Select onValueChange={(value) => setSelectedInterval(Number(value))} defaultValue={selectedInterval.toString()} disabled={isPending}>
                    <SelectTrigger className='w-[180px]'>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className='max-h-[300px] overflow-auto'>
                        {intervals.map((int) => (
                            <SelectItem key={int} value={int.toString()}>
                                <span>Last {int} months</span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
                <ChartContainer
                    config={chartConfig}
                    className='aspect-auto h-[250px] w-full'
                >
                    <AreaChart
                        data={data}
                        margin={{
                            left: 12,
                            right: 12
                        }}
                    >
                        <defs>
                            <linearGradient id='fillResearchers' x1='0' y1='0' x2='0' y2='1'>
                                <stop
                                    offset='5%'
                                    stopColor='var(--color-researchers)'
                                    stopOpacity={1.0}
                                />
                                <stop
                                    offset='95%'
                                    stopColor='var(--color-researchers)'
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient id='fillContributors' x1='0' y1='0' x2='0' y2='1'>
                                <stop
                                    offset='5%'
                                    stopColor='var(--color-contributors)'
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset='95%'
                                    stopColor='var(--color-contributors)'
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey='month'
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            interval={0} // Force all labels to show
                        />
                        <YAxis width={40} tickLine={false} axisLine={false} />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator='dot' />}
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Area
                            dataKey='contributors'
                            type="natural"
                            fill='url(#fillContributors)'
                            stroke='var(--color-contributors)'
                            stackId='a'
                        />
                        <Area
                            dataKey='researchers'
                            type="natural"
                            fill='url(#fillResearchers)'
                            stroke='var(--color-researchers)'
                            stackId='a'
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className='flex w-full items-start gap-2 text-sm'>
                    <UserGrowthSummary growthData={data} />
                </div>
            </CardFooter>
        </Card>
    );
}

function UserGrowthSummary({ growthData }: { growthData: { month: string, researchers: number, contributors: number }[] }) {
    const { growthRate, fromMonth, toMonth } = useMemo(() => {
        if (!growthData || growthData.length < 2) return { growthRate: 0, fromMonth: '', toMonth: '' };

        const current = growthData[growthData.length - 1];
        const previous = growthData[growthData.length - 2];

        const currentTotal = current.researchers + current.contributors;
        const previousTotal = previous.researchers + previous.contributors;

        const growthRate = previousTotal === 0 ? 100 : ((currentTotal - previousTotal) / previousTotal) * 100;

        return {
            growthRate: Math.round(growthRate * 10) / 10, // round to 1 decimal
            fromMonth: growthData[0].month,
            toMonth: current.month,
        };
    }, [growthData]);

    return (
        <div className='grid gap-2'>
            <div className='flex items-center gap-2 leading-none font-medium'>
                {growthRate > 0
                    ? <>
                        Trending up by <strong className="text-green-500">+{growthRate}%</strong> this month{' '}
                        <TrendingUp className='h-4 w-4' color='green' />
                    </>
                    : growthRate === 0
                        ? <>
                            No growth this month{' '}
                            <TrendingUp className='h-4 w-4' color='gray' />
                        </>
                        : <>
                            Trending down by <strong className="text-red-500">{growthRate}%</strong> this month{' '}
                            <TrendingDown className='h-4 w-4' color='red' />
                        </>
                }
            </div>
            <div className='text-muted-foreground flex items-center gap-2 leading-none'>
                {fromMonth} – {toMonth} 2024
            </div>
        </div>
    );
}