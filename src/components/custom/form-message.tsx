import { cn } from "@/src/lib/utils";

export type Message =
  | { success: string }
  | { error: string }
  | { message: string };

export function FormMessage({ message, classname }: { message: Message, classname?: string}) {
  return (
    <div className={cn("flex flex-col gap-2 w-full text-sm max-w-md", classname)}>
      {"success" in message && (
        <div className="text-green border-l-2 border-green px-4">
          {message.success}
        </div>
      )}
      {"error" in message && (
        <div className="text-destructive border-l-2 border-destructive px-4">
          {message.error}
        </div>
      )}
      {"message" in message && (
        <div className="text-foreground border-l-2 border-foreground px-4">{message.message}</div>
      )}
    </div>
  );
}
