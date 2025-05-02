export function Forbidden({message}: {message?: string}) {
    return (
        <div className="flex flex-col gap-4 items-center justify-center min-h-[80vh] p-4">
            <div className="text-primary text-2xl font-bold">403</div>
            <div className="text-primary text-lg font-bold">Forbidden</div>
            <div className="text-lg font-medium">{message}</div>
        </div>
    );
}