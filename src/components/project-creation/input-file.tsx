"use client"

import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import Image from 'next/image'
import { Input } from '@/src/components/ui/input';
import { fileToBase64 } from '@/src/utils/utils';

export default function InputFile({ onFileSelect, file }: { onFileSelect: (file: string | undefined) => void, file: string | undefined }) {
    const [selectedFile, setSelectedFile] = useState<string | undefined>(file);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        let url = undefined;
        if (file) {
            url = await fileToBase64(file);
        }
        setSelectedFile(url);
        onFileSelect(url);
    };

    const handleRemoveClick = () => {
        setSelectedFile(undefined);
        onFileSelect(undefined);
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Reset the file input
        }
    };

    return (
        <div className="flex flex-wrap items-center justify-center gap-2">
            <Input type="file" onChange={handleFileChange} ref={fileInputRef} />
            {selectedFile && (
                <div className="mt-2 relative">
                    <Image
                        src={selectedFile}
                        alt="Preview"
                        width={400}
                        height={400}
                        className='rounded-lg'
                    />
                    <button
                        onClick={handleRemoveClick}
                        className="absolute top-0 right-0 hover:bg-destructive hover:text-foreground text-destructive py-1 px-2 rounded-lg"
                        aria-label="Remove image"
                        title='Remove image'
                    >
                        X
                    </button>
                </div>
            )}
        </div>
    );
}