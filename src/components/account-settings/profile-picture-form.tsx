"use client"

import { FormMessage, Message } from "@/src/components/custom/form-message";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { removeProfilePicture, updateProfilePicture } from "@/src/utils/account-actions";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CustomAlertDialog } from "@/src/components/custom/alert-dialog";

export const ProfilePictureUpload = ({ userId, image, imageFallback }: { userId: string, image?: string, imageFallback: string }) => {
    const [file, setFile] = useState<File | null>(null);
    const [initialImage, setInitialImage] = useState<string | undefined>(image);
    const [previewUrl, setPreviewUrl] = useState<string | undefined>(image);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<Message | null>(null);
    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl !== initialImage) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];

            // Validate file type
            if (!selectedFile.type.startsWith('image/')) {
                setMessage({ error: 'Please select a valid image file.' });
                return;
            }

            // Validate file size (1 MB)
            if (selectedFile.size > 1024 * 1024) {
                setMessage({ error: 'Image size must be less than 1 MB.' });
                return;
            }

            // Create a temporary URL for the selected file
            const url = URL.createObjectURL(selectedFile);
            setPreviewUrl(url);
            setFile(selectedFile);
            setMessage(null);
        }
    };

    const removePicture = async () => {
        if (!initialImage) {
            setMessage({ error: 'You do not have a profile picture to remove.' });
            return;
        }
        setLoading(true);
        const { success, message } = await removeProfilePicture(userId);
        setLoading(false);
        if (success) {
            setInitialImage(undefined);
            setPreviewUrl(undefined);
            setMessage({ success: message });
        } else {
            setMessage({ error: message });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setMessage({ error: 'Please select an Image.' });
            return;
        }
        setLoading(true);
        const { success, message } = await updateProfilePicture(userId, file);
        setLoading(false);
        if (success) {
            setInitialImage(previewUrl);
            setMessage({ success: message });
        } else {
            setMessage({ error: message });
        }
    };

    const reset = () => {
        setFile(null);
        setPreviewUrl(initialImage);
        setMessage(null);
    }

    return (
        <form
            className="border rounded-lg p-10 flex flex-col gap-6"
            onSubmit={handleSubmit}
        >
            <h2 className="text-primary font-semibold">Profile Picture</h2>
            <p className="text-sm text-muted-foreground">
                This picture will be your profile avatar.
            </p>
            <div className="flex items-center gap-4 text-muted-foreground">
                {previewUrl ?
                    <Image
                        src={previewUrl}
                        alt="profile photo"
                        width={96}
                        height={96}
                        priority
                        className="rounded-2xl object-contain"
                    /> :
                    <div className="w-24 h-24 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground font-semibold text-xl">
                        {imageFallback}
                    </div>
                }
                <Input
                    type="file"
                    accept="image/*"
                    placeholder="Upload a photo"
                    onChange={handleImage}
                    className="hover:border-green cursor-pointer"
                />
            </div>
            {message && <FormMessage message={message} />}
            <div className="mt-6 flex items-center justify-end gap-x-6">
                {initialImage && <CustomAlertDialog
                    buttonVariant="ghost"
                    buttonClass="text-destructive hover:bg-destructive hover:text-primary-foreground"
                    buttonDisabled={loading}
                    buttonIcon={X}
                    triggerText="Remove"
                    title="Are you sure?"
                    description="This will remove your current profile picture."
                    confirmText="Remove"
                    confirmButtonVariant="destructive"
                    cancelText="Cancel"
                    onConfirm={removePicture}
                />}
                <Button type="reset" variant="secondary" size="sm" onClick={reset}>
                    Reset
                </Button>
                <Button
                    type="submit" size="sm"
                    disabled={loading}
                >
                    {"Save"}
                </Button>
            </div>
        </form >
    );
}