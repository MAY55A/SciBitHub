import { FormMessage, Message } from "@/src/components/custom/form-message";
import { Button } from "@/src/components/ui/button";
import CardGridSelect from "@/src/components/ui/card-grid-select";
import { researchDomains } from "@/src/data/fields";
import { updateMetadata } from "@/src/lib/actions/account-actions";
import { useState } from "react";

export function InterestsForm({ interests }: { interests: string[] }) {
    const [initialInterests, setInitialInterests] = useState(interests);
    const [selected, setSelected] = useState(interests);
    const [message, setMessage] = useState<Message | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSelect = (newSelection: string[]) => {
        setSelected(newSelection);
        setMessage(null);
    };
    const reset = () => {
        setSelected([...initialInterests]);
        setMessage(null);
    }
    const onSubmit = async () => {
        if (selected.length === 0) {
            setMessage({ error: 'Please select at least one field.' });
            return;
        }

        if (JSON.stringify(selected) === JSON.stringify(initialInterests)) {
            setMessage({ error: 'No changes were made.' });
            return;
        }
        setIsSubmitting(true);
        const res = await updateMetadata({ interests: selected })
        setIsSubmitting(false);
        if (res.success) {
            setInitialInterests(selected);
            setMessage({ success: "Interests updated successfully." });
        } else {
            setMessage({ error: "Error updating interests." });
        }
    }

    return (
        <form
            className="flex flex-col gap-4 border rounded-lg p-10"
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}
        >
            <div>
                <h2 className="text-primary font-semibold">Fields of Interest</h2>
                <p className="mt-1 text-sm text-muted-foreground font-retro">
                    Pick the fields that interest you the most.
                </p>
            </div>
            <CardGridSelect
                key={selected.join(',')}
                options={researchDomains}
                value={selected}
                showDescription={false}
                onChange={handleSelect}
            />
            {message && <FormMessage message={message} />}
            <div className="mt-6 flex items-center justify-end gap-x-6">
                <Button type="reset" variant="secondary" size="sm" onClick={reset}>
                    Reset
                </Button>
                <Button
                    type="submit" size="sm"
                    onClick={onSubmit}
                    disabled={selected.length === 0 || isSubmitting}
                >
                    {isSubmitting ? "Saving..." : "Save"}
                </Button>
            </div>
        </form>
    );
}