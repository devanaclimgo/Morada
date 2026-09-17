import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  ChevronRight,
  HelpCircle,
  Home,
  LogOut,
  Mail,
  Moon,
  Monitor,
  Sun,
  Trash2,
  User as UserIcon,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
} from "@/components/ui/alert-dialog";
import { useMorada} from "@/lib/morada-store";
import { useTheme, type ThemePref } from "@/lib/theme";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="card-soft animate-rise overflow-hidden">
      <h2 className="text-muted-foreground border-border border-b px-5 py-3 text-xs font-semibold tracking-wide uppercase">
        {title}
      </h2>
      <div className="divide-border divide-y">{children}</div>
    </section>
  );
}

function Row({
  icon: Icon,
  label,
  description,
  right,
  onClick,
}: {
  icon: typeof Bell;
  label: string;
  description?: string;
  right?: React.ReactNode;
  onClick?: () => void;
}) {
  const content = (
    <div className="flex items-center gap-3 px-5 py-3.5">
      <span className="bg-primary-soft text-primary-soft-foreground flex size-9 shrink-0 items-center justify-center rounded-xl">
        <Icon className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{label}</span>
        {description ? (
          <span className="text-muted-foreground block truncate text-xs">
            {description}
          </span>
        ) : null}
      </span>
      {right ?? (
        <ChevronRight className="text-muted-foreground size-4 shrink-0" />
      )}
    </div>
  );
  if (onClick)
    return (
      <button
        onClick={onClick}
        className="press hover:bg-muted/60 w-full text-left transition-colors"
      >
        {content}
      </button>
    );
  return content;
}

const THEMES: { value: ThemePref; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Claro", icon: Sun },
  { value: "dark", label: "Escuro", icon: Moon },
  { value: "system", label: "Sistema", icon: Monitor },
];

export default function SettingsPage() {
  const { state, update, reset } = useMorada();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(state.notifications);

  const toggleNotification = (key: keyof typeof notifications) => {
    const next = { ...notifications, [key]: !notifications[key] };
    setNotifications(next);
    update({ notifications: next });
  };

  return (
    <div className="space-y-5">
      <header className="animate-rise">
        <h1 className="text-2xl font-bold lg:text-3xl">Configurações</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Ajuste sua conta, sua casa e a aparência do Roomy.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-5">
          <Section title="Conta">
            <Link
              to="/perfil"
              className="press hover:bg-muted/60 block transition-colors"
            >
              <Row
                icon={UserIcon}
                label="Perfil"
                description={state.profile.name}
              />
            </Link>
            <Link
              to="/perfil"
              className="press hover:bg-muted/60 block transition-colors"
            >
              <Row
                icon={Mail}
                label="Informações pessoais"
                description="E-mail, telefone e senha"
              />
            </Link>
          </Section>

          <Section title="Preferências">
            <Row
              icon={Bell}
              label="Tarefas"
              description="Avisos de tarefas do dia"
              right={
                <Switch
                  checked={notifications.tasks}
                  onCheckedChange={() => toggleNotification("tasks")}
                  aria-label="Notificações de tarefas"
                />
              }
            />
            <Row
              icon={Bell}
              label="Contas"
              description="Avisos de vencimento"
              right={
                <Switch
                  checked={notifications.bills}
                  onCheckedChange={() => toggleNotification("bills")}
                  aria-label="Notificações de contas"
                />
              }
            />
            <Row
              icon={Bell}
              label="Lista de compras"
              description="Avisos de itens adicionados"
              right={
                <Switch
                  checked={notifications.shopping}
                  onCheckedChange={() => toggleNotification("shopping")}
                  aria-label="Notificações da lista de compras"
                />
              }
            />
            <div className="px-5 py-4">
              <p className="text-sm font-medium">Aparência</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {THEMES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTheme(t.value)}
                    className={`press flex flex-col items-center gap-1.5 rounded-2xl border px-2 py-3 text-xs font-medium transition-colors ${
                      theme === t.value
                        ? "border-primary bg-primary-soft text-primary-soft-foreground"
                        : "border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <t.icon className="size-4" />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </Section>
        </div>

        <div className="space-y-5">
          {state.mode === "roommates" ? (
            <Section title="Casa">
              <Row
                icon={Home}
                label="Minha casa"
                description={state.houseName ?? "Sua casa"}
              />
              <Row
                icon={Users}
                label="Moradores"
                description={state.members.map((m) => m.name).join(", ")}
              />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="press hover:bg-muted/60 w-full text-left transition-colors">
                    <Row icon={LogOut} label="Sair da casa" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-3xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Sair desta casa?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Você deixará de ver as tarefas, contas e a lista de
                      compras compartilhadas.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="rounded-xl"
                      onClick={() => {
                        update({ mode: "solo", houseName: null });
                        toast.success("Você saiu da casa.");
                      }}
                    >
                      Sair da casa
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </Section>
          ) : (
            <Section title="Casa">
              <Row
                icon={Home}
                label="Você mora sozinho(a)"
                description="Convide pessoas quando quiser dividir a casa"
              />
              <Row
                icon={Users}
                label="Criar uma casa compartilhada"
                onClick={() => {
                  update({ mode: "roommates", houseName: "Minha casa" });
                  toast.success("Modo compartilhado ativado.");
                }}
              />
            </Section>
          )}

          <Section title="Suporte">
            <Row
              icon={HelpCircle}
              label="Central de ajuda"
              onClick={() => toast("A central de ajuda chega em breve.")}
            />
            <Row
              icon={Mail}
              label="Fale conosco"
              onClick={() => toast("Escreva para oi@roomy.app")}
            />
          </Section>

          <Section title="Conta">
            <Row
              icon={LogOut}
              label="Sair"
              onClick={() => navigate({ to: "/entrar" })}
            />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="press hover:bg-destructive/10 w-full text-left transition-colors">
                  <div className="flex items-center gap-3 px-5 py-3.5">
                    <span className="bg-destructive/10 text-destructive flex size-9 shrink-0 items-center justify-center rounded-xl">
                      <Trash2 className="size-4" />
                    </span>
                    <span className="text-destructive min-w-0 flex-1 text-sm font-medium">
                      Excluir conta
                    </span>
                  </div>
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-3xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir sua conta?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Todos os seus dados no Roomy serão apagados. Essa ação não
                    pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-xl">
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
                    onClick={() => {
                      reset();
                      toast.success("Conta excluída.");
                      navigate({ to: "/" });
                    }}
                  >
                    Excluir conta
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Section>

          <p className="text-muted-foreground text-center text-xs">
            Roomy · versão 1.0
          </p>
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              className="press rounded-xl"
              onClick={() => reset()}
            >
              Restaurar dados de exemplo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
