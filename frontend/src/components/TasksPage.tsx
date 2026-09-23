import { useMemo, useState } from "react";
import { Plus, Shuffle, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  FREQUENCY_LABEL,
  daysUntil,
  iso,
  parseISO,
  shiftDays,
  today,
  useMorada,
  type Frequency,
  type Task,
} from "@/lib/morada-store";

function groupLabel(date: string) {
  const d = daysUntil(date);
  if (d < 0) return "Atrasadas";
  if (d === 0) return "Hoje";
  if (d === 1) return "Amanhã";
  const dt = parseISO(date);
  return dt.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" });
}

function NewTaskDialog() {
  const { state, addTask } = useMorada();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("weekly");
  const [assignee, setAssignee] = useState<string>(state.members[0]?.id ?? "m1");
  const [date, setDate] = useState(iso(today()));

  const submit = () => {
    if (!title.trim()) {
      toast.error("Dê um nome para a tarefa.");
      return;
    }
    addTask({
      title: title.trim(),
      frequency,
      assignee: state.mode === "roommates" ? assignee : null,
      date,
      participants: state.mode === "roommates" ? state.members.map((m) => m.id) : [],
    });
    toast.success("Tarefa criada.");
    setTitle("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="press rounded-xl">
          <Plus className="size-4" /> Nova tarefa
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-3xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova tarefa</DialogTitle>
          <DialogDescription>Diga o que precisa ser feito e com que frequência.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-title">Nome da tarefa</Label>
            <Input
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex.: Limpar o banheiro"
              className="rounded-xl"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="task-date">Data</Label>
              <Input
                id="task-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Frequência</Label>
              <Select value={frequency} onValueChange={(v) => setFrequency(v as Frequency)}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(FREQUENCY_LABEL).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {state.mode === "roommates" ? (
            <div className="space-y-2">
              <Label>Responsável</Label>
              <Select value={assignee} onValueChange={setAssignee}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {state.members.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-muted-foreground text-xs">
                Todos os moradores participam da divisão desta tarefa.
              </p>
            </div>
          ) : null}
        </div>
        <DialogFooter>
          <Button variant="ghost" className="press rounded-xl" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button className="press rounded-xl" onClick={submit}>
            Criar tarefa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RedistributeDialog({ onDone }: { onDone: () => void }) {
  const { redistribute } = useMorada();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="press rounded-xl">
          <Shuffle className="size-4" /> Redistribuir tarefas
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-3xl sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Redistribuir tarefas da semana?</DialogTitle>
          <DialogDescription>
            O Roomy vai distribuir as tarefas aleatoriamente entre os moradores da casa.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" className="press rounded-xl" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            className="press rounded-xl"
            onClick={() => {
              redistribute();
              setOpen(false);
              onDone();
              toast.success("Tarefas redistribuídas entre os moradores.");
            }}
          >
            Redistribuir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TaskRow({ task }: { task: Task }) {
  const { state, toggleTask, removeTask } = useMorada();
  const assignee = state.members.find((m) => m.id === task.assignee);

  return (
    <li className="group hover:bg-muted/60 flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors">
      <Checkbox
        id={`t-${task.id}`}
        checked={task.done}
        className={task.done ? "animate-pop" : ""}
        onCheckedChange={() => {
          toggleTask(task.id);
          if (!task.done) toast.success(`${task.title} concluída.`);
        }}
      />
      <label htmlFor={`t-${task.id}`} className="min-w-0 flex-1 cursor-pointer">
        <p
          className={`truncate text-sm font-medium ${
            task.done ? "text-muted-foreground line-through" : "text-foreground"
          }`}
        >
          {task.title}
        </p>
        <p className="text-muted-foreground text-xs">
          {state.mode === "roommates" ? (assignee?.name ?? "Sem responsável") : "Você"}
          {task.frequency !== "once" ? ` · ${FREQUENCY_LABEL[task.frequency]}` : ""}
        </p>
      </label>
      {task.done ? (
        <Badge className="bg-success text-success-foreground animate-pop shrink-0 rounded-lg">
          Concluída
        </Badge>
      ) : null}
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Excluir ${task.title}`}
        className="press text-muted-foreground hover:text-destructive size-8 shrink-0 rounded-lg opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
        onClick={() => {
          removeTask(task.id);
          toast.success("Tarefa excluída.");
        }}
      >
        <Trash2 className="size-4" />
      </Button>
    </li>
  );
}

export default function TasksPage() {
  const { state } = useMorada();
  const [shuffleKey, setShuffleKey] = useState(0);

  const groups = useMemo(() => {
    const horizon = shiftDays(30);
    const map = new Map<string, Task[]>();
    [...state.tasks]
      .filter((t) => t.date <= horizon)
      .sort((a, b) => a.date.localeCompare(b.date))
      .forEach((t) => {
        const key = groupLabel(t.date);
        map.set(key, [...(map.get(key) ?? []), t]);
      });
    return [...map.entries()];
  }, [state.tasks]);

  return (
    <div className="space-y-5">
      <header className="animate-rise grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold lg:text-3xl">Tarefas</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {state.mode === "roommates"
              ? "Divida as tarefas e acompanhe quem fez o quê."
              : "Acompanhe as tarefas da sua casa."}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap justify-end gap-2">
          {state.mode === "roommates" ? (
            <RedistributeDialog onDone={() => setShuffleKey((k) => k + 1)} />
          ) : null}
          <NewTaskDialog />
        </div>
      </header>

      {groups.length ? (
        <div key={shuffleKey} className="space-y-4">
          {groups.map(([label, tasks], i) => (
            <section
              key={label}
              className={`card-soft animate-rise p-5 ${shuffleKey ? "animate-shuffle" : ""}`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <h2 className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
                {label}
              </h2>
              <ul>
                {tasks.map((t) => (
                  <TaskRow key={t.id} task={t} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <div className="card-soft">
          <EmptyState
            icon={Sparkles}
            title="Tudo limpo por aqui."
            description="Você não tem tarefas pendentes."
            action={<NewTaskDialog />}
          />
        </div>
      )}
    </div>
  );
}
