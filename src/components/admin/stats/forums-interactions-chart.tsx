'use client';

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import {
    Card,
    CardContent,
    CardDescription,
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
import { useEffect, useState, useTransition } from 'react';
import { createClient } from '@/src/utils/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { c } from 'framer-motion/dist/types.d-6pKw1mTI';

const chartConfig = {
    replies: {
        label: 'Replies',
        color: '#FFC107AA'
    },
    upvotes: {
        label: 'Upvotes',
        color: '#4CAF50AA',  // Green (success)
    },
    downvotes: {
        label: 'Downvotes',
        color: '#F44336AA',  // Red (danger/termination)
    }
} satisfies ChartConfig;

const intervals = [7, 15, 30];

export function ForumsInteractionsChart() {
    const [data, setData] = useState<{
        day: string;
        replies: number;
        downvotes: number;
        upvotes: number;
    }[]>([]);
    const [selectedInterval, setSelectedInterval] = useState(7);
    const [isPending, startTransition] = useTransition();
    const supabase = createClient();

    useEffect(() => {
        startTransition(async () => {
            const { data, error } = await supabase.rpc('admin_topics_interactivity', {
                days: selectedInterval,
            });
            console.log(data, error);
            if (!error) {
                setData(data);
            } else {
                console.error(error);
            }
        });
    }, [selectedInterval]);

    return (
        <Card className='@container/card'>
            <CardHeader className='flex-row gap-3 justify-between'>
                <div>
                    <CardTitle>Forum Topics Interactivity</CardTitle>
                    <CardDescription>
                        Showing interactions with topics for the last {selectedInterval} days
                    </CardDescription>
                </div>
                <Select onValueChange={(value) => setSelectedInterval(Number(value))} defaultValue={selectedInterval.toString()} disabled={isPending}>
                    <SelectTrigger className='w-[180px]'>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className='max-h-[300px] overflow-auto'>
                        {intervals.map((int) => (
                            <SelectItem key={int} value={int.toString()}>
                                <span>Last {int} days</span>
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
                    <LineChart
                        data={data}
                        margin={{ left: 12, right: 12 }}
                    >
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis
                            dataKey='day'
                            tickLine={false}
                            axisLine={false}
                            padding={{ left: 15, right: 15 }}
                            interval={0}
                            tickFormatter={(value, index) =>
                                selectedInterval === 7  // show all ticks for 7 days
                                    || (selectedInterval === 15 && index % 2 === 0) // show every 2nd tick for 15 days
                                    || index % 4 === 0 // show every 4th tick for 30 days
                                    ? value : ''
                            }
                        />
                        <YAxis
                            width={40}
                            tickLine={false}
                            axisLine={false}
                            padding={{ top: 15, bottom: 10 }}
                            allowDecimals={false}
                        />
                        <ChartTooltip
                            content={<ChartTooltipContent indicator='line' />}
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Line
                            dataKey='replies'
                            stroke={chartConfig.replies.color}
                            strokeWidth={2.5}
                            dot={{ r: 1 }}
                            activeDot={{ r: 6 }}
                        />
                        <Line
                            dataKey='upvotes'
                            stroke={chartConfig.upvotes.color}
                            strokeWidth={2.5}
                            dot={{ r: 1 }}
                            activeDot={{ r: 6 }}
                        />
                        <Line
                            dataKey='downvotes'
                            stroke={chartConfig.downvotes.color}
                            strokeWidth={2.5}
                            dot={{ r: 1 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}