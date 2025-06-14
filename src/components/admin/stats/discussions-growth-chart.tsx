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
    ChartTooltip,
    ChartTooltipContent
} from '@/src/components/ui/chart';
import { useEffect, useState, useTransition } from 'react';
import { createClient } from '@/src/utils/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';

const chartConfig = {
    discussions: {
        label: 'Discussions',
        color: 'hsl(var(--green))',
    },
} satisfies ChartConfig;

const intervals = [7, 15, 30];

export function DiscussionsGrowthChart() {
    const [data, setData] = useState<{
        day: string;
        discussions: number;
    }[]>([]);
    const [selectedInterval, setSelectedInterval] = useState(7);
    const [isPending, startTransition] = useTransition();
    const supabase = createClient();

    useEffect(() => {
        startTransition(async () => {
            const { data, error } = await supabase.rpc('admin_discussions_growth', {
                days: selectedInterval,
            });
            if (!error) {
                setData(data);
            } else {
                console.log(error);
            }
        });
    }, [selectedInterval]);

    return (
        <Card className='@container/card'>
            <CardHeader className='flex-row gap-3 justify-between'>
                <div>
                    <CardTitle>Discussions Creation Rate Overtime</CardTitle>
                    <CardDescription className='font-retro mt-1'>
                        Showing total of discussions created for the last {selectedInterval} days
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
                    className='aspect-auto h-[250px] w-full font-retro'
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
                        <Line
                            dataKey='discussions'
                            stroke='hsl(var(--green))'
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