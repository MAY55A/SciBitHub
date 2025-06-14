'use client'

import { createClient } from '@/src/utils/supabase/client';
import { startTransition, useEffect, useMemo, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/src/components/ui/card';
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/src/components/ui/chart';
import { Label, Pie, PieChart } from 'recharts';
import { PieGraphSkeleton } from './pie-graph-skeleton';

const createDomainChartConfig = (baseColor: string, domains: string[]) => {
    const totalDomains = domains.length;
    return domains.reduce((config, domain, index) => {
        const opacity = (index + 1) / totalDomains;

        return {
            ...config,
            [domain]: {
                label: domain.charAt(0).toUpperCase() + domain.slice(1),
                color: `hsla(${baseColor} / ${opacity.toFixed(2)})`
            }
        };
    }, {} as ChartConfig);
};

export default function ProjectsDomainsPieChart() {
    const [data, setData] = useState<{ domain: string, count: number }[]>([]);
    const supabase = createClient();

    useEffect(() => {
        startTransition(async () => {
            const { data, error } = await supabase.rpc('admin_project_domains_distribution');
            if (!error) {
                setData(data);
            } else {
                console.log(error);
            }
        });
    }, []);

    const chartConfig = useMemo(() => {
        const domains = data.map((item) => item.domain);
        return createDomainChartConfig('5 100% 69%', domains);
    }, [data]);

    if (data.length === 0) {
        return <PieGraphSkeleton />;
    }

    return (
        <Card className='@container/card'>
            <CardHeader>
                <CardTitle>Project Domain Distribution</CardTitle>
                <CardDescription className='font-retro'>
                    <span className='hidden @[540px]/card:block'>
                        Total Projects by domain distribution
                    </span>
                    <span className='@[540px]/card:hidden'>Showing total of projects by domain distribution</span>
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
                        {data.length < 7 &&
                            <ChartLegend content={<ChartLegendContent className='flex-wrap' />} />
                        }
                        <Pie
                            data={data.map((item) => ({
                                ...item,
                                fill: chartConfig[item.domain as keyof typeof chartConfig].color
                            }))}
                            dataKey='count'
                            nameKey='domain'
                            innerRadius={80}
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
                                                    {data.length}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className='fill-muted-foreground text-sm'
                                                >
                                                    Total Domains
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