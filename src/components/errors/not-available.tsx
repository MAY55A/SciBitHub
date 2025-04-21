export function NotAvailable({ type }: { type: string }) {
    return (
        <div className="flex flex-col justify-center items-center w-full min-h-[60vh] rounded-lg p-10 py-24 my-8 border">
            <h3>This {type} has been <strong className="text-primary">Deleted</strong></h3>
            <p className="text-sm text-muted-foreground">This content is no longer available</p>
        </div>
    );
}