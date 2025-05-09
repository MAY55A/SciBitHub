'use client'

import { createClient } from '@/src/utils/supabase/client';
import { startTransition, useEffect, useMemo, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/src/components/ui/card';
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/src/components/ui/chart';
import { Label, Pie, PieChart } from 'recharts';
import { PieGraphSkeleton } from './pie-graph-skeleton';

const chartConfig = {
    resolved: {
        label: 'Resolved',
        color: '#4CAF50AA',  // Green (success)
    },
    pending: {
        label: 'Pending',
        color: '#FFC107AA',  // Amber (warning)
    },
    dismissed: {
        label: 'Dismissed',
        color: '#F44336AA',  // Red (danger/termination)
    },
    reviewed: {
        label: 'Reviewed',
        color: '#2196F3AA',  // Blue (neutral/processing)
    },
} satisfies ChartConfig;

export default function ReportsStatusPieChart() {
    const [data, setData] = useState<{ status: string, count: number }[]>([]);
    const supabase = createClient();

    useEffect(() => {
        startTransition(async () => {
            const { data, error } = await supabase.rpc('admin_report_status_distribution');
            if (!error) {
                console.log('Data:', data);
                setData(data);
            } else {
                console.error(error);
            }
        });
    }, []);

    const totalreports = useMemo(() => {
        return data.reduce((acc, curr) => acc + curr.count, 0);
    }, [data]);

    if (data.length === 0) {
        return <PieGraphSkeleton />;
    }

    return (
        <Card className='@container/card'>
            <CardHeader>
                <CardTitle>Report Status Overview</CardTitle>
                <CardDescription>
                    <span className='hidden @[540px]/card:block'>
                        Total reports by status distribution
                    </span>
                    <span className='@[540px]/card:hidden'>Showing the distribution of reports by their current status</span>
                </CardDescription>
            </CardHeader>
            <CardContent className='px-2 sm:px-6'>
                <ChartContainer
                    config={chartConfig}
                    className='mx-auto aspect-square min-h-[250px] max-h-[300px]'
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <ChartLegend content={<ChartLegendContent className='flex-wrap' />} />
                        <Pie
                            data={data.map((item) => ({
                                ...item,
                                fill: chartConfig[item.status as keyof typeof chartConfig].color
                            }))}
                            dataKey='count'
                            nameKey='status'
                            innerRadius={85}
                            outerRadius={100}
                            strokeWidth={2}
                            stroke='hsl(var(--background))'
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor='middle'
                                                dominantBaseline='middle'
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className='fill-foreground text-3xl font-bold'
                                                >
                                                    {totalreports}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className='fill-muted-foreground text-sm'
                                                >
                                                    Total reports
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}