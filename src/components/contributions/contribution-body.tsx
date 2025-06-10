import { getFile } from "@/src/utils/minio/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { formatDate } from "date-fns";

export function ContributionBody({ data }: { data: { [key: string]: any } }) {

    const displayFile = async (value: any, index?: number) => {
        const url = await getFile(value);
        if (!url) return <span>File not found</span>;
        return (
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:underline"
            >
                view File {index}
            </a>
        );
    };

    return (
        <div className="p-8">
            <h2 className="text-lg text-primary font-semibold border-b pb-2 mb-4">Data</h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead >Field Label</TableHead>
                        <TableHead>Field Data</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="font-retro">
                    {Object.entries(data).map(([label, fieldData]) => (
                        <TableRow key={label}>
                            <TableCell className="font-medium capitalize">{label.replace(/_/g, " ")}</TableCell>
                            <TableCell>
                                {label === "data_file" ? displayFile(fieldData) :
                                    fieldData.files ?
                                        <ul className="list-disc list-inside">
                                            {fieldData.files.map((file: string, index: number, files: string[]) => (
                                                <li key={index} className="text-muted-foreground hover:underline">
                                                    {displayFile(file, files.length > 1 ? index : undefined)}
                                                </li>
                                            ))}
                                        </ul> :
                                        <span>{String(fieldData.value)}</span>
                                }
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}