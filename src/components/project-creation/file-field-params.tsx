import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export function FileFieldParams() {

    return (
        <div className="space-y-4">
            {/* Allowed File Type */}
            <FormField
                name="params.fileType"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-green">Allowed File Type</FormLabel>
                        <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value ?? ''}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="image">Images</SelectItem>
                                    <SelectItem value="document">Documents (PDF, DOCX)</SelectItem>
                                    <SelectItem value="audio">Audio Files</SelectItem>
                                    <SelectItem value="video">Video Files</SelectItem>                                            </SelectContent>
                            </Select>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            {/* Allowed Extensions */}
            <FormField
                name="params.extensions"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-green">Allowed Extensions (optional)</FormLabel>
                        <FormControl>
                            <textarea
                                className="w-full border border-input rounded p-2 text-sm"
                                placeholder="Enter comma-separated extensions (e.g., jpg, png, pdf)"
                                value={field.value?.join(",") ?? ""}
                                onChange={(e) => field.onChange(e.target.value.split(",").map(ext => ext.trim()))}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            {/* File Size Limits */}
            <FormField
                name="params.maxSize"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-green">Max File Size (MB) (optional)</FormLabel>
                        <FormControl>
                            <input
                                type="number"
                                className="w-full border border-input rounded p-2 text-sm"
                                placeholder="Max size in MB"
                                value={field.value ?? ""}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            {/* File Count Limits */}
            <FormField
                name="params.maxFiles"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-green">Max Files (optional)</FormLabel>
                        <FormControl>
                            <input
                                type="number"
                                className="w-full border border-input rounded p-2 text-sm"
                                placeholder="Maximum number of files"
                                value={field.value ?? ""}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}