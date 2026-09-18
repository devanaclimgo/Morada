import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  FREQUENCY_LABEL,
  WEEKDAYS,
  brl,
  dayMonth,
  iso,
  monthName,
  today,
  useMorada,
} from "@/lib/morada-store";
import type { Event, Kind } from "@/types/calendar";

const FILTERS: { value: Kind | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "task", label: "Tarefas" },
  { value: "bill", label: "Contas" },
  { value: "maintenance", label: "Manutenção" },
];

const DOT: Record<Kind, string> = {
  task: "bg-task",
  bill: "bg-bill",
  maintenance: "bg-maintenance",
};

const KIND_LABEL: Record<Kind, string> = {
  task: "Tarefa",
  bill: "Conta",
  maintenance: "Manutenção",
};

export default function CalendarPage() {
  const { state, memberName } = useMorada();
  const [cursor, setCursor] = useState(() => {
    const d = today();
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const [filter, setFilter] = useState<Kind | "all">("all");
  const [selected, setSelected] = useState<Event | null>(null);

  const events = useMemo<Event[]>(() => {
    const list: Event[] = [
      ...state.tasks.map((t) => ({
        id: `t-${t.id}`,
        kind: "task" as Kind,
        title: t.title,
        date: t.date,
        detail:
          state.mode === "roommates"
            ? `Responsável: ${memberName(t.assignee)}`
            : "Tarefa pessoal",
        extra:
          t.frequency !== "once"
            ? `Recorrência: ${FREQUENCY_LABEL[t.frequency]}`
            : undefined,
      })),
      ...state.bills.map((b) => ({
        id: `b-${b.id}`,
        kind: "bill" as Kind,
        title: b.title,
        date: b.dueDate,
        detail: brl(b.amount),
        extra: `Vence em ${dayMonth(b.dueDate)}`,
      })),
      ...state.maintenance.map((m) => ({
        id: `m-${m.id}`,
        kind: "maintenance" as Kind,
        title: m.title,
        date: m.date,
        detail: `Próxima vez em ${dayMonth(m.date)}`,
      })),
    ];
    return filter === "all" ? list : list.filter((e) => e.kind === filter);
  }, [state, filter, memberName]);

  const first = new Date(cursor.year, cursor.month, 1);
  const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate();
  const leading = first.getDay();
  const cells = [
    ...Array.from({ length: leading }, () => null),
    ...Array.from(
      { length: daysInMonth },
      (_, i) => new Date(cursor.year, cursor.month, i + 1),
    ),
  ];
  const todayIso = iso(today());

  const move = (delta: number) => {
    const d = new Date(cursor.year, cursor.month + delta, 1);
    setCursor({ year: d.getFullYear(), month: d.getMonth() });
  };

  const monthEvents = events
    .filter((e) =>
      e.date.startsWith(
        `${cursor.year}-${String(cursor.month + 1).padStart(2, "0")}`,
      ),
    )
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="space-y-5">
      <header className="animate-rise">
        <h1 className="text-2xl font-bold lg:text-3xl">Calendário</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Tarefas, contas e manutenção da casa em um só lugar.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`press rounded-xl px-3 py-1.5 text-sm font-medium transition-colors ${
              filter === f.value
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground border-border hover:bg-muted border"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <section className="card-soft p-4 sm:p-5">
          <header className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-bold">
              {monthName(cursor.month)} de {cursor.year}
            </h2>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Mês anterior"
                className="press rounded-xl"
                onClick={() => move(-1)}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Próximo mês"
                className="press rounded-xl"
                onClick={() => move(1)}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </header>

          <div className="text-muted-foreground grid grid-cols-7 gap-1 text-center text-[11px] font-semibold">
            {WEEKDAYS.map((w) => (
              <span key={w}>{w}</span>
            ))}
          </div>
          <div
            key={`${cursor.year}-${cursor.month}`}
            className="animate-rise mt-1 grid grid-cols-7 gap-1"
          >
            {cells.map((d, i) => {
              if (!d) return <span key={`empty-${i}`} />;
              const key = iso(d);
              const dayEvents = events.filter((e) => e.date === key);
              const isToday = key === todayIso;
              return (
                <button
                  key={key}
                  onClick={() => setSelected(dayEvents[0] ?? null)}
                  className={`press flex aspect-square flex-col items-center justify-start gap-1 rounded-xl p-1 text-xs transition-colors ${
                    isToday
                      ? "bg-primary-soft text-primary-soft-foreground font-bold"
                      : "hover:bg-muted"
                  }`}
                  aria-label={`${d.getDate()} de ${monthName(cursor.month)}`}
                >
                  <span className="mt-0.5">{d.getDate()}</span>
                  <span className="flex gap-0.5">
                    {dayEvents.slice(0, 3).map((e) => (
                      <span
                        key={e.id}
                        className={`size-1.5 rounded-full ${DOT[e.kind]}`}
                      />
                    ))}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-muted-foreground mt-4 flex flex-wrap gap-3 text-xs">
            {(Object.keys(DOT) as Kind[]).map((k) => (
              <span key={k} className="flex items-center gap-1.5">
                <span className={`size-2 rounded-full ${DOT[k]}`} />{" "}
                {KIND_LABEL[k]}
              </span>
            ))}
          </div>
        </section>

        <section className="card-soft p-5">
          <h2 className="mb-3 text-base font-bold">Neste mês</h2>
          {monthEvents.length ? (
            <ul className="divide-border divide-y">
              {monthEvents.map((e) => (
                <li key={e.id}>
                  <button
                    onClick={() => setSelected(e)}
                    className="press hover:bg-muted/60 flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors"
                  >
                    <span
                      className={`size-2 shrink-0 rounded-full ${DOT[e.kind]}`}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">
                        {e.title}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {e.detail}
                      </span>
                    </span>
                    <span className="text-muted-foreground shrink-0 text-xs">
                      {dayMonth(e.date)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={CalendarDays}
              title="Nada programado para este período."
            />
          )}
        </section>
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="rounded-3xl sm:max-w-sm">
          {selected ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span
                    className={`size-2.5 rounded-full ${DOT[selected.kind]}`}
                  />
                  {selected.title}
                </DialogTitle>
                <DialogDescription>
                  {KIND_LABEL[selected.kind]} · {dayMonth(selected.date)}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-1 text-sm">
                <p className="font-medium">{selected.detail}</p>
                {selected.extra ? (
                  <p className="text-muted-foreground">{selected.extra}</p>
                ) : null}
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
