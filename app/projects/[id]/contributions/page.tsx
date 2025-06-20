import { fetchContributions, fetchFirstTaskContributions } from "@/src/lib/fetch-data";
import { TabsContent } from "@/src/components/ui/tabs";
import { DataTable } from "@/src/components/data-table/data-table";
import { columns } from "@/src/components/contributions/columns";
import { Contribution } from "@/src/types/models";
import { notFound } from "next/navigation";
import { contributionsFilters } from "@/src/components/contributions/filters";
import { ContributionsGroupActions } from "@/src/components/contributions/group-actions";
import { softDeleteContributions } from "@/src/lib/actions/contribution-actions";

export default async function Page({
    searchParams,
    params,
}: {
    searchParams: { task?: string };
    params: { id: string };
}) {

    let task = (await searchParams).task;
    const project = (await params).id;
    let contributions: Contribution[] = [];
    if (!task) {
        // If no task_id is provided, fetch the contributions for the first task
        const data = await fetchFirstTaskContributions(project);
        if (data) {
            contributions = data.contributions;
            task = data.task;
        } else {
            return notFound();
        }
    } else {
        // If task_id is provided, fetch the specific task's contributions
        contributions = (await fetchContributions([task])).contributions ?? [];
    }

    return (
        <TabsContent value={task} className="h-full mt-16">
            <h2 className="text-center font-semibold text-lg mt-8">Contributions</h2>
            <DataTable
                columns={columns}
                data={contributions}
                searchColumn="contributor"
                filters={contributionsFilters}
            >
                        <ContributionsGroupActions />
            </DataTable>
        </TabsContent>
    );
}

