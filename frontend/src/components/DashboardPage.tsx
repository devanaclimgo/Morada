import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ChevronRight,
  ListChecks,
  Receipt,
  ShoppingBasket,
  Sparkles,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "@/components/shared/EmptyState";
import { ShoppingDrawer } from "@/components/ShoppingList";
import {
  brl,
  dayMonth,
  daysUntil,
  dueLabel,
  iso,
  today,
  useMorada,
} from "@/lib/morada-store";

function useGreeting() {
  const [greeting, setGreeting] = useState("Olá");
  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite");
  }, []);
  return greeting;
}

function SectionCard({
  title,
  icon: Icon,
  action,
  children,
}: {
  title: string;
  icon: typeof ListChecks;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="card-soft animate-rise flex flex-col p-5">
      <header className="mb-3 flex items-center justify-between gap-3">
        <h2 className="flex min-w-0 items-center gap-2 text-base font-bold">
          <span className="bg-primary-soft text-primary-soft-foreground flex size-8 shrink-0 items-center justify-center rounded-xl">
            <Icon className="size-4" />
          </span>
          <span className="truncate">{title}</span>
        </h2>
        {action}
      </header>
      {children}
    </section>
  );
}

export default function Dashboard() {
  const { state, toggleTask } = useMorada();
  const greeting = useGreeting();
  const firstName = state.profile.name.split(" ")[0] ?? state.profile.name;

  const myTasks = state.tasks
    .filter((t) => t.date <= iso(today()) || daysUntil(t.date) <= 2)
    .slice(0, 4);
  const upcomingBills = [...state.bills]
    .filter((b) => !b.paid)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 3);
  const pendingItems = state.shopping.filter((i) => !i.bought);
  const nextMaintenance = [...state.maintenance].sort((a, b) =>
    a.date.localeCompare(b.date),
  )[0];

  return (
    <div className="space-y-5">
      <div className="animate-rise">
        <h1 className="text-2xl font-bold lg:text-3xl">
          {greeting}, {firstName}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {state.mode === "roommates"
            ? `Aqui está o resumo de ${state.houseName ?? "sua casa"} hoje.`
            : "Aqui está o resumo da sua casa hoje."}
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard
          title="Suas tarefas"
          icon={ListChecks}
          action={
            <Button
              variant="ghost"
              size="sm"
              className="press rounded-xl"
              asChild
            >
              <Link to="/tarefas">
                Ver todas <ChevronRight className="size-4" />
              </Link>
            </Button>
          }
        >
          {myTasks.length ? (
            <ul className="space-y-1">
              {myTasks.map((task) => (
                <li
                  key={task.id}
                  className="hover:bg-muted/60 flex items-center gap-3 rounded-xl px-2 py-2 transition-colors"
                >
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.done}
                    className={task.done ? "animate-pop" : ""}
                    onCheckedChange={() => {
                      toggleTask(task.id);
                      if (!task.done)
                        toast.success(`${task.title} concluída. Boa!`);
                    }}
                  />
                  <label
                    htmlFor={`task-${task.id}`}
                    className="min-w-0 flex-1 cursor-pointer text-sm"
                  >
                    <span
                      className={
                        task.done
                          ? "text-muted-foreground line-through"
                          : "text-foreground"
                      }
                    >
                      {task.title}
                    </span>
                    {state.mode === "roommates" ? (
                      <span className="text-muted-foreground ml-2 text-xs">
                        {state.members.find((m) => m.id === task.assignee)
                          ?.name ?? "Sem responsável"}
                      </span>
                    ) : null}
                  </label>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={Sparkles}
              title="Tudo limpo por aqui."
              description="Você não tem tarefas pendentes."
            />
          )}
        </SectionCard>

        <SectionCard
          title="Próximas contas"
          icon={Receipt}
          action={
            <Button
              variant="ghost"
              size="sm"
              className="press rounded-xl"
              asChild
            >
              <Link to="/contas">
                Ver todas <ChevronRight className="size-4" />
              </Link>
            </Button>
          }
        >
          {upcomingBills.length ? (
            <ul className="divide-border divide-y">
              {upcomingBills.map((bill) => {
                const d = daysUntil(bill.dueDate);
                const tone =
                  d < 0
                    ? "bg-destructive"
                    : d <= 5
                      ? "bg-warning"
                      : "bg-primary";
                return (
                  <li key={bill.id} className="flex items-center gap-3 py-2.5">
                    <span
                      className={`size-2 shrink-0 rounded-full ${tone}`}
                      aria-hidden
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {bill.title}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {dueLabel(bill.dueDate)}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold">
                      {brl(bill.amount)}
                    </p>
                  </li>
                );
              })}
            </ul>
          ) : (
            <EmptyState icon={Receipt} title="Nenhuma conta por enquanto." />
          )}
        </SectionCard>

        <SectionCard
          title="Lista de compras"
          icon={ShoppingBasket}
          action={
            <ShoppingDrawer>
              <Button variant="ghost" size="sm" className="press rounded-xl">
                Abrir lista <ChevronRight className="size-4" />
              </Button>
            </ShoppingDrawer>
          }
        >
          {pendingItems.length ? (
            <ShoppingDrawer>
              <button className="press w-full text-left">
                <ul className="space-y-1.5">
                  {pendingItems.slice(0, 4).map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center gap-3 text-sm"
                    >
                      <span
                        className="border-input size-4 rounded-[6px] border"
                        aria-hidden
                      />
                      <span className="truncate">{item.name}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-muted-foreground mt-3 text-xs">
                  {pendingItems.length}{" "}
                  {pendingItems.length === 1
                    ? "item pendente"
                    : "itens pendentes"}{" "}
                  de {state.shopping.length}
                </p>
              </button>
            </ShoppingDrawer>
          ) : (
            <EmptyState
              icon={ShoppingBasket}
              title="Sua lista está vazia."
              description="Adicione algo que você precisa comprar."
              action={
                <ShoppingDrawer>
                  <Button size="sm" className="press rounded-xl">
                    Adicionar item
                  </Button>
                </ShoppingDrawer>
              }
            />
          )}
        </SectionCard>

        <SectionCard
          title="Manutenção da casa"
          icon={Wrench}
          action={
            <Button
              variant="ghost"
              size="sm"
              className="press rounded-xl"
              asChild
            >
              <Link to="/calendario">
                Ver no calendário <ChevronRight className="size-4" />
              </Link>
            </Button>
          }
        >
          {nextMaintenance ? (
            <div className="bg-muted/60 rounded-xl p-4">
              <p className="text-sm font-medium">{nextMaintenance.title}</p>
              <p className="text-muted-foreground mt-1 text-xs">
                Próxima vez em {dayMonth(nextMaintenance.date)}
              </p>
            </div>
          ) : (
            <EmptyState icon={Wrench} title="Nada de manutenção por agora." />
          )}
        </SectionCard>
      </div>
    </div>
  );
}
