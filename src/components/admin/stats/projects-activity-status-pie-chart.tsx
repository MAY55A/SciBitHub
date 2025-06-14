'use client'

import { createClient } from '@/src/utils/supabase/client';
import { startTransition, useEffect, useMemo, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/src/components/ui/card';
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/src/components/ui/chart';
import { Label, Pie, PieChart } from 'recharts';
import { PieGraphSkeleton } from './pie-graph-skeleton';


const chartConfig = {
    ongoing: {
        label: 'Ongoing',
        color: '#0080008a'
    },
    completed: {
        label: 'Completed',
        color: '#dfc742bf'
    },
    closed: {
        label: 'Closed',
        color: '#ff00008a'
    },
    paused: {
        label: 'Paused',
        color: '#c06817b5'
    },
} satisfies ChartConfig;

export default function ProjectsActivityStatusPieChart() {
    const [data, setData] = useState<{ activity_status: string, count: number }[]>([]);
    const supabase = createClient();

    useEffect(() => {
        startTransition(async () => {
            const { data, error } = await supabase.rpc('admin_project_activity_distribution');
            if (!error) {
                setData(data);
            } else {
                console.log(error);
            }
        });
    }, []);

    const totalProjects = useMemo(() => {
        return data.reduce((acc, curr) => acc + curr.count, 0);
    }, [data]);

    if (data.length === 0) {
        return <PieGraphSkeleton />;
    }

    return (
        <Card className='@container/card'>
            <CardHeader>
                <CardTitle>Published Project activity Distribution</CardTitle>
                <CardDescription className='font-retro'>
                    <span className='hidden @[540px]/card:block'>
                        Total Published Projects by activity status distribution
                    </span>
                    <span className='@[540px]/card:hidden'>Showing total of published projects by activity distribution</span>
                </CardDescription>
            </CardHeader>
            <CardContent className='px-2 sm:px-6'>
                <ChartContainer
                    config={chartConfig}
                    className='mx-auto aspect-square min-h-[250px] max-h-[300px] font-retro'
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
                                fill: chartConfig[item.activity_status as keyof typeof chartConfig].color
                            }))}
                            dataKey='count'
                            nameKey='activity_status'
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
                                                    {totalProjects}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className='fill-muted-foreground text-sm'
                                                >
                                                    Published Projects
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