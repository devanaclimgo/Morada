export type Kind = "task" | "bill" | "maintenance";

export type Event = {
  id: string;
  kind: Kind;
  title: string;
  date: string;
  detail: string;
  extra?: string;
};