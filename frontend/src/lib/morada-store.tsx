import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type LivingMode = "roommates" | "solo";

export type Member = { id: string; name: string };

export type Frequency = "once" | "daily" | "weekly" | "biweekly" | "monthly";

export type Task = {
  id: string;
  title: string;
  assignee: string | null;
  date: string; // yyyy-mm-dd
  frequency: Frequency;
  done: boolean;
  participants: string[];
};

export type Bill = {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  paid: boolean;
  paidAt: string | null;
  payer: string | null;
  split: { memberId: string; amount: number }[];
};

export type ShoppingItem = {
  id: string;
  name: string;
  category: "Mercado" | "Limpeza" | "Casa";
  bought: boolean;
};

export type Maintenance = { id: string; title: string; date: string };

export type Profile = {
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
};

export type MoradaState = {
  onboarded: boolean;
  mode: LivingMode;
  profile: Profile;
  houseName: string | null;
  members: Member[];
  tasks: Task[];
  bills: Bill[];
  shopping: ShoppingItem[];
  maintenance: Maintenance[];
  notifications: { tasks: boolean; bills: boolean; shopping: boolean };
};

export const FREQUENCY_LABEL: Record<Frequency, string> = {
  once: "Uma vez",
  daily: "Diária",
  weekly: "Semanal",
  biweekly: "Quinzenal",
  monthly: "Mensal",
};

export function iso(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export function today() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}
export function shiftDays(days: number) {
  const d = today();
  d.setDate(d.getDate() + days);
  return iso(d);
}
export function parseISO(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1);
}
export function daysUntil(s: string) {
  return Math.round((parseISO(s).getTime() - today().getTime()) / 86400000);
}
export function brl(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
export function dayMonth(s: string) {
  const d = parseISO(s);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
}
const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
export const monthName = (i: number) => MONTHS[i] ?? "";
export const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function dueLabel(s: string) {
  const n = daysUntil(s);
  if (n < 0)
    return `Venceu há ${Math.abs(n)} ${Math.abs(n) === 1 ? "dia" : "dias"}`;
  if (n === 0) return "Vence hoje";
  if (n === 1) return "Vence amanhã";
  return `Vence em ${n} dias`;
}

const uid = () => Math.random().toString(36).slice(2, 10);

const MEMBERS: Member[] = [
  { id: "m1", name: "Ana" },
  { id: "m2", name: "Maria" },
  { id: "m3", name: "João" },
];

function seed(): MoradaState {
  // Deterministic ids so server and client render identically.
  let seq = 0;
  const uid = () => `seed-${++seq}`;
  return {
    onboarded: false,
    mode: "roommates",
    profile: {
      name: "Ana",
      email: "ana@email.com",
      phone: "(81) 99999-0000",
      avatar: null,
    },
    houseName: "Apartamento da Ana",
    members: MEMBERS,
    tasks: [
      {
        id: uid(),
        title: "Limpar o banheiro",
        assignee: "m1",
        date: shiftDays(0),
        frequency: "weekly",
        done: false,
        participants: ["m1", "m2", "m3"],
      },
      {
        id: uid(),
        title: "Tirar o lixo",
        assignee: "m2",
        date: shiftDays(0),
        frequency: "daily",
        done: false,
        participants: ["m1", "m2", "m3"],
      },
      {
        id: uid(),
        title: "Lavar a cozinha",
        assignee: "m3",
        date: shiftDays(1),
        frequency: "weekly",
        done: false,
        participants: ["m1", "m2", "m3"],
      },
      {
        id: uid(),
        title: "Trocar roupa de cama",
        assignee: "m1",
        date: shiftDays(3),
        frequency: "biweekly",
        done: false,
        participants: ["m1", "m2"],
      },
      {
        id: uid(),
        title: "Regar as plantas",
        assignee: "m2",
        date: shiftDays(5),
        frequency: "weekly",
        done: true,
        participants: ["m1", "m2", "m3"],
      },
    ],
    bills: [
      {
        id: uid(),
        title: "Energia",
        amount: 180,
        dueDate: shiftDays(4),
        paid: false,
        paidAt: null,
        payer: "m1",
        split: [
          { memberId: "m1", amount: 90 },
          { memberId: "m2", amount: 90 },
        ],
      },
      {
        id: uid(),
        title: "Água",
        amount: 95,
        dueDate: shiftDays(8),
        paid: false,
        paidAt: null,
        payer: "m2",
        split: [
          { memberId: "m1", amount: 47.5 },
          { memberId: "m2", amount: 47.5 },
        ],
      },
      {
        id: uid(),
        title: "Gás",
        amount: 60,
        dueDate: shiftDays(15),
        paid: false,
        paidAt: null,
        payer: "m3",
        split: [
          { memberId: "m1", amount: 20 },
          { memberId: "m2", amount: 20 },
          { memberId: "m3", amount: 20 },
        ],
      },
      {
        id: uid(),
        title: "Internet",
        amount: 110,
        dueDate: shiftDays(-6),
        paid: true,
        paidAt: shiftDays(-8),
        payer: "m1",
        split: [
          { memberId: "m1", amount: 55 },
          { memberId: "m2", amount: 55 },
        ],
      },
    ],
    shopping: [
      { id: uid(), name: "Leite", category: "Mercado", bought: false },
      { id: uid(), name: "Arroz", category: "Mercado", bought: false },
      { id: uid(), name: "Ovos", category: "Mercado", bought: true },
      { id: uid(), name: "Detergente", category: "Limpeza", bought: false },
      { id: uid(), name: "Papel higiênico", category: "Limpeza", bought: true },
      { id: uid(), name: "Esponja", category: "Limpeza", bought: false },
      { id: uid(), name: "Lâmpada da sala", category: "Casa", bought: false },
    ],
    maintenance: [
      { id: uid(), title: "Trocar filtro da água", date: shiftDays(12) },
      { id: uid(), title: "Revisar o chuveiro", date: shiftDays(26) },
    ],
    notifications: { tasks: true, bills: true, shopping: false },
  };
}

type Ctx = {
  state: MoradaState;
  ready: boolean;
  memberName: (id: string | null) => string;
  update: (patch: Partial<MoradaState>) => void;
  toggleTask: (id: string) => void;
  addTask: (t: Omit<Task, "id" | "done">) => void;
  removeTask: (id: string) => void;
  redistribute: () => void;
  toggleBillPaid: (id: string) => void;
  addBill: (b: Omit<Bill, "id" | "paid" | "paidAt" | "split">) => void;
  addItem: (name: string, category: ShoppingItem["category"]) => void;
  toggleItem: (id: string) => void;
  removeItem: (id: string) => void;
  clearBought: () => void;
  reset: () => void;
};

const MoradaCtx = createContext<Ctx | null>(null);
const KEY = "Morada.state.v1";

export function MoradaProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MoradaState>(() => seed());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...seed(), ...(JSON.parse(raw) as MoradaState) });
    } catch {
      /* ignora dados inválidos */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(state));
  }, [state, ready]);

  const value = useMemo<Ctx>(() => {
    const update = (patch: Partial<MoradaState>) =>
      setState((s) => ({ ...s, ...patch }));

    return {
      state,
      ready,
      update,
      memberName: (id) =>
        state.members.find((m) => m.id === id)?.name ?? state.profile.name,
      toggleTask: (id) =>
        setState((s) => ({
          ...s,
          tasks: s.tasks.map((t) =>
            t.id === id ? { ...t, done: !t.done } : t,
          ),
        })),
      addTask: (t) =>
        setState((s) => ({
          ...s,
          tasks: [{ ...t, id: uid(), done: false }, ...s.tasks],
        })),
      removeTask: (id) =>
        setState((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) })),
      redistribute: () =>
        setState((s) => {
          const pool = s.members.map((m) => m.id);
          return {
            ...s,
            tasks: s.tasks.map((t) => ({
              ...t,
              assignee: pool.length
                ? (pool[Math.floor(Math.random() * pool.length)] ?? null)
                : null,
            })),
          };
        }),
      toggleBillPaid: (id) =>
        setState((s) => ({
          ...s,
          bills: s.bills.map((b) =>
            b.id === id
              ? { ...b, paid: !b.paid, paidAt: b.paid ? null : iso(today()) }
              : b,
          ),
        })),
      addBill: (b) =>
        setState((s) => {
          const people = s.mode === "solo" ? [] : s.members;
          const share = people.length
            ? Number((b.amount / people.length).toFixed(2))
            : 0;
          return {
            ...s,
            bills: [
              {
                ...b,
                id: uid(),
                paid: false,
                paidAt: null,
                split: people.map((m) => ({ memberId: m.id, amount: share })),
              },
              ...s.bills,
            ],
          };
        }),
      addItem: (name, category) =>
        setState((s) => ({
          ...s,
          shopping: [
            { id: uid(), name, category, bought: false },
            ...s.shopping,
          ],
        })),
      toggleItem: (id) =>
        setState((s) => ({
          ...s,
          shopping: s.shopping.map((i) =>
            i.id === id ? { ...i, bought: !i.bought } : i,
          ),
        })),
      removeItem: (id) =>
        setState((s) => ({
          ...s,
          shopping: s.shopping.filter((i) => i.id !== id),
        })),
      clearBought: () =>
        setState((s) => ({
          ...s,
          shopping: s.shopping.filter((i) => !i.bought),
        })),
      reset: () => {
        localStorage.removeItem(KEY);
        setState(seed());
      },
    };
  }, [state, ready]);

  return <MoradaCtx.Provider value={value}>{children}</MoradaCtx.Provider>;
}

export function useMorada() {
  const ctx = useContext(MoradaCtx);
  if (!ctx) throw new Error("useMorada precisa estar dentro de MoradaProvider");
  return ctx;
}
