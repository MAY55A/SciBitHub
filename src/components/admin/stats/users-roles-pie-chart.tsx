'use client'

import { createClient } from '@/src/utils/supabase/client';
import { startTransition, useEffect, useMemo, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/src/components/ui/card';
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/src/components/ui/chart';
import { Label, Pie, PieChart } from 'recharts';
import { PieGraphSkeleton } from './pie-graph-skeleton';

const chartConfig = {
    contributor: {
        label: 'Contributors',
        color: 'hsla(var(--green)/ 0.8)'
    },
    researcher: {
        label: 'Researchers',
        color: 'hsla(var(--green)/ 0.5)'
    },
    academic: {
        label: 'Academics',
        color: 'hsla(var(--primary)/ 1)'
    },
    casual: {
        label: 'Casuals',
        color: 'hsla(var(--primary)/ 0.7)'
    },
    organization: {
        label: 'Organizations',
        color: 'hsla(var(--primary)/ 0.4)'
    },

} satisfies ChartConfig;

export default function UsersRolesPieChart() {
    const [outerData, setOuterData] = useState<{ role: string, type: string | null, count: number }[]>([]);
    const [innerData, setInnerData] = useState<{ role: string, count: number }[]>([]);
    const supabase = createClient();

    useEffect(() => {
        startTransition(async () => {
            const { data, error } = await supabase.rpc('admin_get_user_roles_and_types');
            if (!error) {
                setOuterData(data);
                const inner = Array.from(data as { role: string, type: string | null, count: number }[]).reduce((acc: { role: string, count: number }[], curr) => {
                    const { role, count } = curr;
                    const existing = acc.find((item) => item.role === role);
                    if (existing) {
                        existing.count += count;
                    } else {
                        acc.push({ role, count });
                    }
                    return acc;
                }, [] as { role: string, count: number }[]);
                setInnerData(inner);
            } else {
                console.log(error);
            }
        });
    }, []);
    const totalUsers = useMemo(() => {
        return innerData.reduce((acc, curr) => acc + curr.count, 0);
    }, [innerData]);

    if(outerData.length === 0 || innerData.length === 0) {
        return <PieGraphSkeleton />;
    }

    return (
        <Card className='@container/card'>
            <CardHeader>
                <CardTitle>User Role Distribution</CardTitle>
                <CardDescription className='font-retro mt-2'>
                    <span className='hidden @[540px]/card:block'>
                        Total Users by role distribution
                    </span>
                    <span className='@[540px]/card:hidden'>Showing total of users by role distribution</span>
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
                            data={innerData.map((item) => ({
                                ...item,
                                fill: chartConfig[item.role as keyof typeof chartConfig].color
                            }))}
                            dataKey='count'
                            nameKey='role'
                            innerRadius={70}
                            outerRadius={90}
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
                                                    {totalUsers.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className='fill-muted-foreground text-sm'
                                                >
                                                    Total Users
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                        </Pie>
                        <Pie
                            data={outerData.map((item) => ({
                                ...item,
                                fill: chartConfig[item.type as keyof typeof chartConfig]?.color ?? 'transparent'
                            }))}
                            dataKey="count"
                            nameKey="type"
                            innerRadius={95}
                            outerRadius={105}
                            strokeWidth={2}
                            stroke='hsl(var(--background))'
                        >
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
