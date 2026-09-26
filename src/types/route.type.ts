import type { LucideIcon } from "lucide-react";

export type RouteItems = {
  title: string;
  url: string;
  icon?: LucideIcon;
};

export type Routes = {
  items: RouteItems[];
};
