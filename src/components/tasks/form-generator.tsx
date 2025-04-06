import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import Select from 'react-select';
import React, { JSX, Ref } from 'react';
import { FieldConfig } from '@/src/types/models';
import { cn } from '@/src/lib/utils';

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
            <div key={field.label} className="flex flex-col space-y-2 w-full">
                <Label htmlFor={field.label} className="font-medium">
                    {field.label}
                </Label>
                {field.description && <p className="text-sm text-muted-foreground pb-4">{field.description}</p>}
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
            </div>
        ),
        number: (field) => (
            <div key={field.label} className="flex flex-col space-y-2 w-full">
                <Label htmlFor={field.label} className="font-medium">
                    {field.label}
                </Label>
                {field.description && <p className="text-sm text-muted-foreground pb-4">{field.description}</p>}
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
            </div>
        ),
        file: (field) => (
            <div key={field.label} className="flex flex-col space-y-2 w-full">
                <Label htmlFor={field.label} className="font-medium">
                    {field.label}
                </Label>
                {field.description && <p className="text-sm text-muted-foreground pb-4">{field.description}</p>}
                <Input
                    type="file"
                    name={field.label}
                    placeholder={field.placeholder}
                    accept={field.params?.extensions
                        ? field.params.extensions.split(",").map(ext => `.${ext.trim()}`).join(",")
                        : field.params?.fileType ? fileTypeMap[field.params.fileType] : undefined}
                    required={field.required}
                    multiple={!field.params?.maxFiles || field.params.maxFiles > 1}
                    onChange={(e) => handleFileChange(e, field)}
                />
            </div>
        ),
        textarea: (field) => (
            <div key={field.label} className="flex flex-col space-y-2 w-full">
                <Label htmlFor={field.label} className="font-medium">
                    {field.label}
                </Label>
                {field.description && <p className="text-sm text-muted-foreground pb-4">{field.description}</p>}
                <textarea
                    name={field.label}
                    placeholder={field.placeholder}
                    required={field.required}
                    value={formData[field.label]?.value || ''}
                    onChange={handleChange}
                    className="p-2 border rounded w-full resize-none"
                ></textarea>
            </div>
        ),
        select: (field) => (
            <div key={field.label} className="flex flex-col space-y-2 w-full">
                <Label htmlFor={field.label} className="font-medium">
                    {field.label}
                </Label>
                {field.description && <p className="text-sm text-muted-foreground pb-4">{field.description}</p>}
                {field.params.options?.length < 6 ?
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {field.params.options.map((option, index) => (
                            <div
                                key={index}
                                className={
                                    cn("text-sm text-muted-foreground p-4 border rounded-lg cursor-pointer transition-all",
                                        formData[field.label] === option ? "border-green text-green" : "hover:border-green/50")
                                }
                                onClick={() =>
                                            handleChange({
                                                target: {
                                                    name: field.label,
                                            value: option,
                                                },
                                    } as React.ChangeEvent<HTMLInputElement>)}
                            >
                                <p>{option}</p>
                            </div>
                        ))}
                    </div>
                    :
                    <Select
                        name={field.label}
                        required={field.required}
                        value={field.params?.options
                            ?.map(option => ({ value: option, label: option }))
                            .find(option => option.value === formData[field.label]) || null}
                        onChange={(selectedOption) =>
                            handleChange({
                                target: {
                                    name: field.label,
                                    value: selectedOption ? selectedOption.value : '',
                                },
                            } as React.ChangeEvent<HTMLInputElement>)}
                        options={field.params?.options?.map(option => ({ value: option, label: option }))}
                        className="w-full"
                        styles={{
                            control: (provided) => ({
                                ...provided,
                                background: "hsl(var(--background))",
                                borderColor: "hsl(var(--border))",
                            }),
                            menu: (provided) => ({
                                ...provided,
                                background: "hsl(var(--background))",
                            }),
                            option: (provided, state) => ({
                                ...provided,
                                backgroundColor: state.isSelected ? "hsl(var(--muted))" : state.isFocused ? "hsl(var(--muted))" : "hsl(var(--background))",
                                color: "hsl(var(--foreground))",
                            }),
                        }}
                    />
                )}
            </div>
        ),
    };

    return (
        <form ref={ref} onSubmit={handleSubmit} className="space-y-8 p-6">
            {fields.map((field: any) => (fieldRenderers[field.type] ? fieldRenderers[field.type](field) : null))}
            {children}
        </form>
    );
};