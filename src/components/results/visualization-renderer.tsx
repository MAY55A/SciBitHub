"use client";

import { AggregationFunction, ChartType, VisualizationType } from "@/src/types/enums";
import { Visualization } from "@/src/types/models";
import { memo, useEffect, useMemo, useState } from "react";
import {
    LineChart, Line,
    BarChart, Bar,
    PieChart, Pie, Cell,
    XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer
} from "recharts";
import Image from "next/image";
import { getFile } from "@/src/utils/minio/client";

type ChartRendererProps = {
    data: any[];
    files: Map<string, string>; // {filename : filepath}
    config: Visualization;
};

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

export const VisualizationRenderer: React.FC<ChartRendererProps> = memo(({ data, files, config }) => {
    const { type, chart_type, group_by, value_field, display_field, table_columns, title } = config;
    const [displayFiles, setDisplayFiles] = useState<{ fileName: string, url: string }[] | null>(null);
    const chartData = useMemo(() => {
        if (type === VisualizationType.TABLE || type === VisualizationType.GALLERY) return data;

        return transformDataForChart(data, config);
    }, [data, config]);

    useEffect(() => {
        const loadFiles = async () => {
            if (type !== VisualizationType.GALLERY || !chartData?.length) return;

            const results: { fileName: string, url: string }[] = [];

            for (const item of chartData) {
                const fileName = item[display_field!];
                if (!fileName) continue;
                const filePath = files.get(fileName);
                if (!filePath) continue;
                const fileUrl = await getFile(filePath);
                if (!fileUrl) continue;
                results.push({ fileName, url: fileUrl });
            }

            setDisplayFiles(results);
        };

        loadFiles();
    }, [chartData, files, display_field, type]);

    const renderChart =  () => {
        if (type === VisualizationType.GALLERY) {
            if (!displayFiles) return <p>Loading files...</p>;
            if (!displayFiles.length) return <p>No files found.</p>;

            return (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {displayFiles.map((file, index) => (
                        <div key={index} className="rounded overflow-hidden shadow">
                            <Image
                                src={file.url}
                                alt={file.fileName}
                                width={300}
                                height={200}
                                className="w-full h-auto object-cover"
                            />
                            <div className="text-sm text-center mt-1">{file.fileName}</div>
                        </div>
                    ))}
                </div>
            );
        }
        if (type === VisualizationType.TABLE) {
            if (!data || data.length === 0) return <p>No data to show in table</p>;
            return (
                <div className="max-h-[400px]">
                    <table className="min-w-full border text-sm text-left">
                        <thead className="bg-gray-100 dark:bg-gray-800">
                            <tr>
                                <th className="border px-4 py-2">#</th>
                                {table_columns!.map((key) => (
                                    <th key={key} className="border px-4 py-2">{key}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, idx) => (
                                <tr key={idx}>
                                    <td className="border px-4 py-2">{idx + 1}</td>
                                    {table_columns!.map((key) => (
                                        <td key={key} className="border px-4 py-2">
                                            {typeof row[key] === "string" && row[key].startsWith("http") ? (
                                                <a href={row[key]} target="_blank" className="text-blue-500 underline">File</a>
                                            ) : (
                                                row[key]?.toString() || "-"
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }
        switch (chart_type) {
            case ChartType.BAR:
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <XAxis dataKey={group_by} />
                            <YAxis />
                            <Tooltip />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                )
            case ChartType.LINE:
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <XAxis dataKey={group_by} />
                            <YAxis />
                            <Tooltip />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Line type="monotone" dataKey="value" stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer >

                )
            case ChartType.PIE:
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Tooltip />
                            <Legend />
                            <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey={group_by}
                                outerRadius={100}
                                fill="#8884d8"
                                label
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                )
        }
    }
    return (
        <div className="my-4 p-4 border rounded-lg shadow">
            <h3 className="text-lg font-semibold text-center mb-2">{title}</h3>
            {renderChart()}
        </div>
    );
}, (prevProps, nextProps) => {
    return JSON.stringify(prevProps.config) === JSON.stringify(nextProps.config)
        && JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data)
        && JSON.stringify(prevProps.files) === JSON.stringify(nextProps.files);
});

function safeNumber(value: any): number {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
}

function applyCustomFunction(funcStr: string, value: any): any {
    try {
        const fn = new Function('x', `return (${funcStr})(x)`);
        return fn(value);
    } catch {
        return value;
    }
}

function aggregateGroup(values: any[], aggregation?: AggregationFunction, customFn?: string): any {
    if (aggregation === 'count') return values.length;
    if (aggregation === 'sum') return values.reduce((a, b) => a + safeNumber(b), 0);
    if (aggregation === 'average') return values.reduce((a, b) => a + safeNumber(b), 0) / values.length;
    if (aggregation === 'min') return Math.min(...values.map(safeNumber));
    if (aggregation === 'max') return Math.max(...values.map(safeNumber));
    if (aggregation === 'custom' && customFn) {
        return values.map(v => applyCustomFunction(customFn, v));
    }
    return values;
}

function transformDataForChart(data: any[], config: Visualization) {
    const groupByField = config.group_by;
    const valueField = config.value_field;
    const aggregation = config.aggregation;

    if (!groupByField) return [];

    const grouped = new Map<string, any[]>();

    // Group values by the group_by field
    data.forEach((row) => {
        const key = row[groupByField];
        if (!grouped.has(key)) grouped.set(key, []);
        grouped.get(key)?.push(row);
    });

    const result = Array.from(grouped.entries()).map(([key, group]) => {
        const yVal = valueField
            ? aggregateGroup(group.map((g) => g[valueField]), aggregation, config.custom_function)
            : group.length; // for count-only charts (e.g., pie without value field)

        return {
            [groupByField]: key,
            value: yVal,
        };
    });

    return result;
}