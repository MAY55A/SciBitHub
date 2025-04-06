export function NotAuthorized({message}: {message?: string}) {
    return (
        <div className="flex flex-col gap-4 items-center justify-center h-screen">
            <div className="text-center text-2xl font-bold">403</div>
            <div className="text-center text-lg font-medium">Not Authorized</div>
            <div className="text-center text-lg font-medium">{message}</div>
        </div>
    );
}