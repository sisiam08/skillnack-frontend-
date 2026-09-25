"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TaxonomyItem } from "@/types";
import { X } from "lucide-react";

type TaxonomyMultiSelectProps = {
  options: TaxonomyItem[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
};

export default function TaxonomyMultiSelect({
  options,
  selectedIds,
  onChange,
  disabled,
  placeholder = "Type to search...",
}: TaxonomyMultiSelectProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const selected = options.filter((option) => selectedIds.includes(option.id));
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = options
    .filter(
      (option) =>
        !selectedIds.includes(option.id) &&
        (normalizedQuery === "" ||
          option.name.toLowerCase().includes(normalizedQuery)),
    )
    .slice(0, 8);

  const add = (id: string) => {
    onChange([...selectedIds, id]);
    setQuery("");
  };

  const remove = (id: string) => {
    onChange(selectedIds.filter((value) => value !== id));
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2 rounded-md border border-input bg-background px-2 py-2">
        {selected.map((item) => (
          <Badge key={item.id} variant="secondary" className="gap-1">
            {item.name}
            <button
              type="button"
              disabled={disabled}
              aria-label={`Remove ${item.name}`}
              onClick={() => remove(item.id)}
              className="rounded-full p-0.5 hover:bg-muted"
            >
              <X className="size-3" />
            </button>
          </Badge>
        ))}

        <Input
          value={query}
          disabled={disabled}
          placeholder={selected.length > 0 ? "" : placeholder}
          className="h-7 flex-1 border-0 p-1 shadow-none focus-visible:ring-0"
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 150)}
        />
      </div>

      {open && !disabled && filtered.length > 0 ? (
        <div className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-md border bg-popover p-1 shadow-md">
          {filtered.map((item) => (
            <button
              key={item.id}
              type="button"
              className="flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => add(item.id)}
            >
              <span>{item.name}</span>
              {item.category?.name ? (
                <span className="text-xs text-muted-foreground">
                  {item.category.name}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      ) : null}

      {options.length === 0 ? (
        <p className="mt-1 text-xs text-muted-foreground">
          No options available yet. An admin can add them from the dashboard.
        </p>
      ) : null}
    </div>
  );
}
