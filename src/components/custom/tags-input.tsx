import { useState } from "react"

export default function TagsInput({ onChange, tags }: { onChange: (values: string[]) => void, tags: string[] }) {
    const [values, setValues] = useState<string[]>(tags);

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key !== 'Enter') return
        e.preventDefault(); // Prevent form submission
        const value = e.currentTarget.value.trim();
        if (!value) return;
        if (!values.includes(value)) {
            const newValues = [...values, value];
            setValues(newValues);
            onChange(newValues);
        }

        e.currentTarget.value = '';
    }

    function removeValue(index: number) {
        const newValues = values.filter((_, i) => i !== index);
        setValues(newValues);
        onChange(newValues);
    }

    return (
        <div className="flex flex-wrap border border-input rounded-md p-1 gap-2">
            {values.map((value, index) => (
                <div className="bg-muted rounded-3xl py-2 px-3" key={index}>
                    <span className="text-sm">{value}</span>
                    <span className="inline-flex justify-center items-center h-4 w-4 rounded-full text-red-400 hover:text-red-500 cursor-pointer ml-2" onClick={() => removeValue(index)}>&times;</span>
                </div>
            ))}
            <input onKeyDown={handleKeyDown} type="text" className="w-full flex-grow-1 p-2 border-none outline-none text-sm text-muted-foreground" placeholder="write tag   (press Enter)" />
        </div>
    )
}