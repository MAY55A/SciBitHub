"use client";

import MDEditor from "@uiw/react-md-editor";
import { useTheme } from "next-themes";
import rehypeSanitize from "rehype-sanitize";

export const MarkdownEditor = ({className, height, value, onChange}: {className?: string, height?: number, value?: string, onChange: any}) => {
    const { resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme === 'dark' ? 'dark' : 'light';

    return (
        <MDEditor
            data-color-mode={currentTheme}
            preview="edit"
            previewOptions={{
                rehypePlugins: [[rehypeSanitize]],
            }}
            className={className}
            height={height}
            value={value}
            onChange={onChange}
        />
    );
};