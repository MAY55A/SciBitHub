import {
    Card,
    CardHeader,
    CardContent,
    CardTitle,
    CardDescription
} from '@/src/components/ui/card';
import { fetchMostActiveForums } from '@/src/lib/services/admin-service';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export async function MostActiveForums() {
    const data = await fetchMostActiveForums();
    const total = data.reduce((acc: number, item: any) => acc + item.topics, 0);

    return (
        <Card className='h-full'>
            <CardHeader>
                <CardTitle>Most Active Forums</CardTitle>
                <CardDescription className='font-retro'>With {total} topics in total.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className='space-y-4 font-retro'>
                    {data.map((item: any, index: number) => (
                        <div key={index} className='flex items-center gap-2 border-b pb-4 last:border-b-0'>
                            <div className='ml-4 space-y-1'>
                                <p className='text-sm leading-none font-medium'>{item.project_name}</p>
                                <p className='text-muted-foreground text-sm'>with {item.topics} topics</p>
                            </div>
                            <Link href={`/projects/${item.project_id}?tab=forum`} className='ml-auto font-medium' title='View Forum'>
                                <ChevronRight size={16}/>
                            </Link>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}