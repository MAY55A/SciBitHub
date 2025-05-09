//'use client'

import { AdminMetricsCards } from "@/src/components/admin/stats/admin-metrics-cards";
import { ContributionsGrowthChart } from "@/src/components/admin/stats/contributions-growth-chart";
import ProjectsActivityStatusPieChart from "@/src/components/admin/stats/projects-activity-status-pie-chart";
import { TopContributors } from "@/src/components/admin/stats/top-contributors";
import { UsersGrowthChart } from "@/src/components/admin/stats/users-growth-chart";
import { Card } from "@/src/components/ui/card";
import { useAuth } from "@/src/contexts/AuthContext";
import { useEffect } from "react";

export default function Page() {
    /*    const { user, loading, fetchUser } = useAuth();
    
        useEffect(() => {
            if (!loading && !user) {
                fetchUser();
            }
        }, []);
        */

    return (
        <div className='container flex max-w-7xl flex-col space-y-4 p-4'>
            <div className='flex flex-1 flex-col space-y-2'>
                <div className='flex items-center justify-between space-y-2'>
                    <h2 className='text-2xl font-bold tracking-tight'>
                        Overview
                    </h2>
                </div>
            </div>
            <AdminMetricsCards />
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
                <div className='col-span-4'>
                    <UsersGrowthChart />
                </div>
                <Card className='col-span-4 md:col-span-3'>
                    <TopContributors />
                </Card>
                <div className='col-span-4'>
                    <ContributionsGrowthChart />
                </div>
                <div className='col-span-4 md:col-span-3'>
                    <ProjectsActivityStatusPieChart />
                </div>
            </div>
        </div>
    );
}