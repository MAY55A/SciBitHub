import {
    Card,
    CardHeader,
    CardTitle,
    CardContent
} from '@/src/components/ui/card';
import { fetchMetrics } from '@/src/lib/services/admin-service';
import { FileText, Flag, GitPullRequest, LucideSearchX, MessageSquare, Users } from 'lucide-react';
import { Suspense } from 'react';
import { Skeleton } from '../../ui/skeleton';

export function AdminMetricsCards() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Suspense fallback={<Skeleton></Skeleton>}>
                <UsersMetricsCard />
            </Suspense>
            <Suspense fallback={<Skeleton></Skeleton>}>
                <ProjectsMetricsCard />
            </Suspense>
            <Suspense fallback={<Skeleton></Skeleton>}>
                <ContributionsMetricsCard />
            </Suspense>
            <Suspense fallback={<Skeleton></Skeleton>}>
                <DiscussionsMetricsCard />
            </Suspense>
            <Suspense fallback={<Skeleton></Skeleton>}>
                <ReportsMetricsCard />
            </Suspense>
        </div>
    )
}

const UsersMetricsCard = async () => {
    const usersMetrics = await fetchMetrics({
        table_name: 'users',
        category_column: 'role',
        category_one: 'researcher',
        category_two: 'contributor',
    });
    if (!usersMetrics) {
        return <ErrorCard type="users" />;
    }

    return (
        <MetricsCard
            title="Total Users"
            value={usersMetrics.total}
            change={usersMetrics.percentageChange}
            icon={<Users className="h-5 w-5" />}
            breakdown={[
                { label: "Researchers", value: usersMetrics.category_one_total },
                { label: "Contributors", value: usersMetrics.category_two_total }
            ]}
        />
    );
}

const ProjectsMetricsCard = async () => {
    const projectsMetrics = await fetchMetrics({
        table_name: 'projects',
        category_column: 'activity_status',
        category_one: 'ongoing',
        category_two: 'completed',
    });
    if (!projectsMetrics) {
        return <ErrorCard type="projects" />;
    }

    return (
        <MetricsCard
            title="Total Projects"
            value={projectsMetrics.total}
            change={projectsMetrics.percentageChange}
            icon={<FileText className="h-5 w-5" />}
            breakdown={[
                { label: "Ongoing", value: projectsMetrics.category_one_total },
                { label: "Completed", value: projectsMetrics.category_two_total }
            ]}
        />
    );
}

const ContributionsMetricsCard = async () => {
    const contributionsMetrics = await fetchMetrics({
        table_name: 'contributions',
        category_column: 'status',
        category_one: 'approved',
        category_two: 'rejected',
    });
    if (!contributionsMetrics) {
        return <ErrorCard type="contributions" />;
    }
    return (
        <MetricsCard
            title="Total Contributions"
            value={contributionsMetrics.total}
            change={contributionsMetrics.percentageChange}
            icon={<GitPullRequest className="h-5 w-5" />}
            breakdown={[
                { label: "Approved", value: contributionsMetrics.category_one_total },
                { label: "Rejected", value: contributionsMetrics.category_two_total }
            ]}
        />
    );
}

const DiscussionsMetricsCard = async () => {
    const discussionsMetrics = await fetchMetrics({
        table_name: 'discussions',
        category_column: 'status',
        category_one: 'open',
        category_two: 'closed',
    });
    if (!discussionsMetrics) {
        return <ErrorCard type="discussions" />;
    }
    return (
        <MetricsCard
            title="Total Discussions"
            value={discussionsMetrics.total}
            change={discussionsMetrics.percentageChange}
            icon={<MessageSquare className="h-5 w-5" />}
            breakdown={[
                { label: "Open", value: discussionsMetrics.category_one_total },
                { label: "Closed", value: discussionsMetrics.category_two_total }
            ]}
        />
    );
}

const ReportsMetricsCard = async () => {
    const reportsMetrics = await fetchMetrics({
        table_name: 'reports',
        category_column: 'status',
        category_one: 'resolved',
        category_two: 'pending',
    });
    if (!reportsMetrics) {
        return <ErrorCard type="reports" />;
    }
    return (
        <MetricsCard
            title="Total Reports"
            value={reportsMetrics.total}
            change={reportsMetrics.percentageChange}
            icon={<Flag className="h-5 w-5" />}
            breakdown={[
                { label: "Resolved", value: reportsMetrics.category_one_total },
                { label: "Pending", value: reportsMetrics.category_two_total }
            ]}
        />
    );
}

const MetricsCard = ({ title, value, change, icon, breakdown }: any) => {
    return (
        <Card key={title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                    <span className={"text-green-500"}>
                        {change}
                    </span> growth this month
                </p>

                <div className="mt-4 flex space-x-4">
                    {breakdown.map((item: any) => (
                        <div key={item.label}>
                            <span className="text-xs text-muted-foreground">{item.label}</span>
                            <p className="text-sm font-medium">{item.value}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

const ErrorCard = ({ type }: { type: string }) => {
    return (
        <Card className="hover:shadow-md transition-shadow text-muted-foreground text-sm ">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="font-medium capitalize">
                    total {type}
                </CardTitle>
                <LucideSearchX color='red' opacity={0.3} />
            </CardHeader>
            <CardContent>
                <div className="p-4"> Oops, an <span className='text-destructive'>error</span> happened while fetching {type} metrics</div>
            </CardContent>
        </Card>
    );
}