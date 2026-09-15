import { useState } from "react";
import {
  Apple,
  Download,
  MoreVertical,
  Plus,
  Share,
  Smartphone,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LucideIcon } from "lucide-react";

const IPHONE: { icon: LucideIcon; text: string }[] = [
  { icon: Smartphone, text: "Abra o Morada no Safari." },
  { icon: Share, text: "Toque no botão de compartilhar." },
  { icon: Plus, text: 'Escolha "Adicionar à Tela de Início".' },
  { icon: Download, text: 'Toque em "Adicionar".' },
];

const ANDROID: { icon: LucideIcon; text: string }[] = [
  { icon: Smartphone, text: "Abra o Morada no navegador." },
  { icon: MoreVertical, text: "Abra o menu do navegador." },
  { icon: Plus, text: 'Escolha "Adicionar à tela inicial".' },
  { icon: Download, text: "Confirme a instalação." },
];

function Steps({ steps }: { steps: { icon: LucideIcon; text: string }[] }) {
  return (
    <ol className="mt-4 space-y-3">
      {steps.map((s, i) => (
        <li
          key={s.text}
          className="bg-muted/60 animate-rise flex items-center gap-3 rounded-xl p-3"
          style={{ animationDelay: `${i * 45}ms` }}
        >
          <div className="bg-card text-primary flex size-9 shrink-0 items-center justify-center rounded-lg shadow-sm">
            <s.icon className="size-4" />
          </div>
          <span className="text-foreground min-w-0 text-sm">
            <span className="text-muted-foreground mr-1 font-semibold">
              {i + 1}.
            </span>
            {s.text}
          </span>
        </li>
      ))}
    </ol>
  );
}

export function InstallAppDialog({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size={compact ? "icon" : "sm"}
          className="press text-primary hover:bg-primary-soft rounded-xl"
          aria-label="Instalar aplicativo"
        >
          <Smartphone className="size-4" />
          {compact ? null : (
            <span className="hidden sm:inline">Instalar aplicativo</span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-3xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Instale o Morada no seu celular</DialogTitle>
          <DialogDescription>
            Adicione o Morada à tela inicial para acessar suas tarefas, contas e
            listas de compras como um aplicativo.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="iphone">
          <TabsList className="w-full rounded-xl">
            <TabsTrigger value="iphone" className="flex-1 rounded-lg">
              <Apple className="mr-1 size-4" /> iPhone
            </TabsTrigger>
            <TabsTrigger value="android" className="flex-1 rounded-lg">
              <Smartphone className="mr-1 size-4" /> Android
            </TabsTrigger>
          </TabsList>
          <TabsContent value="iphone">
            <Steps steps={IPHONE} />
          </TabsContent>
          <TabsContent value="android">
            <Steps steps={ANDROID} />
          </TabsContent>
        </Tabs>
        <Button
          className="press mt-2 w-full rounded-xl"
          onClick={() => setOpen(false)}
        >
          Entendi
        </Button>
      </DialogContent>
    </Dialog>
  );
}
