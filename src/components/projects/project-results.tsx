import { ExportData } from "../results/export-data";
import CustomizeDataVisualizationDialog from "../results/customize-visualizations-dialog";
import { Task } from "@/src/types/models";
import ResultsSummaryFormDialog from "../results/results-summary-form-dialog";
import { fetchContributionsData, fetchProjectResultsSummary, fetchTasksForResults, fetchVisualizations } from "@/src/lib/fetch-data";
import { MarkdownViewer } from "../custom/markdown-viewer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import Visualizations from "../results/visualizations";
import { CustomCollapsible } from "../custom/collapsible";

export async function ProjectResults({ projectId, canEdit }: { projectId: string, canEdit: boolean }) {
    const dataPerTask = new Map<string, any>();
    const filesPerTask = new Map<string, Map<string, string>>();
    const summary = await fetchProjectResultsSummary(projectId);
    const tasks = await fetchTasksForResults(projectId);
    const visualizations = await fetchVisualizations(projectId);

    for (const task of tasks) {
        const data = await fetchContributionsData(task.id);
        const allFiles = new Map<string, string>();
        const flattenedData = data?.map((item) => {
            const { flat, files } = flattenData(item.data);
            for (const [key, value] of files) {
                allFiles.set(key, value);
            }
            return { contribution_id: item.id, ...Object.fromEntries(flat) };
        }) || [];
        dataPerTask.set(task.id, flattenedData);
        filesPerTask.set(task.id, allFiles);
    };

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-10">
            <Accordion type="multiple" className="w-full" defaultValue={["summary"]}>
                <AccordionItem value="summary">
                    <div className="flex justify-between items-center">
                        <AccordionTrigger>
                            <span className="text-lg font-semibold mr-2">Results Summary</span>
                        </AccordionTrigger>
                        {canEdit && <ResultsSummaryFormDialog projectId={projectId} currentSummary={summary ?? ""} />}
                    </div>
                    <AccordionContent>
                        {summary?.length ? <MarkdownViewer source={summary} /> : <p className="text-muted-foreground font-retro">No summary available.</p>}
                    </AccordionContent>
                </AccordionItem>
                <CustomCollapsible
                    triggerText="Data Visualizations"
                    button={
                        canEdit ?
                            <CustomizeDataVisualizationDialog projectId={projectId} tasks={tasks as Task[]} currentVisualizations={visualizations} />
                            : null
                    }
                >
                    {visualizations.length ?
                        <Visualizations visualizations={visualizations} dataPerTask={dataPerTask} filesPerTask={filesPerTask} /> :
                        <p className="text-muted-foreground font-retro text-sm">No visualizations available.</p>
                    }
                </CustomCollapsible>
                <AccordionItem value="export">
                    <AccordionTrigger className="justify-start">
                        <span className="text-lg font-semibold mr-2">Export Data</span>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-col gap-4">
                            {tasks.map((task) => {
                                const data = dataPerTask.get(task.id);
                                const files = filesPerTask.get(task.id);
                                if (data && data.length > 0) {
                                    return (
                                        <ExportData task={task.title} data={data} files={files} key={task.id} />
                                    );
                                }
                            })}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}

function flattenData(data: Record<string, any>) {
    const flat = new Map<string, string>();
    const files = new Map<string, string>(); // filename: filepath
    for (const [key, value] of Object.entries(data)) {
        if (value?.value !== undefined) {
            flat.set(key, value.value);
        } else if (value?.file !== undefined) {
            const path = value.file;
            const filename = path.split("/").pop()!;
            flat.set(key, filename);
            files.set(filename, path);
        } else if (value?.files !== undefined && value.files.length > 0) {
            const filename = value.files[0].split("/").pop()!;
            files.set(filename, value.files[0]);
            flat.set(key, filename);
        } else if (typeof value === "string") { // if key = data_file
            const path = value;
            const filename = path.split("/").pop()!;
            flat.set(key, filename);
            files.set(filename, path);
        } else {
            flat.set(key, "");
        }
    }
    return { flat, files };
}



