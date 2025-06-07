"use client";

import MDEditor from "@uiw/react-md-editor";
import { useTheme } from "next-themes";

export const MarkdownViewer = ({ source, className, style }: { source: string, className?: string, style?: React.CSSProperties }) => {
    const { resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme === 'dark' ? 'dark' : 'light';

    return (
        <div data-color-mode={currentTheme}>
            <MDEditor.Markdown
                source={source}
                className={className}
                style={{ backgroundColor: 'transparent', fontFamily: "Courier New, Courier, monospace", ...style }}
            />
        </div>
    );
}