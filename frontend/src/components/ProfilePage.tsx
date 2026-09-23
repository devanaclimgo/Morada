import { useState } from "react";
import { Camera, KeyRound } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { initials } from "@/components/shared/AppShell";
import { useMorada } from "@/lib/morada-store";

function PasswordDialog() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="press w-full rounded-xl sm:w-auto">
          <KeyRound className="size-4" /> Alterar senha
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-3xl sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Alterar senha</DialogTitle>
          <DialogDescription>Escolha uma senha com pelo menos 8 caracteres.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="senha-atual">Senha atual</Label>
            <Input
              id="senha-atual"
              type="password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              placeholder="••••••••"
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="senha-nova">Nova senha</Label>
            <Input
              id="senha-nova"
              type="password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              placeholder="••••••••"
              className="rounded-xl"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" className="press rounded-xl" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            className="press rounded-xl"
            onClick={() => {
              if (next.length < 8) {
                toast.error("A nova senha precisa ter pelo menos 8 caracteres.");
                return;
              }
              setOpen(false);
              setCurrent("");
              setNext("");
              toast.success("Senha alterada.");
            }}
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function ProfilePage() {
  const { state, update } = useMorada();
  const [form, setForm] = useState(state.profile);

  const changed = JSON.stringify(form) !== JSON.stringify(state.profile);

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <header className="animate-rise">
        <h1 className="text-2xl font-bold lg:text-3xl">Perfil</h1>
        <p className="text-muted-foreground mt-1 text-sm">Suas informações pessoais no Roomy.</p>
      </header>

      <section className="card-soft animate-rise flex items-center gap-4 p-5">
        <div className="relative">
          <Avatar className="size-16">
            {form.avatar ? <AvatarImage src={form.avatar} alt={form.name} /> : null}
            <AvatarFallback className="bg-primary-soft text-primary-soft-foreground font-semibold">
              {initials(form.name || "Roomy")}
            </AvatarFallback>
          </Avatar>
          <label
            className="press bg-primary text-primary-foreground absolute -right-1 -bottom-1 flex size-7 cursor-pointer items-center justify-center rounded-full"
            title="Trocar foto de perfil"
          >
            <Camera className="size-3.5" />
            <span className="sr-only">Trocar foto de perfil</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => setForm((f) => ({ ...f, avatar: String(reader.result) }));
                reader.readAsDataURL(file);
              }}
            />
          </label>
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold">{form.name}</p>
          <p className="text-muted-foreground truncate text-sm">{form.email}</p>
        </div>
      </section>

      <form
        className="card-soft animate-rise space-y-4 p-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (!form.name.trim() || !form.email.includes("@")) {
            toast.error("Preencha nome e e-mail válidos.");
            return;
          }
          update({ profile: form });
          toast.success("Perfil atualizado.");
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="nome">Nome</Label>
          <Input
            id="nome"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="telefone">Telefone</Label>
          <Input
            id="telefone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="(00) 00000-0000"
            className="rounded-xl"
          />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button type="submit" className="press rounded-xl" disabled={!changed}>
            Salvar alterações
          </Button>
          <PasswordDialog />
        </div>
      </form>
    </div>
  );
}
