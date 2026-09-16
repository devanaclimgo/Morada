import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Calendar,
  Home,
  ListChecks,
  LogOut,
  Receipt,
  Settings,
  User as UserIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InstallAppDialog } from "@/components/install-app-dialog";
import { useMorada } from "@/lib/morada-store";
import type { ReactNode } from "react";

const NAV = [
  { to: "/inicio", label: "Início", icon: Home },
  { to: "/tarefas", label: "Tarefas", icon: ListChecks },
  { to: "/contas", label: "Contas", icon: Receipt },
  { to: "/calendario", label: "Calendário", icon: Calendar },
  { to: "/configuracoes", label: "Configurações", icon: Settings },
] as const;

const MOBILE_NAV = [
  { to: "/calendario", label: "Calendário", icon: Calendar },
  { to: "/inicio", label: "Início", icon: Home },
  { to: "/configuracoes", label: "Configurações", icon: Settings },
] as const;

export function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function UserMenu() {
  const { state } = useMorada();
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="press ring-offset-background focus-visible:ring-ring rounded-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          aria-label="Abrir menu da conta"
        >
          <Avatar className="size-9">
            {state.profile.avatar ? (
              <AvatarImage
                src={state.profile.avatar}
                alt={state.profile.name}
              />
            ) : null}
            <AvatarFallback className="bg-primary-soft text-primary-soft-foreground text-xs font-semibold">
              {initials(state.profile.name)}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-2xl">
        <DropdownMenuLabel className="font-normal">
          <p className="text-sm font-semibold">{state.profile.name}</p>
          <p className="text-muted-foreground truncate text-xs">
            {state.profile.email}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/perfil">
            <UserIcon className="size-4" /> Perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/configuracoes">
            <Settings className="size-4" /> Configurações
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate({ to: "/entrar" })}>
          <LogOut className="size-4" /> Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { state } = useMorada();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const houseLabel =
    state.mode === "roommates" && state.houseName
      ? state.houseName
      : "Sua casa";

  return (
    <div className="bg-background min-h-screen">
      {/* Sidebar (desktop) */}
      <aside className="bg-sidebar border-sidebar-border fixed inset-y-0 left-0 hidden w-60 flex-col border-r px-4 py-6 lg:flex">
        <Link to="/inicio" className="flex items-center gap-2 px-2">
          <span className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-xl">
            <Home className="size-4" />
          </span>
          <span className="text-sidebar-foreground text-lg font-bold">
            Morada
          </span>
        </Link>
        <p className="text-muted-foreground mt-6 px-2 text-xs font-semibold tracking-wide uppercase">
          Menu
        </p>
        <nav className="mt-2 flex flex-col gap-1">
          {NAV.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`press flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60"
                }`}
              >
                <item.icon className="size-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="bg-primary-soft text-primary-soft-foreground mt-auto rounded-2xl p-4">
          <p className="text-sm font-semibold">morada no celular</p>
          <p className="mt-1 text-xs opacity-80">
            Acesse suas tarefas e contas direto da tela inicial.
          </p>
          <div className="mt-2">
            <InstallAppDialog />
          </div>
        </div>
      </aside>

      <div className="lg:pl-60">
        {/* Header */}
        <header className="bg-background/85 border-border sticky top-0 z-30 border-b backdrop-blur">
          <div className="mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
            <div className="flex min-w-0 items-center gap-2">
              <span className="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-xl lg:hidden">
                <Home className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="text-foreground truncate text-sm font-bold lg:text-base">
                  {houseLabel}
                </p>
                <p className="text-muted-foreground truncate text-xs">
                  {state.mode === "roommates"
                    ? `${state.members.length} moradores`
                    : "Organização pessoal"}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <InstallAppDialog />
              <UserMenu />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 pt-5 pb-28 lg:pb-12">
          {children}
        </main>
      </div>

      {/* Bottom navigation (mobile) */}
      <nav className="bg-card/95 border-border fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur lg:hidden">
        <ul className="mx-auto grid max-w-md grid-cols-3 items-end px-4 pt-2 pb-3">
          {MOBILE_NAV.map((item) => {
            const active = pathname === item.to;
            const center = item.to === "/inicio";
            return (
              <li key={item.to} className="flex justify-center">
                <Link
                  to={item.to}
                  aria-label={item.label}
                  className={`press flex flex-col items-center gap-1 rounded-2xl px-3 py-1.5 text-[11px] font-medium transition-colors ${
                    active && !center
                      ? "text-primary"
                      : center
                        ? "text-foreground"
                        : "text-muted-foreground"
                  }`}
                >
                  <span
                    className={
                      center
                        ? `flex size-12 items-center justify-center rounded-2xl transition-all ${
                            active
                              ? "bg-primary text-primary-foreground shadow-lift -translate-y-2"
                              : "bg-primary-soft text-primary-soft-foreground -translate-y-1"
                          }`
                        : "flex size-8 items-center justify-center"
                    }
                  >
                    <item.icon className={center ? "size-5" : "size-5"} />
                  </span>
                  <span className={center ? "-mt-1" : ""}>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
