import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import {
    Card,
    CardHeader,
    CardContent,
    CardTitle,
    CardDescription
} from '@/src/components/ui/card';
import { fetchTopContributors } from '@/src/lib/services/admin-service';
import { formatDate } from '@/src/utils/utils';
import Link from 'next/link';

export async function TopContributors() {
    const contributors = await fetchTopContributors({ time_range: '30d' });
    console.log("Top Contributors:", contributors);
    return (
        <Card className='h-full'>
            <CardHeader>
                <CardTitle>Top Contributors</CardTitle>
                <CardDescription>Contributions made for the last 30 days.</CardDescription>
            </CardHeader>
            <CardContent>
                {contributors.length === 0 &&
                    <div className='flex items-center justify-center h-full w-full p-16'>
                        <p className='text-sm'>No contributions found.</p>
                    </div>
                }
                <div className='space-y-8'>
                    {contributors.map((contributor, index) => (
                        <div key={index} className='flex items-center'>
                            <Avatar className="relative flex shrink-0 overflow-hidden h-8 w-8 rounded-lg hover:shadow-lg">
                                <AvatarImage src={contributor.profile_picture ?? undefined} alt="avatar" />
                                <AvatarFallback className="text-primary opacity-80 text-sm rounded-lg border border-primary">{contributor.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className='ml-4 space-y-1'>
                                <Link href={`/users/${contributor.user_id}`} className='text-sm leading-none font-medium hover:underline'>{contributor.username}</Link>
                                <p className='text-muted-foreground text-sm'>last contribution {formatDate(contributor.last_contribution)}</p>
                            </div>
                            <div className='ml-auto font-medium text-sm'>{contributor.contribution_count} contributions</div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}