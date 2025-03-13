import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

export function SelectFieldParams() {
    return (
        <div className="space-y-4">
            {/* Options */}
            <FormField
                name="params.options"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-green">Options</FormLabel>
                        <FormControl>
                            <textarea
                                className="w-full border border-input rounded p-2 placeholder:text-muted-foreground text-sm"
                                placeholder="Enter comma-seperated options"
                                value={field.value?.join(",") ?? ""}
                                onChange={(e) => field.onChange(e.target.value.split(",").map(opt => opt.trim()))} // Ensure trimmed values
                            />
                        </FormControl>
                        <FormMessage></FormMessage>
                    </FormItem>
                )}
            />
        </div>
    );
}