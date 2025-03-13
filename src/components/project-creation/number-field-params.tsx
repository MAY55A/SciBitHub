import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

export function NumberFieldParams() {
    return (
        <div className="space-y-4">
            {/* Min Value */}
            <FormField
                name="params.minValue"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-green">Min Value (optional)</FormLabel>
                        <FormControl>
                            <Input {...field} type="number" value={field.value  ?? ''} />
                        </FormControl>
                        <FormMessage></FormMessage>
                    </FormItem>
                )}
            />

            {/* Max Value */}
            <FormField
                name="params.maxValue"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-green">Max Value (optional)</FormLabel>
                        <FormControl>
                            <Input {...field} type="number" value={field.value  ?? ''}/>
                        </FormControl>
                        <FormMessage></FormMessage>
                    </FormItem>
                )}
            />
        </div>
    );
}