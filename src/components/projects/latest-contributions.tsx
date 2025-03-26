import { fetchContributions } from "@/src/lib/fetch-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { formatDate } from "@/src/utils/utils";

export async function LatestContributions({tasks}: {tasks: string[]}) {
    const contributions = await fetchContributions(tasks);

    return (
        <div className="flex flex-col items-center gap-4">
            <h2 className="text-lg font-semibold">Latest Contributions</h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead >Contributor</TableHead>
                        <TableHead>Task</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Added On</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {contributions?.map((contribution) => (
                        <TableRow key={contribution.id!}>
                            <TableCell className="font-medium">{contribution.user.username}</TableCell>
                            <TableCell>{contribution.task.title}</TableCell>
                            <TableCell>{contribution.status}</TableCell>
                            <TableCell className="text-right">{formatDate(contribution.created_at!, true)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}