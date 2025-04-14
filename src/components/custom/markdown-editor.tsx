"use client";

import MDEditor from "@uiw/react-md-editor";
import { useTheme } from "next-themes";
import rehypeSanitize from "rehype-sanitize";

export const MarkdownEditor = ({ className, minHeight, maxHeight, value, onChange }: { className?: string, minHeight?: number, maxHeight?: number, value?: string, onChange: any }) => {
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
            height={0}
            minHeight={minHeight}
            maxHeight={maxHeight}
            value={value}
            onChange={onChange}
            onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                    // Prevent form submit if inside a form
                    e.stopPropagation();
                }
            }}
        />
    );
};