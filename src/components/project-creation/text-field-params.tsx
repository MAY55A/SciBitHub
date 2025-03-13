import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

export function TextFieldParams() {
    return (
        <div className="space-y-4">
            {/* Min Length */}
            <FormField
                name="params.minLength"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-green">Min Length (optional)</FormLabel>
                        <FormControl>
                            <Input {...field} type="number" value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage></FormMessage>
                    </FormItem>
                )}
            />

            {/* Max Length */}
            <FormField
                name="params.maxLength"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-green">Max Length (optional)</FormLabel>
                        <FormControl>
                            <Input {...field} type="number" value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage></FormMessage>
                    </FormItem>
                )}
            />
        </div>
    );
}