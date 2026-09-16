import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Home } from "lucide-react";

export function AuthLayout({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <Link to="/" className="press mb-6 flex items-center gap-2">
        <span className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-xl">
          <Home className="size-4" />
        </span>
        <span className="text-xl font-bold">Morada</span>
      </Link>
      <div className="card-soft animate-rise w-full max-w-sm p-6">
        <h1 className="text-xl font-bold">{title}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{description}</p>
        <div className="mt-5">{children}</div>
      </div>
      {footer ? (
        <div className="text-muted-foreground mt-5 text-sm">{footer}</div>
      ) : null}
    </div>
  );
}
