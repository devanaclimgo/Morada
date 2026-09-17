import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="animate-rise flex flex-col items-center justify-center px-6 py-10 text-center">
      <div className="bg-primary-soft text-primary-soft-foreground flex size-14 items-center justify-center rounded-2xl">
        <Icon className="size-6" />
      </div>
      <p className="text-foreground mt-4 font-semibold">{title}</p>
      {description ? (
        <p className="text-muted-foreground mt-1 max-w-xs text-sm">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
