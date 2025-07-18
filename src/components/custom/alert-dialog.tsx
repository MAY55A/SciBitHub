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
import { LucideProps } from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

interface AlertDialogProps {
    buttonIcon?: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
    buttonVariant?: "destructive" | "link" | "default" | "outline" | "secondary" | "ghost" | null | undefined;
    buttonSize?: "default" | "sm" | "lg" | "icon" | null | undefined;
    buttonClass?: string;
    buttonDisabled?: boolean;
    triggerText?: string;
    title: string;
    description: string;
    confirmText?: string;
    confirmButtonVariant?: "destructive" | "default";
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
}

export const CustomAlertDialog = ({
    buttonIcon: ButtonIcon,
    buttonVariant = "destructive",
    buttonSize = "sm",
    buttonClass,
    buttonDisabled = false,
    triggerText,
    title,
    description,
    confirmText = 'Continue',
    confirmButtonVariant = "default",
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
}: AlertDialogProps) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant={buttonVariant} size={buttonSize} className={buttonClass} disabled={buttonDisabled} title={triggerText}>
                    {ButtonIcon && <ButtonIcon className="h-4 w-4" />}
                    {triggerText && <span className="ml-2">{triggerText}</span>}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription className='font-retro'>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className='w-full flex sm:justify-between justify-between'>
                    <AlertDialogCancel className='text-muted-foreground hover:border-muted-foreground' onClick={onCancel}>{cancelText}</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm} variant={confirmButtonVariant}>{confirmText}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};