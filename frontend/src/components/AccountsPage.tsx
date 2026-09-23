import { useMemo, useState } from "react";
import { Check, Plus, Receipt } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  brl,
  dayMonth,
  daysUntil,
  dueLabel,
  iso,
  monthName,
  parseISO,
  today,
  useMorada,
  type Bill,
} from "@/lib/morada-store";

function statusBadge(bill: Bill) {
  if (bill.paid)
    return (
      <Badge className="bg-success text-success-foreground animate-pop rounded-lg">Paga</Badge>
    );
  const d = daysUntil(bill.dueDate);
  if (d < 0)
    return (
      <Badge className="bg-destructive text-destructive-foreground rounded-lg">Vencida</Badge>
    );
  if (d <= 5)
    return <Badge className="bg-warning text-warning-foreground rounded-lg">Vence logo</Badge>;
  return (
    <Badge className="bg-primary-soft text-primary-soft-foreground rounded-lg">Não paga</Badge>
  );
}

function NewBillDialog() {
  const { addBill } = useMorada();
  const { state } = useMorada();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState(iso(today()));
  const [payer, setPayer] = useState(state.members[0]?.id ?? "m1");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="press rounded-xl">
          <Plus className="size-4" /> Nova conta
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-3xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova conta</DialogTitle>
          <DialogDescription>Registre uma conta da casa e o vencimento dela.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bill-title">Nome da conta</Label>
            <Input
              id="bill-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex.: Energia"
              className="rounded-xl"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="bill-amount">Valor (R$)</Label>
              <Input
                id="bill-amount"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="180,00"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bill-due">Vencimento</Label>
              <Input
                id="bill-due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="rounded-xl"
              />
            </div>
          </div>
          {state.mode === "roommates" ? (
            <div className="space-y-2">
              <Label>Responsável pelo pagamento</Label>
              <Select value={payer} onValueChange={setPayer}>
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
            </div>
          ) : null}
        </div>
        <DialogFooter>
          <Button variant="ghost" className="press rounded-xl" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            className="press rounded-xl"
            onClick={() => {
              const value = Number(amount.replace(/\./g, "").replace(",", "."));
              if (!title.trim() || !value) {
                toast.error("Informe o nome e o valor da conta.");
                return;
              }
              addBill({
                title: title.trim(),
                amount: value,
                dueDate,
                payer: state.mode === "roommates" ? payer : null,
              });
              toast.success("Conta adicionada.");
              setTitle("");
              setAmount("");
              setOpen(false);
            }}
          >
            Salvar conta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function BillDetails({ bill }: { bill: Bill }) {
  const { state, toggleBillPaid, memberName } = useMorada();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="press hover:bg-muted/60 flex w-full items-center gap-3 rounded-xl px-2 py-3 text-left transition-colors">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{bill.title}</p>
            <p className="text-muted-foreground text-xs">
              {bill.paid ? `Paga em ${dayMonth(bill.paidAt ?? bill.dueDate)}` : dueLabel(bill.dueDate)}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-sm font-semibold">{brl(bill.amount)}</span>
            {statusBadge(bill)}
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="rounded-3xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{bill.title}</DialogTitle>
          <DialogDescription>Detalhes da conta e divisão entre os moradores.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-3xl font-bold">{brl(bill.amount)}</p>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Vencimento</dt>
              <dd className="font-medium">{dayMonth(bill.dueDate)}</dd>
            </div>
            {state.mode === "roommates" ? (
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Responsável</dt>
                <dd className="font-medium">{memberName(bill.payer)}</dd>
              </div>
            ) : null}
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Status</dt>
              <dd>{statusBadge(bill)}</dd>
            </div>
            {bill.paid && bill.paidAt ? (
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Data do pagamento</dt>
                <dd className="font-medium">{dayMonth(bill.paidAt)}</dd>
              </div>
            ) : null}
          </dl>

          {state.mode === "roommates" && bill.split.length ? (
            <div className="bg-muted/60 rounded-2xl p-4">
              <p className="mb-2 text-xs font-semibold tracking-wide uppercase opacity-70">
                Divisão
              </p>
              <ul className="space-y-1.5 text-sm">
                {bill.split.map((s) => (
                  <li key={s.memberId} className="flex justify-between gap-4">
                    <span>{memberName(s.memberId)}</span>
                    <span className="font-medium">{brl(s.amount)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
        <DialogFooter>
          <Button
            className="press w-full rounded-xl"
            variant={bill.paid ? "outline" : "default"}
            onClick={() => {
              toggleBillPaid(bill.id);
              toast.success(bill.paid ? "Conta marcada como não paga." : "Conta marcada como paga.");
            }}
          >
            {bill.paid ? (
              "Desfazer pagamento"
            ) : (
              <>
                <Check className="size-4" /> Marcar como paga
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function BillsPage() {
  const { state } = useMorada();

  const groups = useMemo(() => {
    const map = new Map<string, Bill[]>();
    [...state.bills]
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      .forEach((b) => {
        const d = parseISO(b.dueDate);
        const key = `${monthName(d.getMonth())} de ${d.getFullYear()}`;
        map.set(key, [...(map.get(key) ?? []), b]);
      });
    return [...map.entries()];
  }, [state.bills]);

  const openTotal = state.bills.filter((b) => !b.paid).reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="space-y-5">
      <header className="animate-rise grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold lg:text-3xl">Contas</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {openTotal > 0 ? `${brl(openTotal)} em aberto` : "Nenhuma conta em aberto."}
          </p>
        </div>
        <NewBillDialog />
      </header>

      {groups.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {groups.map(([label, bills], i) => (
            <section
              key={label}
              className="card-soft animate-rise p-5"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <h2 className="text-muted-foreground mb-1 text-xs font-semibold tracking-wide uppercase">
                {label}
              </h2>
              <div className="divide-border divide-y">
                {bills.map((b) => (
                  <BillDetails key={b.id} bill={b} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="card-soft">
          <EmptyState
            icon={Receipt}
            title="Nenhuma conta por enquanto."
            description="Cadastre as contas da casa para acompanhar os vencimentos."
            action={<NewBillDialog />}
          />
        </div>
      )}
    </div>
  );
}
