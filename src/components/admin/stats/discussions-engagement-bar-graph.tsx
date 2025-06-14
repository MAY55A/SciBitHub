'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
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
import { Button } from '../../ui/button';
import { ChevronDown, ChevronUp, MessageCircleReply } from 'lucide-react';

const chartConfig = {
    replies: {
        label: 'Replies',
        color: '#dfc742bf',
    },
    upvotes: {
        label: 'Upvotes',
        color: '#0080008a'
    },
    downvotes: {
        label: 'Downvotes',
        color: '#ff00008a'
    }
} satisfies ChartConfig;

const interactions = ['replies', 'upvotes', 'downvotes'];
const functions = {
    replies: 'admin_discussions_most_engaged',
    upvotes: 'admin_discussions_most_upvoted',
    downvotes: 'admin_discussions_most_downvoted'
};
const icons = {
    replies: <MessageCircleReply color='#dfc742bf' size={18} />,
    upvotes: <ChevronUp color='#0080008a' size={18} />,
    downvotes: <ChevronDown color='#ff00008a' size={18} />
};

export function DiscussionsEngagementBarGraph() {
    const [activeChart, setActiveChart] = useState<keyof typeof chartConfig>('replies');
    const [isClient, setIsClient] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [data, setData] = useState<any[]>([]);
    const supabase = createClient();

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        startTransition(async () => {
            const { data, error } = await supabase.rpc(functions[activeChart], {
                limit_count: 5,
            });
            if (!error) {
                setData(data);
            } else {
                console.log(error);
            }
        });
    }, [activeChart]);

    if (!isClient) {
        return null;
    }

    return (
        <Card className='@container/card !pt-3'>
            <CardHeader className='flex flex-col items-stretch space-y-0 border-b !p-0 sm:flex-row'>
                <div className='flex flex-1 flex-col justify-center gap-1 px-6 !py-0'>
                    <CardTitle>Discussions Engagement</CardTitle>
                    <CardDescription className='font-retro'>
                        <span className='hidden @[540px]/card:block'>
                            Top 5 discussions with most {activeChart}
                        </span>
                        <span className='@[540px]/card:hidden'>Top 5 discussions with most {activeChart}</span>
                    </CardDescription>
                </div>
                <div className="flex flex-nowrap overflow-x-auto [&>*]:flex-shrink-0">
                    {interactions.map((key) => {
                        const chart = key as keyof typeof chartConfig;
                        return (
                            <Button
                                variant="ghost"
                                disabled={isPending}
                                key={chart}
                                data-active={activeChart === chart}
                                className=" h-full min-w-[100px] flex-1 data-[active=true]:bg-muted flex flex-col justify-center gap-1 border-r border-b p-4 text-left transition-colors duration-200 last:border-r-0 sm:p-6"
                                onClick={() => setActiveChart(chart)}
                            >
                                {icons[chart]}
                                <span className="font-bold">
                                    {chartConfig[chart].label}
                                </span>
                            </Button>
                        );
                    })}
                </div>
            </CardHeader>
            <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
                <ChartContainer
                    config={chartConfig}
                    className='aspect-auto h-[250px] w-full'
                >
                    <BarChart
                        data={data}
                        margin={{
                            left: 12,
                            right: 12
                        }}
                    >
                        <defs>
                            <linearGradient id='fillBar' x1='0' y1='0' x2='0' y2='1'>
                                <stop
                                    offset='0%'
                                    stopColor={chartConfig[activeChart].color}
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset='100%'
                                    stopColor={chartConfig[activeChart].color}
                                    stopOpacity={0.2}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        {data.length < 4 && (
                            <XAxis
                                dataKey='discussion_title'
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                interval={0}
                                tick={({ x, y, payload }) => (
                                    <text
                                        x={x}
                                        y={y + 12}
                                        textAnchor="middle"
                                        fontSize={11}
                                    >
                                        {payload.value.length > 20 ? `${payload.value.slice(0, 17)}...` : payload.value}
                                    </text>
                                )}
                            />
                        )}
                        <ChartTooltip
                            cursor={{ opacity: 0.5 }}
                            content={
                                <ChartTooltipContent
                                    className='w-[150px]'
                                    nameKey={activeChart}
                                    hideIndicator
                                />
                            }
                        />
                        <Bar
                            dataKey={activeChart}
                            fill='url(#fillBar)'
                            radius={[4, 4, 0, 0]}
                            minPointSize={2}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}