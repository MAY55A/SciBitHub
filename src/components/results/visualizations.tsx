'use client';

import { useMemo } from "react";
import { VisualizationRenderer } from "./visualization-renderer";
import { Visualization } from "@/src/types/models";

export default function Visualizations(
    { visualizations, dataPerTask, filesPerTask }: { visualizations: Visualization[], dataPerTask: Map<string, any>, filesPerTask: Map<string, any> }) {
    const renderedVisualizations = useMemo(() => {
        return (
            <div>
                {visualizations.map((visualization) => {
                    const data = dataPerTask.get(visualization.task);
                    const files = filesPerTask.get(visualization.task);

                    if (data && data.length > 0) {
                        return (
                            <div key={visualization.id} className="mb-4">
                                <VisualizationRenderer data={data} files={files} config={visualization} />
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
        );
    }, [visualizations, dataPerTask, filesPerTask]);

    return (
        <div className="grid gap-8">
            {renderedVisualizations}
        </div>
    );
}
