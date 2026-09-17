import { useState, type ReactNode } from "react";
import { Plus, ShoppingBasket, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/shared/EmptyState";
import { useMorada, type ShoppingItem } from "@/lib/morada-store";

const CATEGORIES: ShoppingItem["category"][] = ["Mercado", "Limpeza", "Casa"];

export function ShoppingListPanel() {
  const { state, addItem, toggleItem, removeItem, clearBought } = useMorada();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ShoppingItem["category"]>("Mercado");

  const submit = () => {
    const value = name.trim();
    if (!value) {
      toast.error("Escreva o nome do item.");
      return;
    }
    addItem(value, category);
    setName("");
    toast.success(`${value} foi adicionado à lista.`);
  };

  const hasItems = state.shopping.length > 0;
  const bought = state.shopping.filter((i) => i.bought).length;

  return (
    <div className="flex flex-col gap-4">
      <form
        className="flex flex-col gap-2 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="O que você precisa comprar?"
          aria-label="Nome do item"
          className="rounded-xl"
        />
        <div className="flex gap-2">
          <Select
            value={category}
            onValueChange={(v) => setCategory(v as ShoppingItem["category"])}
          >
            <SelectTrigger
              className="w-full rounded-xl sm:w-32"
              aria-label="Categoria"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit" className="press shrink-0 rounded-xl">
            <Plus className="size-4" /> Adicionar item
          </Button>
        </div>
      </form>

      {hasItems ? (
        <div className="space-y-5">
          {CATEGORIES.map((cat) => {
            const items = state.shopping.filter((i) => i.category === cat);
            if (!items.length) return null;
            return (
              <div key={cat}>
                <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
                  {cat}
                </p>
                <ul className="space-y-1">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="group hover:bg-muted/60 flex items-center gap-3 rounded-xl px-2 py-2 transition-colors"
                    >
                      <Checkbox
                        id={`item-${item.id}`}
                        checked={item.bought}
                        onCheckedChange={() => toggleItem(item.id)}
                        className={item.bought ? "animate-pop" : ""}
                      />
                      <label
                        htmlFor={`item-${item.id}`}
                        className={`min-w-0 flex-1 cursor-pointer text-sm transition-all ${
                          item.bought
                            ? "text-muted-foreground line-through"
                            : "text-foreground"
                        }`}
                      >
                        {item.name}
                      </label>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Remover ${item.name}`}
                        className="press text-muted-foreground hover:text-destructive size-8 rounded-lg opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
                        onClick={() => {
                          removeItem(item.id);
                          toast.success("Item removido.");
                        }}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
          {bought > 0 ? (
            <Button
              variant="ghost"
              size="sm"
              className="press text-muted-foreground rounded-xl"
              onClick={() => {
                clearBought();
                toast.success("Itens comprados foram removidos.");
              }}
            >
              Limpar itens comprados ({bought})
            </Button>
          ) : null}
        </div>
      ) : (
        <EmptyState
          icon={ShoppingBasket}
          title="Sua lista está vazia."
          description="Adicione algo que você precisa comprar."
        />
      )}
    </div>
  );
}

export function ShoppingDrawer({ children }: { children: ReactNode }) {
  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="max-h-[88vh]">
        <div className="mx-auto w-full max-w-lg overflow-y-auto px-4 pb-8">
          <DrawerHeader className="px-0 text-left">
            <DrawerTitle>Lista de compras</DrawerTitle>
            <DrawerDescription>
              Marque o que já foi comprado e adicione o que faltar.
            </DrawerDescription>
          </DrawerHeader>
          <ShoppingListPanel />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
