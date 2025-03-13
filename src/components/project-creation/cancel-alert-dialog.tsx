import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/src/components/ui/alert-dialog';
import { Button } from '@/src/components/ui/button';
import { useRouter } from 'next/navigation';

export const CancelAlertDialog = ({ disabled, saveDraft }: { disabled?: boolean, saveDraft?: () => void }) => {
    const router = useRouter();

    const handleExit = () => {
        router.back(); // Navigates to the previous page
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="secondary" disabled={disabled}>
                    Cancel
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className='max-w-[800px] mx-4'>
                <AlertDialogHeader>
                    <AlertDialogTitle>Discard Changes?</AlertDialogTitle>
                    <AlertDialogDescription>
                        You have unsaved changes. If you exit now, all progress will be lost.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <div className="w-full flex flex-wrap items-center lg:justify-between md:justify-between justify-center gap-8 mt-6">
                        <AlertDialogCancel className='mt-0'>Stay on Page</AlertDialogCancel>
                        <div className="flex items-center gap-2">
                            {saveDraft &&
                                <AlertDialogAction variant="outline" onClick={saveDraft}>Save as Draft</AlertDialogAction>
                            }
                            <AlertDialogAction onClick={handleExit} className="bg-destructive text-white">
                                Exit Without Saving
                            </AlertDialogAction>
                        </div>
                    </div>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};