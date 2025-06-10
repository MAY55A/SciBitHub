import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import React, { JSX, Ref } from 'react';
import { FieldConfig } from '@/src/types/models';
import { cn } from '@/src/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const fileTypeMap: Record<string, string> = {
    image: "image/*",
    document: "application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, text/*",
    audio: "audio/*",
    video: "video/*"
};

export const FormGenerator = (
    { ref, fields, handleSubmit, children, formData, setFormData }:
        {
            ref?: Ref<HTMLFormElement>
            fields: FieldConfig[],
            handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
            children: any,
            formData: { [key: string]: any },
            setFormData: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>
        },
) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: { value } }));
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, field: any) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const maxFiles = field.params?.maxFiles;
        const maxSize = (field.params?.maxSize ?? Math.min(5 * files.length, 300)) * 1024 * 1024; // default 5MB

        if (maxFiles && files.length > maxFiles) {
            alert(`You can only upload up to ${maxFiles} file(s).`);
            event.target.value = '';
            return;
        }

        const totalSize = Array.from(files).reduce((acc, file) => acc + file.size, 0);
        if (totalSize > maxSize) {
            alert(`Total files size is too large! Maximum allowed size is ${(maxSize / (1024 * 1024)).toFixed(1)} MB.`);
            event.target.value = "";
            return;
        }

        // Proceed with setting the file
        setFormData((prev) => ({
            ...prev,
            [field.label]: { files },
        }));
    };

    // Map input types to corresponding components
    const fieldRenderers: {
        [key: string]: (field: FieldConfig) => JSX.Element;
    } = {
        text: (field) => (
            <Input
                type="text"
                name={field.label}
                placeholder={field.placeholder}
                required={field.required}
                value={formData[field.label]?.value || ''}
                onChange={handleChange}
                minLength={field.params?.minLength}
                maxLength={field.params?.maxLength}
            />
        ),
        number: (field) => (
            <Input
                type="number"
                name={field.label}
                placeholder={field.placeholder}
                required={field.required}
                value={formData[field.label]?.value || ''}
                onChange={handleChange}
                min={field.params?.minValue}
                max={field.params?.maxValue}
            />
        ),
        file: (field) => (
            <Input
                type="file"
                name={field.label}
                placeholder={field.placeholder}
                accept={field.params?.extensions
                    ? field.params.extensions.map(ext => `.${ext.trim()}`)?.join(",")
                    : field.params?.fileType ? fileTypeMap[field.params.fileType] : undefined}
                required={field.required}
                multiple={!field.params?.maxFiles || field.params.maxFiles > 1}
                onChange={(e) => handleFileChange(e, field)}
            />
        ),
        textarea: (field) => (
            <textarea
                name={field.label}
                placeholder={field.placeholder}
                required={field.required}
                value={formData[field.label]?.value || ''}
                onChange={handleChange}
                className="p-2 border rounded w-full"
            ></textarea>
        ),
        date: (field) => (
            <Input
                type="date"
                name={field.label}
                required={field.required}
                value={formData[field.label]?.value || ''}
                onChange={handleChange}
                className="p-2 border rounded"
            />
        ),
        select: (field) =>
            !!field.params?.options && field.params.options.length < 6 ?
                <div role="radiogroup" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {field.params?.options?.map(option => {
                        const isSelected = formData[field.label]?.value === option;
                        return (
                            <label
                                key={option}
                                htmlFor={option}
                                className={cn("p-4 rounded-xl border cursor-pointer transition-all text-foreground block",
                                    isSelected ? 'bg-muted ring-1 ring-ring' : 'bg-background'
                                )}
                            >
                                <input
                                    type="radio"
                                    id={option}
                                    name={field.label}
                                    value={option}
                                    required={field.required}
                                    checked={isSelected}
                                    onChange={(e) =>
                                        handleChange({
                                            target: {
                                                name: field.label,
                                                value: e.target.value,
                                            },
                                        } as React.ChangeEvent<HTMLInputElement>)
                                    }
                                    className="sr-only"
                                />
                                {option}
                            </label>
                        );
                    })}
                </div>
                :
                <Select
                    required={field.required}
                    onValueChange={(selectedOption) =>
                        handleChange({
                            target: {
                                name: field.label,
                                value: selectedOption ?? '',
                            },
                        } as React.ChangeEvent<HTMLInputElement>)}
                    defaultValue={formData[field.label]?.value ?? ''}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                        {field.params?.options?.map(value =>
                            <SelectItem key={value} value={value}>{value}</SelectItem>
                        )}
                    </SelectContent>
                </Select>
    };

    return (
        <form ref={ref} onSubmit={handleSubmit} className="space-y-8 p-6">
            {fields.map((field: any) => (fieldRenderers[field.type] ?
                <div key={field.label} className="flex flex-col space-y-2 w-full font-retro">
                    <Label htmlFor={field.label} className="font-semibold">
                        {field.label}
                        {field.required && <span className="ml-1 text-red-500">*</span>}
                    </Label>
                    {field.description && <p className="text-sm text-muted-foreground pb-2">{field.description}</p>}
                    {fieldRenderers[field.type](field)}
                </div>
                : null))}
            {children}
        </form>
    );
};