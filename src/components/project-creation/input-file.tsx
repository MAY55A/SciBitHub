"use client"

import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import Image from 'next/image'
import { Input } from '@/src/components/ui/input';
import { fileToBase64 } from '@/src/utils/utils';

export default function InputFile({ onFileSelect, file, setError }: { onFileSelect: (file: string | undefined) => void, file: string | undefined, setError: (error?: string) => void, }) {
    const [selectedFile, setSelectedFile] = useState<string | undefined>(file);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
    
        const maxSizeBytes = 500 * 1024;
    
        if (file.size > maxSizeBytes) {
            setError("Image must be less than 500 KB.");
            return;
        }
    
        const isValidResolution = await checkImageResolution(file, 1000, 1000);
        if (!isValidResolution) {
            setError("Image must be at least 1000x1000 pixels.");
            return;
        }
    
        const url = await fileToBase64(file);
        setSelectedFile(url);
        onFileSelect(url);
        setError("");
    };

    const handleRemoveClick = () => {
        setSelectedFile(undefined);
        onFileSelect(undefined);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="flex flex-wrap items-center justify-center gap-2">
            <Input type="file" onChange={handleFileChange} ref={fileInputRef} />
            {selectedFile && (
                <div className="mt-2 relative w-full h-80">
                    <Image
                        src={selectedFile}
                        alt="Preview"
                        fill
                        className='object-fit object-cover rounded-lg'
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

const checkImageResolution = (file: File, minWidth: number, minHeight: number): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        const img = new window.Image();
        img.onload = () => {
            resolve(img.width >= minWidth && img.height >= minHeight);
        };
        img.onerror = (err) => {
            reject(err);
        };
        img.src = URL.createObjectURL(file);
    });
};