import { fetchContributions } from "@/src/lib/fetch-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { formatDate } from "@/src/utils/utils";

export async function LatestContributions({tasks}: {tasks: string[]}) {
    const {contributions} = await fetchContributions(tasks, undefined, 1);

    return (
        <div className="w-full max-w-[1000px] flex flex-col items-center gap-4 mb-12">
            <h2 className="text-lg font-semibold">Latest Contributions</h2>
            <Table className="font-retro">
                <TableHeader>
                    <TableRow>
                        <TableHead >Contributor</TableHead>
                        <TableHead>Task</TableHead>
                        <TableHead className="text-right">Submitted On</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {contributions && contributions.length ? contributions.map((contribution) => (
                        <TableRow key={contribution.id!}>
                            <TableCell className="font-medium">{!contribution.user?.username || contribution.user.deleted_at ? "**Deleted User**" : contribution.user.username}</TableCell>
                            <TableCell>{contribution.task.title}</TableCell>
                            <TableCell className="text-right">{formatDate(contribution.created_at!, true)}</TableCell>
                        </TableRow>
                    )):
                    <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                        No contributions yet.
                    </TableCell>
                </TableRow>
                }
                </TableBody>
            </Table>
        </div>
    );
}