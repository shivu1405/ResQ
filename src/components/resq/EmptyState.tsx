import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({
  title = "No data available",
  description = "Awaiting incoming reports.",
  icon,
}: {
  title?: string;
  description?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-10">
      <div className="grid h-10 w-10 place-items-center rounded-full border border-border bg-muted/40 text-muted-foreground">
        {icon ?? <Inbox className="h-4 w-4" />}
      </div>
      <div className="mt-3 text-sm font-medium">{title}</div>
      <div className="mt-1 text-xs text-muted-foreground max-w-xs">{description}</div>
    </div>
  );
}
